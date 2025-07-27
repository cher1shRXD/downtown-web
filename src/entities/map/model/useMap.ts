"use client";

import { useEffect, useRef, useState } from 'react';

export const useMap = (lat: number, lon: number, zoom: number) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !mapRef.current || mapInstanceRef.current) return;

    const initMap = async () => {
      try {
        const L = await import('leaflet');
        
        if (typeof window !== 'undefined') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
          document.head.appendChild(link);
        }

        if (!mapRef.current || mapRef.current.offsetWidth === 0) {
          return;
        }

        const map = L.map(mapRef.current).setView([lat, lon], zoom);
        mapInstanceRef.current = map;

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "&copy; OpenStreetMap contributors",
          maxZoom: 18,
          minZoom: 1,
        }).addTo(map);

        L.marker([lat, lon])
          .addTo(map)
          .bindPopup("여기에 마커가 표시됩니다")
          .openPopup();

        // 지도가 완전히 로드된 후 invalidateSize 호출
        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 100);
      } catch (error) {
        console.error('지도 초기화 오류:', error);
      }
    };

    initMap();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isClient, lat, lon, zoom]);

  return {
    mapRef,
    isClient
  };
}; 