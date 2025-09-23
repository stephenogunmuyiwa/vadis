export type Brand = {
  id: string;
  name: string;
  logoUrl?: string;
};

export type BrandProfile = {
  id: string;
  name: string;
  category: string;
  image_url?: string;
  created_date?: number;
  created_by?: string;
};

export type ProductCategory = 'Electronics' | 'Food' | 'Automobile' | 'Symbol' | 'Tablet' | 'Audio';

export type Product = {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  category: ProductCategory | string;
  price: number; // cents or dollars – UI will format
  projectsCount: number;
  image?: string;
  description?: string;
};

export type PlacementTag = 'Action' | 'Film' | 'Adults' | 'Fantasy' | 'Series' | 'Everyone';

export type Placement = {
  id: string;
  studio: string;
  title: string;
  synopsis: string;
  scenesCount: number;
  audienceCount: number;
  rating: number; // 0..5
  tags: PlacementTag[];
  poster: string;
  heroFrames: string[]; // small stills
};

export type Bid = {
  id: string;
  brandName: string;
  productName: string;
  category: string;
  price: number;
};

export type DealCard = {
  id: string;
  placementId: string;
  placementTitle: string;
  studio: string;
  tags: PlacementTag[];
  scenesCount: number;
  audienceCount: number;
  rating: number;
  price: number;
  poster: string;
};
