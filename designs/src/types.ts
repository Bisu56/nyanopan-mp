export interface ProductColor {
  name: string;
  hex: string;
  bgHex?: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'footwear' | 'home-decor' | 'accessories' | 'gifting';
  categoryLabel: string;
  price: number;
  rating: number;
  reviewsCount: number;
  origin: string;
  artisanGroup: string;
  description: string;
  detailDescription?: string;
  images: string[];
  colors: ProductColor[];
  sizes?: number[];
  soleType?: 'Buffalo Suede (Indoor Silent)' | 'Crepe Natural Rubber (Dual-Use)';
  inStock: boolean;
  stockRemaining?: number;
  tag?: string;
  badge?: string;
  shade?: string;
  dimensions?: string;
  material?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  categoryLabel: string;
  price: number;
  image: string;
  selectedColor: string;
  selectedSize?: number;
  soleType: string;
  quantity: number;
  originLocation: string;
}

export interface ShippingOption {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  badge?: string;
}

export interface OrderDetails {
  fullName: string;
  phone: string;
  email: string;
  province: string;
  district: string;
  municipality: string;
  ward: string;
  street: string;
  instructions: string;
  shippingMethod: string;
  shippingCost: number;
  paymentMethod: string;
  giftNoteEnabled: boolean;
  giftMessage: string;
  subtotal: number;
  giftNoteCost: number;
  discount: number;
  total: number;
}
