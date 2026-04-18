# 🧭 OCEAN SCOPE: Project Scope & Analytical Logic

This document defines the analytical modules within the OCEAN SCOPE dashboard and the logic behind their observations.

## 🎯 Project Objective
To provide a non-expert friendly, high-fidelity platform for monitoring the thermal health of the Bay of Bengal using 15 years of ARGO telemetry.

## 📊 Modules & Visualizations

### 1. Explorer (Geospatial Audit)
- **Visual**: Interactive Topographical Map + Master Stats Cards.
- **Logic**: Plots the exact latitude/longitude of telemetry nodes for the selected period.
- **Observation**: Explains the spatial density (how many sensors were active) and identifies current heat clusters.

### 2. Trending Up (Temporal Drift)
- **Visual**: 600px High-Resolution Line Chart + Prediction Overlay.
- **Logic**: Uses Linear Regression to calculate the "Slope" of temperature change over time.
- **Observation**: Summarizes the warming rate (e.g., +0.02°C/year) and predicts the thermal state for the next 3 years.

### 3. Query Stats (Correlation & Cyclical)
- **Seasonal Pulse**: Tracks monthly variations.
- **Anomaly Weighting**: Compares current data against the global 15-year average.
- **Logic**: Divides data into "Above Normal" and "Below Normal" buckets to identify Marine Heatwaves.

### 4. AI Briefing (The Intelligence Layer)
- **Visual**: Structured Expert Report.
- **Logic**: Consolidates all statistical data into a 4-part report using Gemini 1.5 Flash.
- **Goal**: Simplifies complex oceanographic findings into a "Briefing for Non-Experts."

## 🔬 Observation Logic
Every chart in the system is programmed with an **Observation Block**. These blocks translate raw data coefficients into human-readable insights:
- **Rate Observation**: Converts slope values into "Increasing," "Decreasing," or "Stable."
- **Stress Observation**: Identifies the year with the maximum recorded temperature for that specific query.
- **Deviance Observation**: Explains whether the region is warmer or cooler than the global baseline.
