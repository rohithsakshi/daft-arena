import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-12 text-center',
        'rounded-2xl border border-dashed border-white/10 bg-card/20 backdrop-blur-sm',
        className
      )}
    >
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-violet-500/10 blur-xl scale-150" />
        <div className="relative p-4 rounded-full bg-white/5 border border-white/10 text-muted-foreground">
          <Icon className="w-8 h-8" />
        </div>
      </div>
      <h3 className="text-lg font-bold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-sm leading-relaxed mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
