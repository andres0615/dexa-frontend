
import { fetchStats } from '@/services/productService';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from "react";
import './ProductStats.css';

const thousandFormatter = new Intl.NumberFormat('es-ES', {
  maximumFractionDigits: 0,
});

const momFormatter = new Intl.NumberFormat('es-ES', { 
  maximumFractionDigits: 1, 
  minimumFractionDigits: 1 
});

export default function ProductStats() {
  const [stats, setStats] = useState<any>(null);
  
  // Variables para la animacion de los stats
  const animationTime: number = 0.7;
  
  // total de productos
  const totalCount = useMotionValue(0);
  const displayTotalStock = useTransform(totalCount, Math.round);
  
  // productos activos
  const activeCount = useMotionValue(0);
  const displayActive = useTransform(activeCount, Math.round);
  
  // productos agotados
  const outOfStockCount = useMotionValue(0);
  const displayOutOfStock = useTransform(outOfStockCount, Math.round);
  
  // valor del stock
  const stockValueCount = useMotionValue(0);
  const displayStockValue = useTransform(stockValueCount, Math.round);
  const displayStockValueFormatted = useTransform(stockValueCount, (v) => thousandFormatter.format(v));
  const [stockValueAnimated, setStockValueAnimated] = useState(false);

  // porcentaje de productos activos
  const activePercentCount = useMotionValue(0);
  const displayActivePercent = useTransform(activePercentCount, Math.round);
  
  // porcentaje de productos agotados
  const outOfStockPercentCount = useMotionValue(0);
  const displayOutOfStockPercent = useTransform(outOfStockPercentCount, Math.round);

  // diferencia de stock mensual
  const stockDiffMomCount = useMotionValue(0);
  const displayStockDiffMom = useTransform(stockDiffMomCount, Math.round);

  // valor del stock mensual
  const stockValueMomCount = useMotionValue(0);
  const displayStockValueMom = useTransform(stockValueMomCount, (v) => momFormatter.format(v));

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

    const activePercentControls = animate(activePercentCount, stats.active_percent, {
      duration: animationTime,
      ease: 'easeOut',
    });
    
    const outOfStockPercentControls = animate(outOfStockPercentCount, stats.out_of_stock_percent, {
      duration: animationTime,
      ease: 'easeOut',
    });
    
    const stockDiffMomControls = animate(stockDiffMomCount, stats.stock_diff_mom, {
      duration: animationTime,
      ease: 'easeOut',
    });
    
    const stockValueMomControls = animate(stockValueMomCount, stats.stock_value_mom, {
      duration: animationTime,
      ease: 'easeOut',
    });

    return () => {
      totalControls.stop();
      activeControls.stop();
      outOfStockControls.stop();
      stockValueControls.stop();
      activePercentControls.stop();
      outOfStockPercentControls.stop();
      stockDiffMomControls.stop();
      stockValueMomControls.stop();
    }
  }, [
    totalCount, 
    activeCount, 
    outOfStockCount, 
    stockValueCount, 
    activePercentCount, 
    outOfStockPercentCount,
    stockDiffMomCount,
    stockValueMomCount,
    stats
  ]);

  return (
    <>
      {stats && (
        <div className="stats shadow bg-base-100 w-full mb-6 stats-vertical lg:stats-horizontal">
          <div className="stat w-60">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="stat-title">Total Productos</div>
            <div className="stat-value text-primary">
              <motion.span>{displayTotalStock}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayStockDiffMom}</motion.span> más que el mes pasado
            </div>
          </div>
          <div className="stat w-48">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Activos</div>
            <div className="stat-value text-success">
              <motion.span>{displayActive}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayActivePercent}</motion.span>% del total
            </div>
          </div>
          <div className="stat w-56">
            <div className="stat-figure text-error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="stat-title">Agotados</div>
            <div className="stat-value text-error">
              <motion.span>{displayOutOfStock}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayOutOfStockPercent}</motion.span>% necesita reposición
            </div>
          </div>
          <div className="stat w-72">
            <div className="stat-figure text-info">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-8 w-8 stroke-current">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="stat-title">Valor en Stock</div>
            <div className="stat-value text-info">
              $<motion.span>{stockValueAnimated ? displayStockValueFormatted : displayStockValue}</motion.span>
            </div>
            <div className="stat-desc">
              +<motion.span>{displayStockValueMom}</motion.span>% vs mes anterior
            </div>
          </div>
        </div>
      )}
    </>
  );
}