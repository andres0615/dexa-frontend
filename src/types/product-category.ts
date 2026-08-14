export interface ProductCategory {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
}

export type CreateProductCategoryPayload = Omit<ProductCategory, 'id'>;

export type UpdateProductCategoryPayload = Partial<Omit<ProductCategory, 'id'>>;
