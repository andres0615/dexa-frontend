import type { ProductCategory } from '../../../types/product-category';

export default function CategoryLabel(
  { categoryId, categories }: { categoryId: number; categories: ProductCategory[] }
) {
  const category = categories.find((c) => c.id === categoryId);
  return (
    <>
      {category?.name}
    </>
  );
}