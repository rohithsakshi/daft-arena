'use client';

import React, { useState } from 'react';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Clock, MapPin, Download, ExternalLink, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'MATCH' | 'REGISTRATION_DEADLINE' | 'TOURNAMENT_DATE' | 'TRAINING';
  date: string;
  time?: string;
  location?: string;
  description?: string;
}

interface InteractiveCalendarProps {
  events: CalendarEvent[];
  className?: string;
}

export function InteractiveCalendar({ events, className }: InteractiveCalendarProps) {
  const [viewMode, setViewMode] = useState<'MONTH' | 'WEEK' | 'AGENDA'>('AGENDA');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handleExportICS = () => {
    alert('Simulating download of sanctioned DAFT Arena schedule.ics file...');
  };

  const handleExportGoogle = () => {
    alert('Redirecting to Google Calendar API integrations (OAuth workflow)...');
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(y => y + 1);
    } else {
      setCurrentMonth(m => m + 1);
    }
  };

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(y => y - 1);
    } else {
      setCurrentMonth(m => m - 1);
    }
  };

  const getEventBadge = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'MATCH':
        return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'REGISTRATION_DEADLINE':
        return 'bg-amber-500/10 text-amber-400 border border-amber-500/20';
      case 'TOURNAMENT_DATE':
        return 'bg-violet-500/10 text-violet-400 border border-violet-500/20';
      case 'TRAINING':
        return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
      default:
        return 'bg-white/5 text-muted-foreground border border-white/5';
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Calendar header tabs controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-card/45 backdrop-blur-md p-3 rounded-2xl border border-white/5">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-5 h-5 text-violet-400" />
          <span className="text-sm font-extrabold text-foreground">
            {monthNames[currentMonth]} {currentYear}
          </span>
          <div className="flex gap-1 ml-2">
            <Button variant="ghost" size="icon" onClick={prevMonth} className="w-7 h-7 hover:bg-white/5 rounded-lg">
              <ArrowLeft className="w-3.5 h-3.5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="w-7 h-7 hover:bg-white/5 rounded-lg">
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>

        {/* View toggles & Export shortcuts */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex bg-white/5 p-0.5 rounded-xl border border-white/5">
            {(['MONTH', 'WEEK', 'AGENDA'] as const).map((view) => (
              <button
                key={view}
                onClick={() => setViewMode(view)}
                className={cn(
                  'text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all',
                  viewMode === view ? 'bg-violet-600 text-white' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {view}
              </button>
            ))}
          </div>

          <div className="flex gap-1.5">
            <Button variant="outline" size="sm" onClick={handleExportICS} className="border-white/10 text-[10px] h-8 gap-1 rounded-xl">
              <Download className="w-3.5 h-3.5 text-violet-400" />
              Download .ICS
            </Button>
            <Button variant="outline" size="sm" onClick={handleExportGoogle} className="border-white/10 text-[10px] h-8 gap-1 rounded-xl">
              <ExternalLink className="w-3.5 h-3.5 text-violet-400" />
              Sync Google
            </Button>
          </div>
        </div>
      </div>

      {/* View layouts mapping */}
      {viewMode === 'AGENDA' ? (
        <div className="space-y-3">
          {events.length > 0 ? (
            events.map((event) => (
              <WidgetContainer key={event.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-white/5 bg-card/65">
                <div className="flex items-start gap-3 min-w-0">
                  <div className="min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('px-2 py-0.5 text-[8px] font-black uppercase tracking-wider rounded-md', getEventBadge(event.type))}>
                        {event.type.replace('_', ' ')}
                      </span>
                      <h4 className="font-bold text-xs text-foreground truncate">{event.title}</h4>
                    </div>
                    {event.description && <p className="text-xs text-muted-foreground">{event.description}</p>}
                    <div className="flex items-center gap-3 text-[10px] text-muted-foreground flex-wrap pt-1">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-violet-400" />
                        {new Date(event.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        {event.time && ` @ ${event.time}`}
                      </span>
                      {event.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          {event.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </WidgetContainer>
            ))
          ) : (
            <p className="text-center text-xs text-muted-foreground py-8">No scheduled activities listed.</p>
          )}
        </div>
      ) : viewMode === 'WEEK' ? (
        <div className="grid grid-cols-7 gap-3">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-3 bg-white/5 border border-white/5 rounded-xl text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{day}</span>
            </div>
          ))}
          {Array.from({ length: 7 }).map((_, idx) => {
            const dateStr = `2026-08-1${idx}`;
            const dayEvents = events.filter(e => e.date.includes(dateStr) || (idx === 2 && e.type === 'MATCH'));
            return (
              <WidgetContainer key={idx} className="p-3 min-h-[140px] flex flex-col justify-between border-white/5 bg-card/40">
                <span className="text-[10px] font-mono text-muted-foreground">{10 + idx}</span>
                <div className="space-y-1.5">
                  {dayEvents.map(e => (
                    <div key={e.id} className={cn('p-1 rounded text-[8px] truncate font-bold uppercase', getEventBadge(e.type))}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </WidgetContainer>
            );
          })}
        </div>
      ) : (
        /* Month View mockup */
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{day}</span>
            </div>
          ))}
          {Array.from({ length: 31 }).map((_, idx) => {
            const dayEvents = events.filter(e => idx === 9 && e.type === 'TOURNAMENT_DATE');
            return (
              <WidgetContainer key={idx} className="p-2 min-h-[70px] flex flex-col justify-between border-white/5 bg-card/25">
                <span className="text-[9px] font-mono text-muted-foreground">{idx + 1}</span>
                <div className="space-y-1">
                  {dayEvents.map(e => (
                    <div key={e.id} className={cn('p-0.5 rounded text-[7px] truncate font-bold', getEventBadge(e.type))}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </WidgetContainer>
            );
          })}
        </div>
      )}
    </div>
  );
}
