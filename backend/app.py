import os
import re
import pandas as pd
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from sklearn.linear_model import LinearRegression
import requests
import json
from dotenv import load_dotenv

# Load Environment
load_dotenv()
OPENROUTER_KEY = os.getenv("OPENROUTER_API_KEY", "").strip()
DATA_PATH = os.getenv("DATA_PATH", "f:/MCP/backend/argo_bob_temperature.csv")

def call_openrouter(prompt, model="google/gemini-2.0-flash-exp:free"):
    if not OPENROUTER_KEY:
        return "AI Briefing Offline. OpenRouter Key missing in .env."
    
    try:
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps({
                "model": model,
                "messages": [
                    {"role": "user", "content": prompt}
                ]
            })
        )
        if response.status_code == 200:
            return response.json()['choices'][0]['message']['content']
        else:
            return f"OpenRouter Error {response.status_code}: {response.text}"
    except Exception as e:
        return f"Node Connection Error: {str(e)}"

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Load dataset (preprocessed CSV)
DATA_PATH = r"f:/MCP/backend/argo_bob_temperature.csv"
try:
    df = pd.read_csv(DATA_PATH)
    # Ensure date/year columns exist per user instructions
    if 'date' in df.columns:
        df['date'] = pd.to_datetime(df['date'])
        df['year'] = df['date'].dt.year
    
    # Normalize lat/lon names
    if 'latitude' in df.columns: df.rename(columns={'latitude': 'lat'}, inplace=True)
    if 'longitude' in df.columns: df.rename(columns={'longitude': 'lon'}, inplace=True)
except Exception as e:
    raise RuntimeError(f"Failed to load dataset at {DATA_PATH}: {e}")

# Expected columns: year, lat, lon, temperature

def parse_query(query: str):
    """Extract start and end year from a free‑text query.
    Supports patterns like:
      "from 2019 to 2024"
      "between 2018 and 2021"
      "2019-2022"
    Returns (start_year, end_year) as ints or (None, None) if not found.
    """
    # Find all 4‑digit numbers
    years = re.findall(r"(20\d{2})", query)
    if len(years) >= 2:
        start, end = map(int, years[:2])
        if start > end:
            start, end = end, start
        return start, end
    elif len(years) == 1:
        year = int(years[0])
        return year, year
    return None, None

