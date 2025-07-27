"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MediaType } from "../types/media-type";
import { PhotoItem } from "../types/photo-item";

export const usePhotoGrid = (items: PhotoItem[], mediaType: MediaType, onLoadMore: () => void) => {
  const [columns, setColumns] = useState<PhotoItem[][]>([[], [], []]);
  const containerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (mediaType === "all") return true;
      if (mediaType === "image") return item.type === "image";
      if (mediaType === "video") return item.type === "video";
      return true;
    });
  }, [items, mediaType]);

  const calculateLayout = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.offsetWidth;
    const gap = 8;
    const minColumnWidth = 200;
    const columnCount = Math.max(1, Math.floor((containerWidth + gap) / (minColumnWidth + gap)));
    
    const newColumns: PhotoItem[][] = Array.from({ length: columnCount }, () => []);

    filteredItems.forEach((item) => {
      let shortestColumnIndex = 0;
      let shortestHeight = Infinity;

      newColumns.forEach((column, index) => {
        const columnHeight = column.reduce((sum, photo) => {
          const aspectRatio = photo.height / photo.width;
          const photoHeight = (containerWidth / columnCount - gap) * aspectRatio;
          return sum + photoHeight + gap;
        }, 0);

        if (columnHeight < shortestHeight) {
          shortestHeight = columnHeight;
          shortestColumnIndex = index;
        }
      });

      newColumns[shortestColumnIndex].push(item);
    });

    setColumns(newColumns);
  }, [filteredItems]);

  useEffect(() => {
    calculateLayout();
  }, [calculateLayout]);

  useEffect(() => {
    const handleResize = () => {
      calculateLayout();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateLayout]);

  useEffect(() => {
    if (!onLoadMore || !sentinelRef.current) return;

    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };

    const handleIntersection = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    observer.observe(sentinelRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onLoadMore]);

  return {
    columns,
    containerRef,
    sentinelRef
  };
}; 