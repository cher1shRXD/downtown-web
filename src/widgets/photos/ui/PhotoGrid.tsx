"use client";

import { MediaType } from "../types/media-type";
import { PhotoItem } from "../types/photo-item";
import Masonry from "react-masonry-css";

interface Props {
  items: PhotoItem[];
  mediaType: MediaType;
  loadMoreRef: (node?: Element | null) => void;
  isLoading?: boolean;
  isFetchingNextPage?: boolean;
}

const PhotoGrid = ({ items, mediaType, loadMoreRef, isLoading, isFetchingNextPage }: Props) => {
  const breakpointColumns = {
    default: 3,
    1100: 2,
    700: 1
  };

  return (
    <div className="w-full">
      <Masonry
        breakpointCols={breakpointColumns}
        className="flex gap-2"
        columnClassName="flex flex-col gap-2"
      >
        {items.map((item) => (
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
      </Masonry>
      
      {/* 무한스크롤을 위한 sentinel 요소 */}
      <div 
        ref={loadMoreRef} 
        className="w-full h-4 mt-4 flex items-center justify-center"
      >
        {isFetchingNextPage && (
          <div className="text-gray-500 text-sm">더 많은 사진을 불러오는 중...</div>
        )}
      </div>
    </div>
  );
};

export default PhotoGrid;