@app.route('/api/query', methods=['POST'])
def query():
    data = request.get_json()
    if not data or 'query' not in data:
        return jsonify({"error": "Missing 'query' field"}), 400
    user_query = data['query']
    start_year, end_year = parse_query(user_query)
    
    # Default to all-time if years not found or invalid
    if not start_year: start_year = int(df['year'].min())
    if not end_year: end_year = int(df['year'].max())

    # Filter dataframe
    mask = (df['year'] >= start_year) & (df['year'] <= end_year)
    filtered = df.loc[mask]
    if filtered.empty:
        return jsonify({"error": "No data for the selected period"}), 404

    # 1. Yearly averages (Time Series / Bar Chart)
    yearly = filtered.groupby('year')['temperature'].mean().reset_index()
    chart_data = yearly.to_dict(orient='records')

    # 2. Temperature Distribution (Pie Chart)
    bins = [0, 20, 25, 27, 29, 31, 100]
    labels = ["Cold (<20)", "Cool (20-25)", "Moderate (25-27)", "Warm (27-29)", "Hot (29-31)", "Extreme (>31)"]
    filtered_copy = filtered.copy()
    filtered_copy['category'] = pd.cut(filtered_copy['temperature'], bins=bins, labels=labels)
    pie_data = filtered_copy['category'].value_counts().reset_index()
    pie_data.columns = ['label', 'value']
    pie_dict = pie_data.to_dict(orient='records')

    # Map data (first 500 points for performance)
    map_data = filtered[['lat', 'lon', 'temperature']].head(500).to_dict(orient='records')

    # Linear regression
    X = yearly['year'].values.reshape(-1, 1)
    y = yearly['temperature'].values
    model = LinearRegression()
    model.fit(X, y)
    slope = model.coef_[0]
    direction = "increasing" if slope > 0 else "decreasing" if slope < 0 else "stable"

    # Statistics
    stats = {
        "avg": float(filtered['temperature'].mean()),
        "max": float(filtered['temperature'].max()),
        "min": float(filtered['temperature'].min()),
        "count": int(len(filtered))
    }

    # Calculate Global Stats (Entire Dataset)
    g_yearly = df.groupby('year')['temperature'].mean().reset_index()
    g_X = g_yearly['year'].values.reshape(-1, 1)
    g_y = g_yearly['temperature'].values
    g_model = LinearRegression().fit(g_X, g_y)
    g_slope = g_model.coef_[0]
    g_direction = "increasing" if g_slope > 0 else "decreasing"
    
    global_stats = {
        "avg": float(df['temperature'].mean()),
        "max": float(df['temperature'].max()),
        "min": float(df['temperature'].min()),
        "count": int(len(df)),
        "trend_direction": g_direction,
        "trend_slope": float(g_slope)
    }

    # Generate AI Briefing via OpenRouter
    selected_model = data.get('model', 'google/gemini-2.0-flash-exp:free')
    prompt = (
        f"As the OCEAN SCOPE artificial intelligence unit, analyze the telemetry from {start_year} to {end_year}. "
        f"Global Average: {global_stats['avg']:.2f}C. Queried Slice Average: {stats['avg']:.2f}C. "
        f"Observed Trend: {direction} at {abs(slope):.4f}C/year. "
        f"Please provide a structured report with these exact sections: "
        f"1. MISSION STATUS (What is our current objective?) "
        f"2. TECHNICAL AUDIT (Explain the data trends in professional terms) "
        f"3. ENVIRONMENTAL IMPACT (What does this mean for the Bay of Bengal?) "
        f"4. BRIEFING FOR NON-EXPERTS (Explain this simply as if talking to a curious student). "
        f"Keep each section concise but informative."
    )
    ai_briefing = call_openrouter(prompt, model=selected_model)

    # Generate Observations (Static)
    warmest_year = yearly.loc[yearly['temperature'].idxmax(), 'year']
    observations = [
        f"Significant {direction} trend detected at {abs(slope):.4f}C/yr.",
        f"Peak thermal stress identified in {int(warmest_year)} (Avg: {yearly['temperature'].max():.2f}C).",
        f"Data distribution shows {len(filtered)} valid profiles processed."
    ]

    # Predictive Data
    last_year = int(yearly['year'].max())
    future_years = np.array([last_year + 1, last_year + 2, last_year + 3]).reshape(-1, 1)
    future_preds = model.predict(future_years)
    predictions = [{"year": int(y[0]), "temperature": float(p)} for y, p in zip(future_years, future_preds)]

    # Advanced Visualization Data
    # 1. Seasonal Pulse (Monthly Averages)
    df_copy = filtered.copy()
    if 'date' in df_copy.columns:
        df_copy['month'] = df_copy['date'].dt.month
        seasonal = df_copy.groupby('month')['temperature'].mean().reset_index()
        seasonal_dict = seasonal.to_dict(orient='records')
    else:
        seasonal_dict = []

    # 2. Thermal Anomalies (vs Global Avg)
    # Using 28.5C as a hypothetical baseline if global mean isn't stable enough, 
    # but let's use global_stats['avg'] calculated earlier.
    global_avg = float(df['temperature'].mean())
    filtered_copy['anomaly'] = filtered_copy['temperature'] - global_avg
    anomaly_summary = [
        {"name": "Above Normal", "value": int((filtered_copy['anomaly'] > 0).sum())},
        {"name": "Below Normal", "value": int((filtered_copy['anomaly'] <= 0).sum())}
    ]

    # 3. Latitudinal Drift (Core correlation)
    lat_drift = filtered[['lat', 'temperature']].sample(min(300, len(filtered))).to_dict(orient='records')

    # 4. Monthly Heatmap Data (Year vs Month)
    if 'date' in df_copy.columns:
        heatmap = df_copy.groupby(['year', 'month'])['temperature'].mean().unstack().fillna(0).to_dict(orient='index')
    else:
        heatmap = {}

    return jsonify({
        "chartData": chart_data,
        "pieData": pie_dict,
        "mapData": map_data,
        "seasonalData": seasonal_dict,
        "anomalyData": anomaly_summary,
        "latDrift": lat_drift,
        "heatmap": heatmap,
        "ai_briefing": ai_briefing,
        "stats": stats,
        "global_stats": global_stats,
        "trend": {"direction": direction, "slope": float(slope)},
        "observations": observations,
        "predictions": predictions,
        "raw_data": filtered[['year', 'lat', 'lon', 'temperature']].to_dict(orient='records')
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
