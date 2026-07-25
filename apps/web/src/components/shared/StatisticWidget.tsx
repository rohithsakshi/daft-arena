import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { WidgetContainer } from './WidgetContainer';

interface StatisticWidgetProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColorClass?: string;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

export function StatisticWidget({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColorClass = 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  trend,
  className,
}: StatisticWidgetProps) {
  const trendPositive = trend && trend.value > 0;

  return (
    <WidgetContainer hoverEffect className={className}>
      <div className="p-5">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
              {title}
            </p>
            <h3 className="text-3xl font-black text-foreground leading-none">{value}</h3>
            {subtitle && (
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            )}
          </div>
          <div className={cn('p-2.5 rounded-xl border flex items-center justify-center', iconColorClass)}>
            <Icon className="w-5 h-5" />
          </div>
        </div>

        {trend && (
          <div className="pt-4 border-t border-white/5 flex items-center gap-2">
            <span
              className={cn(
                'inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-md',
                trendPositive ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
              )}
            >
              {trendPositive ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {trendPositive ? '+' : ''}
              {trend.value}%
            </span>
            <span className="text-xs text-muted-foreground">{trend.label}</span>
          </div>
        )}
      </div>
    </WidgetContainer>
  );
}
