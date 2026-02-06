export type UserRole = "customer" | "admin";

export interface User {
  id?: string;
  name?: string;
  email?: string;
  role?: UserRole;
  createdAt?: string;
  addresses?: Record<string, string>[];
  phone?: string;
}

export interface Category {
  id?: string;
  name?: string;
  description?: string;
  slug?: string;
}

export interface Product {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  categoryId?: string;
  tags?: string[];
  imageUrls?: string[];
  available?: boolean;
  inventoryCount?: number;
  featured?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface Review {
  id?: string;
  productId?: string;
  userId?: string;
  rating?: number;
  comment?: string;
  createdAt?: string;
}

export interface OrderItem {
  productId: string;
  quantity: number;
}

export interface Order {
  id?: string;
  userId?: string;
  items?: OrderItem[];
  totalAmount?: number;
  status?: "pending" | "confirmed" | "fulfilled" | "cancelled";
  paymentStatus?: "pending" | "paid" | "failed";
  shippingAddress?: Record<string, string>;
  createdAt?: string;
  updatedAt?: string;
}

export interface Promotion {
  id?: string;
  code?: string;
  discountType?: "percent" | "fixed";
  value?: number;
  validFrom?: string;
  validTo?: string;
  active?: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
}
