import type { Product } from "@/types/product";

interface StockBarProps {
  product: Product
}

export default function StockBar({ product }: StockBarProps) {

  const isOutOfStock = product.qty_on_hand === 0;
  const isLowStock = product.qty_on_hand <= product.minimum_stock && !isOutOfStock;
  const progressClass = isOutOfStock ? 'progress-error' : isLowStock ? 'progress-warning' : 'progress-success';

  return (
    <div className="flex items-center gap-2">
      <span>{product.qty_on_hand}</span>
      <progress 
        className={`progress ${progressClass} w-16`} 
        value={product.qty_on_hand} 
        max={product.maximum_stock} 
      />
    </div>
  );
}