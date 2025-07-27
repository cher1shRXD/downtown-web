"use client";

import { MediaType } from "../types/media-type";
import { PhotoItem } from "../types/photo-item";
import { usePhotoGrid } from "../model/usePhotoGrid";

interface Props {
  items: PhotoItem[];
  mediaType: MediaType;
  onLoadMore: () => void;
}

const PhotoGrid = ({ items, mediaType, onLoadMore }: Props) => {
  const { columns, containerRef, sentinelRef } = usePhotoGrid(
    items,
    mediaType,
    onLoadMore
  );

  return (
    <div className="w-full">
      <div ref={containerRef} className="w-full flex gap-2">
        {columns.map((column, columnIndex) => (
          <div key={columnIndex} className="flex-1 flex flex-col gap-2">
            {column.map((item) => (
              <div
                key={item.id}
                className="relative overflow-hidden rounded-lg bg-gray-100"
                style={{
                  aspectRatio: `${item.width}/${item.height}`,
                }}>
                {item.type === "image" ? (
                  <img
                    src={item.url}
                    alt={item.alt || ""}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    preload="metadata"
                    muted
                  />
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      {/* 무한스크롤을 위한 sentinel 요소 */}
      <div 
        ref={sentinelRef} 
        className="w-full h-4 mt-4"
        style={{ visibility: "hidden" }}
      />
    </div>
  );
};

export default PhotoGrid;
