export interface GalleryCategory {
  id: number;
  title: string;
  slug: string;
  description: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  position: number;
  item_count: number;
  created_at: string;
  updated_at: string;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: { id: number; title: string; slug: string } | null;
  thumbnail_url: string | null;
  medium_url: string | null;
  popularity: number;
  is_featured: boolean;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  created_at: string;
}

export interface GalleryItemDetail extends GalleryItem {
  description: string;
  large_url: string | null;
  web_url: string | null;
  original_url: string | null;
  taken_at: string | null;
  updated_at: string;
}
