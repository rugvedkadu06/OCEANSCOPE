// src/components/MapPanel.jsx
import React from "react";
import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function MapPanel({ points }) {
  const position = [15.0, 88.0]; // Re-centered for better view of BoB

  return (
    <div className="w-full bg-zinc-950 border-2 border-zinc-900 rounded-none p-1 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.05)] h-[450px] overflow-hidden">
      <MapContainer center={position} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {points.map((pt, idx) => {
          const color = pt.temperature > 28 ? "#f87171" : pt.temperature > 25 ? "#fbbf24" : "#60a5fa";
          return (
            <CircleMarker
              key={idx}
              center={[pt.lat, pt.lon]}
              radius={6}
              pathOptions={{ 
                color: color, 
                fillColor: color,
                fillOpacity: 0.8,
                weight: 2
              }}
            >
              <Popup>
                <div className="font-sans">
                  <p className="font-bold text-lg mb-1">{pt.temperature.toFixed(2)}°C</p>
                  <p className="text-xs text-gray-500">{pt.lat.toFixed(3)}°N, {pt.lon.toFixed(3)}°E</p>
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
