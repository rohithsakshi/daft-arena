import React from 'react';
import { cn } from '@/lib/utils';

interface WidgetContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glowEffect?: boolean;
  animate?: boolean;
  children: React.ReactNode;
}

export function WidgetContainer({
  hoverEffect = false,
  glowEffect = false,
  animate = true,
  children,
  className,
  ...props
}: WidgetContainerProps) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-white/5 bg-card/40 backdrop-blur-md shadow-lg overflow-hidden',
        animate && 'animate-in fade-in duration-300',
        hoverEffect && 'transition-all duration-300 hover:bg-white/5 hover:border-white/10 hover:-translate-y-0.5 hover:shadow-xl',
        className
      )}
      {...props}
    >
      {/* Glow highlight */}
      {glowEffect && (
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/0 to-violet-600/0 hover:from-violet-600/5 hover:to-transparent transition-all duration-500 pointer-events-none rounded-2xl" />
      )}
      {children}
    </div>
  );
}
