"use client";

import { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { MediaType } from "../types/media-type";
import { fetchPhotos } from "../api/photos";

export const usePhotos = () => {
  const [mediaType, setMediaType] = useState<MediaType>("all");
  
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ['photos', mediaType],
    queryFn: ({ pageParam }) => fetchPhotos(pageParam, mediaType),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (inView && hasNextPage && !isFetchingNextPage) {
    fetchNextPage();
  }

  const handleMediaTypeChange = (type: MediaType) => {
    setMediaType(type);
  };

  const allPhotos = data?.pages.flatMap(page => page.data) ?? [];
  
  return {
    mediaType,
    photos: allPhotos,
    handleMediaTypeChange,
    loadMoreRef: ref,
    isLoading: status === 'pending',
    isError: status === 'error',
    isFetchingNextPage,
    error
  };
}; 