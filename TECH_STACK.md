# 🛠️ OCEAN SCOPE: Technical Architecture

The system is built on a modern, distributed architecture designed for low-latency telemetry processing and high-fidelity visualization.

## 🗄️ Backend Layer (Prometheus Node)
- **Framework**: Flask (Python 3.11)
- **Data Engine**: Pandas & NumPy for real-time statistical processing.
- **Machine Learning**: Scikit-learn (Linear Regression) for predictive temporal drift analysis.
- **AI Orchestration**: OpenRouter API (OpenAI-compatible) using the `google/gemini-2.0-flash-exp:free` archetype.
- **Environment**: Python-dotenv for secure credential management.

## 🎨 Frontend Layer (Command Center)
- **Framework**: React 18+ (Vite)
- **Styling**: Tailwind CSS v4 (Glassmorphism design language).
- **Animations**: Framer Motion for high-fidelity transitions and UI feedback.
- **Visualization Suite**:
    - **Chart.js**: Temporal Drift, Seasonal Pulse, and Bar distributions.
    - **Leaflet**: Geospatial telemetry mapping.
    - **Lucide React**: Vector-based iconography.
- **Networking**: Axios for asynchronous telemetry synchronization.

## 📡 Data Flow
1. **Query Ingress**: User submits a free-text or structured query via the ChatBox.
2. **Logic Engine**: Backend parses the query using Regex pattern matching to extract time clusters.
3. **Telemetry Synthesis**: Pandas filters the global ARGO dataset (21,000+ records) and calculates regional/global statistics.
4. **AI Generation**: Telemetry results are passed to OpenRouter as a structured prompt.
5. **Egress**: Frontend renders the multi-module dashboard with unique visualizations for the synchronised data.
