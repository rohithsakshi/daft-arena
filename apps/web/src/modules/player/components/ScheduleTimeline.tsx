// @ts-nocheck
'use client';

import React, { useState } from 'react';
import { TimelineCourtSchedule, PlayerMatch } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Calendar, AlertTriangle, Clock, MapPin, CheckCircle, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScheduleTimelineProps {
  schedule: TimelineCourtSchedule[];
  className?: string;
}

export function ScheduleTimeline({ schedule, className }: ScheduleTimelineProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const timeSlots = ['09:00 AM', '10:30 AM', '12:00 PM', '01:30 PM'];

  return (
    <div className={cn('space-y-6', className)}>
      {/* Day Toggles */}
      <div className="flex items-center justify-between bg-card/40 backdrop-blur-md p-2 rounded-2xl border border-white/5 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4 text-violet-400" />
          <span className="text-xs font-bold text-foreground">Draft Schedule Day:</span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((dayNum) => (
            <Button
              key={dayNum}
              variant="ghost"
              size="sm"
              onClick={() => setSelectedDay(dayNum)}
              className={cn(
                'text-xs font-bold rounded-lg px-3 h-8',
                selectedDay === dayNum
                  ? 'bg-violet-600 text-white hover:bg-violet-700'
                  : 'text-muted-foreground hover:bg-white/5'
              )}
            >
              Day {dayNum}
            </Button>
          ))}
        </div>
      </div>

      {/* Grid of Courts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {schedule.map((court, cIdx) => (
          <div key={cIdx} className="space-y-4">
            {/* Court Header */}
            <div className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
              <h4 className="text-xs font-bold uppercase tracking-wider text-violet-400">
                {court.courtName}
              </h4>
            </div>

            {/* Time slots inside this court */}
            <div className="space-y-3">
              {timeSlots.map((time) => {
                const slot = court.slots.find(s => s.time === time);
                const hasMatch = !!slot?.match;
                const isConflict = !!slot?.conflict;

                return (
                  <WidgetContainer
                    key={time}
                    className={cn(
                      'p-4 border transition-all flex flex-col justify-between min-h-[120px]',
                      isConflict
                        ? 'border-red-500/40 bg-red-500/5'
                        : hasMatch
                        ? 'border-white/5 bg-card/60'
                        : 'border-dashed border-white/5 bg-transparent opacity-40'
                    )}
                  >
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-violet-400" />
                        {time}
                      </span>
                      {isConflict && (
                        <span className="flex items-center gap-0.5 font-bold text-red-400 uppercase">
                          <AlertTriangle className="w-3 h-3 text-red-400 animate-pulse" />
                          Conflict
                        </span>
                      )}
                    </div>

                    {hasMatch ? (
                      <div className="mt-3 space-y-2">
                        <div>
                          <p className="text-xs font-bold text-foreground line-clamp-1">{slot.match?.eventName}</p>
                          <p className="text-[10px] text-muted-foreground line-clamp-1">{slot.match?.opponentName}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[9px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Swords className="w-2.5 h-2.5 text-violet-400" />
                            {slot.match?.roundName}
                          </span>
                          <span className={cn(
                            'font-bold uppercase tracking-wide px-1.5 py-0.5 rounded',
                            slot.match?.status === 'LIVE' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-white/5'
                          )}>
                            {slot.match?.status}
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-[10px] text-muted-foreground/30 italic mt-4 text-center">Empty Court Slot</p>
                    )}
                  </WidgetContainer>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
