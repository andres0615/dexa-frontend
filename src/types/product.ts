export interface Product {
  id: number;
  code: string;
  barcode: string | null;
  name: string;
  description: string | null;
  category_id: number;
  subcategory_id: number | null;
  brand: string | null;
  image: string | null;
  unit_of_measurement: string;
  presentation_unit: string | null;
  cost_price: number | string;
  sale_price: number | string;
  wholesale_price: number | string | null;
  applies_tax: boolean;
  vat_percentage: number;
  initial_stock: number;
  minimum_stock: number;
  maximum_stock: number | null;
  location: string | null;
  supplier_id: number | null;
  allow_negative_sales: boolean;
  is_service: boolean;
  status: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export type CreateProductPayload = Omit<Product, 'id' | 'created_at' | 'updated_at'>;

export type UpdateProductPayload = Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
