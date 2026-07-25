import React from 'react';
import { LucideIcon, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

import { WidgetContainer } from '@/components/shared/WidgetContainer';

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  colorClass?: string;
  badge?: string;
  className?: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  href,
  colorClass = 'text-violet-400 bg-violet-500/10 border-violet-500/20',
  badge,
  className,
}: QuickActionCardProps) {
  return (
    <Link href={href} className="block group h-full" aria-label={title}>
      <WidgetContainer
        hoverEffect
        glowEffect
        className={cn('p-5 flex flex-col justify-between h-full', className)}
      >
        <div className="flex justify-between items-start mb-4 relative">
          <div className={cn('p-3 rounded-xl border', colorClass)}>
            <Icon className="w-5 h-5" />
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className="text-[10px] font-bold bg-violet-500/20 text-violet-400 border border-violet-500/20 px-1.5 py-0.5 rounded-md">
                {badge}
              </span>
            )}
            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-violet-600/20 group-hover:text-violet-400 transition-all duration-200">
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </div>

        <div className="relative">
          <h3 className="font-bold text-foreground mb-1 group-hover:text-violet-300 transition-colors">{title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
      </WidgetContainer>
    </Link>
  );
}
