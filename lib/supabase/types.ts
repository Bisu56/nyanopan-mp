/**
 * Hand-written Database type definitions that match the schema in
 * supabase/migrations/20261017032553_initial_schema.sql.
 *
 * These are used to type-check every Supabase query in the project.
 * In the future you can replace this file with the output of
 * `npx supabase gen types typescript --local` if you prefer generated types,
 * but hand-written types are easier to understand and are sufficient here
 * because the schema is small and well-understood.
 *
 * Money fields are stored as `bigint` in the DB (paisa). We use `number` in
 * TypeScript — JavaScript's number handles all realistic integer values safely.
 */

// ---------------------------------------------------------------------------
// Enums (mirror the SQL CREATE TYPE statements)
// ---------------------------------------------------------------------------

export type UserRole = "customer" | "admin";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "cod";

export type PaymentStatus = "unpaid" | "paid";

// ---------------------------------------------------------------------------
// Row types (one per table — the shape SELECT * returns)
// ---------------------------------------------------------------------------

export type ProfileRow = {
  id: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  category_id: string;
  price_paisa: number;
  stock_quantity: number;
  is_active: boolean;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type ProductVariantRow = {
  id: string;
  product_id: string;
  size_label: string;
  stock_quantity: number;
  is_active: boolean;
  created_at: string;
};

export type ProductImageRow = {
  id: string;
  product_id: string;
  storage_path: string;
  alt_text: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

export type OrderRow = {
  id: string;
  order_code: string;
  user_id: string | null;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  shipping_address: ShippingAddress;
  subtotal_paisa: number;
  delivery_paisa: number;
  total_paisa: number;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRow = {
  id: string;
  order_id: string;
  product_id: string | null;
  variant_id: string | null;
  product_name: string;
  size_label: string | null;
  unit_price_paisa: number;
  quantity: number;
  line_total_paisa: number;
};

export type OrderStatusHistoryRow = {
  id: string;
  order_id: string;
  from_status: OrderStatus | null;
  to_status: OrderStatus;
  changed_by: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// Supporting value-object types
// ---------------------------------------------------------------------------

/** Stored as JSONB in public.orders.shipping_address */
export interface ShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  district: string;
  province: string;
  country: string;
  postal_code?: string;
}

// ---------------------------------------------------------------------------
// Database map — the shape @supabase/supabase-js expects for full type-safety.
// Usage: createClient<Database>(url, key)
// ---------------------------------------------------------------------------

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Omit<ProfileRow, "created_at"> & { created_at?: string };
        Update: Partial<Omit<ProfileRow, "id">>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Omit<CategoryRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<CategoryRow, "id">>;
        Relationships: [];
      };
      products: {
        Row: ProductRow;
        Insert: Omit<
          ProductRow,
          "id" | "created_at" | "updated_at" | "published_at" | "is_published"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
          is_published?: boolean;
          published_at?: string | null;
        };
        Update: Partial<Omit<ProductRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      product_variants: {
        Row: ProductVariantRow;
        Insert: Omit<ProductVariantRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<ProductVariantRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      product_images: {
        Row: ProductImageRow;
        Insert: Omit<ProductImageRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<ProductImageRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
      orders: {
        Row: OrderRow;
        Insert: Omit<OrderRow, "id" | "created_at" | "updated_at"> & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<OrderRow, "id">>;
        Relationships: [];
      };
      order_items: {
        Row: OrderItemRow;
        Insert: Omit<OrderItemRow, "id"> & { id?: string };
        Update: Partial<Omit<OrderItemRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "order_items_variant_id_fkey";
            columns: ["variant_id"];
            isOneToOne: false;
            referencedRelation: "product_variants";
            referencedColumns: ["id"];
          },
        ];
      };
      order_status_history: {
        Row: OrderStatusHistoryRow;
        Insert: Omit<OrderStatusHistoryRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<Omit<OrderStatusHistoryRow, "id">>;
        Relationships: [
          {
            foreignKeyName: "order_status_history_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {
      user_role: UserRole;
      order_status: OrderStatus;
      payment_method: PaymentMethod;
      payment_status: PaymentStatus;
    };
  };
}
