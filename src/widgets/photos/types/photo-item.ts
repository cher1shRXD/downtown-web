export interface PhotoItem {
  id: string;
  url: string;
  type: "image" | "video";
  width: number;
  height: number;
  alt?: string;
}