"use client";

import { Film, GalleryVerticalEnd, Image } from "lucide-react";
import PhotoGrid from "./PhotoGrid";
import { usePhotos } from "../model/usePhotos";

const Photos = () => {
  const { 
    mediaType, 
    photos, 
    handleMediaTypeChange, 
    loadMoreRef, 
    isLoading, 
    isError, 
    isFetchingNextPage 
  } = usePhotos();

  if (isError) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-red-500">사진을 불러오는 중 오류가 발생했습니다.</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col overflow-y-scroll scrollbar-hide relative">
      <div className="w-full px-8 bg-white sticky top-0 z-10">
        <div className="w-full flex items-center">
          <span
            className="flex-1 h-14 flex items-center justify-center cursor-pointer"
            onClick={() => handleMediaTypeChange("all")}>
            <GalleryVerticalEnd
              className={`${mediaType === "all" ? "text-black" : "text-gray-400"} transition-all delay-75`}
            />
          </span>
          <span
            className="flex-1 h-14 flex items-center justify-center cursor-pointer"
            onClick={() => handleMediaTypeChange("image")}>
            <Image
              className={`${mediaType === "image" ? "text-black" : "text-gray-400"} transition-all delay-75`}
            />
          </span>
          <span
            className="flex-1 h-14 flex items-center justify-center cursor-pointer"
            onClick={() => handleMediaTypeChange("video")}>
            <Film
              className={`${mediaType === "video" ? "text-black" : "text-gray-400"} transition-all delay-75`}
            />
          </span>
        </div>
        <div className="w-full h-[2px] relative bg-gray-200">
          <div
            className={`w-1/3 h-full bg-black absolute transition-all ${
              mediaType === "all"
                ? "left-0"
                : mediaType === "image"
                ? "left-1/3"
                : "left-2/3"
            }`}
          />
        </div>
      </div>

      <div className="w-full flex-1 px-8 pt-2">
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-gray-500">사진을 불러오는 중...</div>
          </div>
        ) : (
          <PhotoGrid
            items={photos}
            mediaType={mediaType}
            loadMoreRef={loadMoreRef}
            isLoading={isLoading}
            isFetchingNextPage={isFetchingNextPage}
          />
        )}
      </div>
    </div>
  );
};

export default Photos;
