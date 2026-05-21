/** Tipos oficiales — contrato /api/v1/consumer (api-app-comprador-integracion.md §11) */

export type SocialProvider = 'google' | 'facebook' | 'twitter';

export type SocialLoginBody = {
  provider: SocialProvider;
  provider_id: string;
  name: string;
  email: string;
};

export type ConsumerUser = {
  id: number;
  name: string;
  email: string;
  role: 'comprador';
  provider: SocialProvider | null;
};

export type ConsumerAuthResponse = {
  token: string;
  token_type: 'Bearer';
  user: ConsumerUser;
};

export type BusinessCategory = {
  id: number;
  name: string;
  slug: string;
  sort_order?: number;
};

export type ConsumerBanner = {
  id: number;
  image_url: string | null;
  sort_order: number;
  link_url: string | null;
};

export type CountryFilterOption = {
  name: string;
  has_sellers: boolean;
};

export type SellerListItem = {
  id: number;
  name: string;
  description: string | null;
  country: string | null;
  state: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  has_active_promotion: boolean;
  business_category: Pick<BusinessCategory, 'id' | 'name' | 'slug'> | null;
  is_favorited: boolean;
};

export type CatalogImage = {
  id: number;
  image_url: string;
  display_order: number;
};

export type SellerDetail = SellerListItem & {
  whatsapp: string | null;
  instagram: string | null;
  facebook: string | null;
  website: string | null;
  catalog_images: CatalogImage[];
};

export type SellerInteractionType = 'profile_view' | 'whatsapp_click';

export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
};

export type PaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type PaginatedSellers = {
  data: SellerListItem[];
  meta: PaginationMeta;
  links: PaginationLinks;
};

export type ApiErrorBody = {
  message?: string;
  errors?: Record<string, string[]>;
};
