export interface PujaCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  status: string;
}

export interface PujaService {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  duration?: string;
  category?: PujaCategory;
  image?: string;
  is_active: boolean;
  created_at: string;
}

export interface PujaPackage {
  id: number;
  name: string;
  description: string;
  price: string;
  services: PujaService[];
  is_active: boolean;
}

export interface AstrologyService {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: string;
  duration?: string;
  image?: string;
  is_active: boolean;
  created_at: string;
}
