import React from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: React.ReactNode;
  className?: string;
  titleSize?: 'sm' | 'md' | 'lg' | 'xl';
}

export function SectionHeader({
  title,
  description,
  action,
  icon: Icon,
  badge,
  className,
  titleSize = 'md',
}: SectionHeaderProps) {
  const titleClasses = {
    sm: 'text-sm font-bold',
    md: 'text-lg font-bold',
    lg: 'text-xl font-bold md:text-2xl',
    xl: 'text-3xl font-extrabold md:text-4xl tracking-tight',
  };

  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full mb-6', className)}>
      <div className="flex items-start gap-3 min-w-0">
        {Icon && (
          <div className="p-2 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 mt-0.5 flex-shrink-0">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <h2 className={cn('text-foreground leading-snug', titleClasses[titleSize])}>
              {title}
            </h2>
            {badge && <div className="flex-shrink-0">{badge}</div>}
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </div>
      {action && (
        <div className="flex items-center gap-3 self-start sm:self-center flex-shrink-0">
          {action}
        </div>
      )}
    </div>
  );
}
