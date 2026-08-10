// @ts-nocheck
'use client';

import * as React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TournamentService } from '@/services/tournament.service';
import { TournamentStatus } from '@/modules/core/enums';
import { toast } from 'sonner';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass?: string }
> = {
  Draft: {
    label: 'Draft',
    badgeClass: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/25',
  },
  Published: {
    label: 'Published',
    badgeClass: 'bg-sky-500/15 text-sky-300 border-sky-500/30 hover:bg-sky-500/25',
  },
  RegistrationOpen: {
    label: 'Registration Open',
    badgeClass: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
    dotClass: 'bg-emerald-400',
  },
  RegistrationClosed: {
    label: 'Registration Closed',
    badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30 hover:bg-amber-500/25',
  },
  Seeding: {
    label: 'Seeding',
    badgeClass: 'bg-purple-500/15 text-purple-300 border-purple-500/30 hover:bg-purple-500/25',
  },
  Live: {
    label: 'Live',
    badgeClass: 'bg-rose-500/20 text-rose-300 border-rose-500/40 hover:bg-rose-500/30',
    dotClass: 'bg-rose-500 animate-pulse',
  },
  Completed: {
    label: 'Completed',
    badgeClass: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/25',
  },
  Cancelled: {
    label: 'Cancelled',
    badgeClass: 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25',
  },
};

interface StatusBadgePickerProps {
  tournamentId: string;
  currentStatus: string;
  size?: 'sm' | 'md' | 'lg';
  onStatusChange?: (newStatus: string) => void;
}

export function StatusBadgePicker({
  tournamentId,
  currentStatus,
  size = 'md',
  onStatusChange,
}: StatusBadgePickerProps) {
  const queryClient = useQueryClient();

  const statusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      TournamentService.changeStatus(tournamentId, newStatus as TournamentStatus),
    onSuccess: (_, newStatus) => {
      toast.success(`Tournament status updated to ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
      queryClient.invalidateQueries({ queryKey: ['tournaments'] });
      queryClient.invalidateQueries({ queryKey: ['tournament', tournamentId] });
      if (onStatusChange) onStatusChange(newStatus);
    },
    onError: (err: any) => {
      toast.error(err.message || 'Failed to update tournament status');
    },
  });

  const config = STATUS_CONFIG[currentStatus] || {
    label: currentStatus || 'Draft',
    badgeClass: 'bg-zinc-500/15 text-zinc-300 border-zinc-500/30',
  };

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1.5',
    md: 'text-xs px-3 py-1 gap-2 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={statusMutation.isPending}
        className={`inline-flex items-center rounded-full border transition-all cursor-pointer outline-none focus:ring-2 focus:ring-violet-500/40 ${config.badgeClass} ${sizeClasses[size]}`}
      >
        {config.dotClass && (
          <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
        )}
        <span>{config.label}</span>
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="start"
        className="w-48 bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl p-1.5 space-y-1 rounded-xl z-50"
      >
        {Object.entries(STATUS_CONFIG).map(([key, item]) => {
          const isSelected = key === currentStatus;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => statusMutation.mutate(key)}
              className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
                isSelected ? 'bg-white/10 text-white font-semibold' : 'hover:bg-white/5 text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full border ${item.badgeClass.split(' ')[0]}`} />
                <span>{item.label}</span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-violet-400" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
