import React from 'react';
import { cn } from '@/lib/utils';
import { WidgetContainer } from './WidgetContainer';

interface ActivityWidgetProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ActivityWidget({
  title,
  subtitle,
  action,
  children,
  className,
}: ActivityWidgetProps) {
  return (
    <WidgetContainer className={cn('flex flex-col h-full', className)}>
      <div className="p-5 border-b border-white/5 flex items-center justify-between flex-shrink-0">
        <div>
          <h3 className="font-bold text-foreground text-sm leading-tight uppercase tracking-wider">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
      <div className="flex-1 overflow-y-auto p-5 space-y-4">
        {children}
      </div>
    </WidgetContainer>
  );
}
