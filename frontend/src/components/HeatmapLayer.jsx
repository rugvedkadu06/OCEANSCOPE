// src/components/HeatmapLayer.jsx
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.heat";

export default function HeatmapLayer({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!points || points.length === 0) return;

    // Normalize intensity based on actual temp range (e.g. 20 - 32 deg)
    const minTemp = Math.min(...points.map(p => p.temperature));
    const maxTemp = Math.max(...points.map(p => p.temperature));
    const range = maxTemp - minTemp || 1;

    // Format: [lat, lon, intensity]
    const heatData = points.map((p) => [
      p.lat,
      p.lon,
      (p.temperature - minTemp) / range // Full 0-1 range for colors
    ]);

    const heatLayer = L.heatLayer(heatData, {
      radius: 30,
      blur: 20,
      max: 1.0,
      gradient: { 0.2: 'blue', 0.5: 'yellow', 1.0: 'red' }
    }).addTo(map);

    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points]);

  return null;
}
