// @ts-nocheck
'use client';

import React from 'react';
import { PlayerRankingHistory } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Star, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RankingChartProps {
  history: PlayerRankingHistory[];
  title: string;
  className?: string;
}

export function RankingChart({ history, title, className }: RankingChartProps) {
  if (history.length === 0) return null;

  const points = history.map((h) => h.points);
  const maxPoints = Math.max(...points, 1);
  const minPoints = Math.min(...points, 0);
  const range = maxPoints - minPoints;

  // Chart proportions
  const width = 500;
  const height = 150;
  const padding = 20;

  // Render SVG points list
  const pointsCoords = history.map((h, i) => {
    const x = padding + (i * (width - padding * 2)) / (history.length - 1 || 1);
    const val = h.points;
    const y = height - padding - ((val - minPoints) * (height - padding * 2)) / (range || 1);
    return { x, y, month: h.month, points: h.points };
  });

  const pathD = pointsCoords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`)
    .join(' ');

  const areaD = pointsCoords.length > 0
    ? `${pathD} L ${pointsCoords[pointsCoords.length - 1].x} ${height - padding} L ${pointsCoords[0].x} ${height - padding} Z`
    : '';

  const latestPoints = points[points.length - 1] ?? 0;
  const prevPoints = points[points.length - 2] ?? latestPoints;
  const diff = latestPoints - prevPoints;

  return (
    <WidgetContainer className={cn('p-6', className)}>
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{title}</h4>
          <p className="text-2xl font-black text-foreground mt-1">
            {latestPoints.toLocaleString()}
            <span className="text-xs font-normal text-muted-foreground ml-1">points</span>
          </p>
        </div>
        {diff !== 0 && (
          <span className={cn(
            'inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-lg border',
            diff > 0
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
              : 'bg-red-500/10 text-red-400 border-red-500/20'
          )}>
            <TrendingUp className={cn('w-3 h-3', diff < 0 && 'rotate-180')} />
            {diff > 0 ? `+${diff}` : diff} pts
          </span>
        )}
      </div>

      {/* SVG Canvas Area */}
      <div className="w-full h-[150px] relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Guidelines */}
          <line x1={padding} y1={padding} x2={width - padding} y2={padding} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1={padding} y1={height / 2} x2={width - padding} y2={height / 2} stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
          <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="rgba(255,255,255,0.1)" />

          {/* Area fill */}
          {areaD && <path d={areaD} fill="url(#gradient-area)" />}

          {/* Line path */}
          {pathD && <path d={pathD} fill="none" stroke="#8b5cf6" strokeWidth="2.5" />}

          {/* Circles at coordinates */}
          {pointsCoords.map((c, i) => (
            <g key={i}>
              <circle
                cx={c.x}
                cy={c.y}
                r="4.5"
                fill="#8b5cf6"
                stroke="var(--background)"
                strokeWidth="1.5"
                className="transition-all hover:scale-150 cursor-pointer"
              />
              {/* Text tooltip values */}
              <text x={c.x} y={c.y - 8} textAnchor="middle" fill="var(--foreground)" fontSize="9" fontWeight="bold">
                {c.points}
              </text>
              {/* Month label */}
              <text x={c.x} y={height - 2} textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="9">
                {c.month}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </WidgetContainer>
  );
}
