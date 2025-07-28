import { PhotoItem } from "../types/photo-item";

// 샘플 데이터 (나중에 실제 API로 교체)
const allPhotos: PhotoItem[] = [
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
  },
  {
    id: "9",
    url: "https://picsum.photos/400/550?random=9",
    type: "image",
    width: 400,
    height: 550,
    alt: "Sample image 9"
  },
  {
    id: "10",
    url: "https://picsum.photos/400/650?random=10",
    type: "image",
    width: 400,
    height: 650,
    alt: "Sample image 10"
  },
  {
    id: "11",
    url: "https://picsum.photos/400/350?random=11",
    type: "image",
    width: 400,
    height: 350,
    alt: "Sample image 11"
  },
  {
    id: "12",
    url: "https://picsum.photos/400/750?random=12",
    type: "image",
    width: 400,
    height: 750,
    alt: "Sample image 12"
  }
];

export const fetchPhotos = async (
  pageParam: string | undefined,
  mediaType: "all" | "image" | "video"
) => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const pageSize = 6;
  const startIndex = pageParam ? parseInt(pageParam) : 0;
  const endIndex = startIndex + pageSize;

  const filteredPhotos = allPhotos.filter(item => {
    if (mediaType === "all") return true;
    return item.type === mediaType;
  });

  const data = filteredPhotos.slice(startIndex, endIndex);
  const hasNextPage = endIndex < filteredPhotos.length;
  const nextCursor = hasNextPage ? endIndex.toString() : undefined;

  return {
    data,
    hasNextPage,
    nextCursor
  };
}; 