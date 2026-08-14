
import { fetchStats } from '@/services/productService';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from "react";
import './ProductStats.css';

const thousandFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
});

export default function ProductStats() {
  const [stats, setStats] = useState<any>(null);
  
  // Variables para la animacion de los stats
  const animationTime: number = 0.7;
  
  const totalCount = useMotionValue(0);
  const displayTotalStock = useTransform(totalCount, Math.round);
  
  const activeCount = useMotionValue(0);
  const displayActive = useTransform(activeCount, Math.round);
  
  const outOfStockCount = useMotionValue(0);
  const displayOutOfStock = useTransform(outOfStockCount, Math.round);
  
  const stockValueCount = useMotionValue(0);
  const displayStockValue = useTransform(stockValueCount, Math.round);
  const displayStockValueFormatted = useTransform(stockValueCount, (v) => thousandFormatter.format(v));
  const [stockValueAnimated, setStockValueAnimated] = useState(false);


  useEffect(() => {
    fetchStats().then((data) => {
      console.log('stats: ', data);
      setStats(data);
    });
  }, []);

  // Animacion de los stats
  useEffect(() => {
    if (!stats) return;
    setStockValueAnimated(false);
    
    const totalControls = animate(totalCount, stats.total_stock, {
      duration: animationTime,
      ease: 'easeOut',
    });
    
    const activeControls = animate(activeCount, stats.active, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const outOfStockControls = animate(outOfStockCount, stats.out_of_stock, {
      duration: animationTime,
      ease: 'easeOut',
    });
    
    const stockValueControls = animate(stockValueCount, stats.stock_value, {
      duration: animationTime,
      ease: 'easeOut',
      onComplete: () => setStockValueAnimated(true),
    });

    return () => {
      totalControls.stop();
      activeControls.stop();
      outOfStockControls.stop();
      stockValueControls.stop();
    }
  }, [totalCount, activeCount, outOfStockCount, stockValueCount, stats]);

  return (
    <>
      {stats && (
        <div className="stats shadow bg-base-100 w-full mb-6 stats-vertical lg:stats-horizontal">
          <div className="stat">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="stat-title">Total Productos</div>
            <div className="stat-value text-primary">
              <motion.span>{displayTotalStock}</motion.span>
            </div>
            <div className="stat-desc">12 más que el mes pasado</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Activos</div>
            <div className="stat-value text-success">
              <motion.span>{displayActive}</motion.span>
            </div>
            <div className="stat-desc">79.8% del total</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="stat-title">Agotados</div>
            <div className="stat-value text-error">
              <motion.span>{displayOutOfStock}</motion.span>
            </div>
            <div className="stat-desc">9.3% necesita reposición</div>
          </div>
          <div className="stat">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Valor en Stock</div>
            <div className="stat-value text-info">
              $<motion.span>{stockValueAnimated ? displayStockValueFormatted : displayStockValue}</motion.span>
            </div>
            <div className="stat-desc">+5.2% vs mes anterior</div>
          </div>
        </div>
      )}
    </>
  );
}