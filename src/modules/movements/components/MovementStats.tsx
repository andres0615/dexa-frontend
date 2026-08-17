import { fetchStats } from '@/services/movementService';
import { animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

const percentFormatter = new Intl.NumberFormat('es-ES', { 
  maximumFractionDigits: 1, 
  minimumFractionDigits: 1 
});

export default function MovementStats() {
  const [stats, setStats] = useState<any>(null);

  // Variables para la animacion de los stats
  const animationTime: number = 0.7;

  // total de movimientos
  const totalCount = useMotionValue(0);
  const displayTotal = useTransform(totalCount, Math.round);

  // diferencia de movimientos mensual
  const totalMomCount = useMotionValue(0);
  const displayTotalMom = useTransform(totalMomCount, Math.round);

  // entradas
  const inputCount = useMotionValue(0);
  const displayInput = useTransform(inputCount, Math.round);

  // porcentaje de entradas
  const inputPercentCount = useMotionValue(0);
  const displayInputPercent = useTransform(inputPercentCount, (v) => percentFormatter.format(v));

  // salidas
  const outputCount = useMotionValue(0);
  const displayOutput = useTransform(outputCount, Math.round);

  // porcentaje de salidas
  const outputPercentCount = useMotionValue(0);
  const displayOutputPercent = useTransform(outputPercentCount, (v) => percentFormatter.format(v));

  // anulados
  const pendingCount = useMotionValue(0);
  const displayPending = useTransform(pendingCount, Math.round);

  // porcentaje de anulados
  const pendingPercentCount = useMotionValue(0);
  const displayPendingPercent = useTransform(pendingPercentCount, (v) => percentFormatter.format(v));

  // Carga de estadisticas
  useEffect(() => {
    fetchStats().then((data) => {
      console.log('stats: ', data);
      setStats(data);
    });
  }, []);

  // Animacion de los stats
  useEffect(() => {
    if (!stats) return;

    const totalControls = animate(totalCount, stats.total_movements, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const totalMomControls = animate(totalMomCount, stats.total_mom, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const inputControls = animate(inputCount, stats.input_movements, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const inputPercentControls = animate(inputPercentCount, stats.input_percent, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const outputControls = animate(outputCount, stats.output_movements, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const outputPercentControls = animate(outputPercentCount, stats.output_percent, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const pendingControls = animate(pendingCount, stats.pending_movements, {
      duration: animationTime,
      ease: 'easeOut',
    });

    const pendingPercentControls = animate(pendingPercentCount, stats.pending_percent, {
      duration: animationTime,
      ease: 'easeOut',
    });

    return () => {
      totalControls.stop();
      totalMomControls.stop();
      inputControls.stop();
      inputPercentControls.stop();
      outputControls.stop();
      outputPercentControls.stop();
      pendingControls.stop();
      pendingPercentControls.stop();
    }
  }, [
    totalCount,
    totalMomCount,
    inputCount,
    inputPercentCount,
    outputCount,
    outputPercentCount,
    pendingCount,
    pendingPercentCount,
    stats
  ]);

  return (
    <>
      {stats && (
        <div className="stats shadow bg-base-100 w-full mb-6 stats-vertical lg:stats-horizontal">
          <div className="stat w-60">
            <div className="stat-figure text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-7.5 0h7.5m-7.5 0-1 3m8.5-3 1 3m0 0 .5 1.5m-.5 1.5H9.75m6 0h3m-3 0h-3m-3 0H6m3 0h3" />
              </svg>
            </div>
            <div className="stat-title">Total Movimientos</div>
            <div className="stat-value text-primary">
              <motion.span>{displayTotal}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayTotalMom}</motion.span> más que el mes pasado
            </div>
          </div>
          <div className="stat w-48">
            <div className="stat-figure text-success">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div className="stat-title">Entradas</div>
            <div className="stat-value text-success">
              <motion.span>{displayInput}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayInputPercent}</motion.span>% del total
            </div>
          </div>
          <div className="stat w-56">
            <div className="stat-figure text-error">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </div>
            <div className="stat-title">Salidas</div>
            <div className="stat-value text-error">
              <motion.span>{displayOutput}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayOutputPercent}</motion.span>% del total
            </div>
          </div>
          <div className="stat w-72">
            <div className="stat-figure text-warning">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="inline-block h-8 w-8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div className="stat-title">Pendientes</div>
            <div className="stat-value text-warning">
              <motion.span>{displayPending}</motion.span>
            </div>
            <div className="stat-desc">
              <motion.span>{displayPendingPercent}</motion.span>% del total
            </div>
          </div>
        </div>
      )}
    </>
  );
}