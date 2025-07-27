"use client";

import { useMap } from "../model/useMap";

interface Props {
  lat: number;
  lon: number;
  zoom: number;
}

const Map = ({ lat, lon, zoom }: Props) => {
  const { mapRef, isClient } = useMap(lat, lon, zoom);

  if (!isClient) {
    return (
      <div
        className="w-full h-full"
        style={{
          zIndex: 1,
          backgroundColor: "#f0f0f0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px"
        }}>
        <p className="text-gray-500">지도를 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full" 
      style={{ 
        zIndex: 1,
        minHeight: "200px"
      }} 
    />
  );
};

export default Map;
