"use client";

import { useState } from "react";
import { MediaType } from "../types/media-type";
import { PhotoItem } from "../types/photo-item";

// 샘플 데이터 (나중에 API로 교체)
const samplePhotos: PhotoItem[] = [
  {
    id: "1",
    url: "https://picsum.photos/400/600?random=1",
    type: "image",
    width: 400,
    height: 600,
    alt: "Sample image 1"
  },
  {
    id: "2",
    url: "https://picsum.photos/400/400?random=2",
    type: "image",
    width: 400,
    height: 400,
    alt: "Sample image 2"
  },
  {
    id: "3",
    url: "https://picsum.photos/400/800?random=3",
    type: "image",
    width: 400,
    height: 800,
    alt: "Sample image 3"
  },
  {
    id: "4",
    url: "https://picsum.photos/400/500?random=4",
    type: "image",
    width: 400,
    height: 500,
    alt: "Sample image 4"
  },
  {
    id: "5",
    url: "https://picsum.photos/400/700?random=5",
    type: "image",
    width: 400,
    height: 700,
    alt: "Sample image 5"
  },
  {
    id: "6",
    url: "https://picsum.photos/400/300?random=6",
    type: "image",
    width: 400,
    height: 300,
    alt: "Sample image 6"
  },
  {
    id: "7",
    url: "https://picsum.photos/400/900?random=7",
    type: "image",
    width: 400,
    height: 900,
    alt: "Sample image 7"
  },
  {
    id: "8",
    url: "https://picsum.photos/400/450?random=8",
    type: "image",
    width: 400,
    height: 450,
    alt: "Sample image 8"
  }
];

export const usePhotos = () => {
  const [mediaType, setMediaType] = useState<MediaType>("all");
  
  const handleLoadMore = () => {
    // 나중에 API 호출로 교체
    console.log("더 많은 사진을 로드합니다...");
  };

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
  };
  
  return {
    mediaType,
    photos: samplePhotos,
    handleLoadMore,
    handleMediaTypeChange
  };
}; 