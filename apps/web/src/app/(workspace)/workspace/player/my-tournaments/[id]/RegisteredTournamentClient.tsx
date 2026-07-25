'use client';

import React, { useState, useEffect } from 'react';
import { TournamentDetail, BracketData, TimelineCourtSchedule, QRPass } from '@/modules/player/types';
import { BracketViewer } from '@/modules/player/components/BracketViewer';
import { ScheduleTimeline } from '@/modules/player/components/ScheduleTimeline';
import { QRPassCard } from '@/modules/player/components/QRPassCard';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerService } from '@/modules/player/services/player.service';
import {
  Trophy, MapPin, Calendar, Users, Clock, Info,
  BarChart3, Swords, Ticket, Phone
} from 'lucide-react';
import { formatTournamentDate } from '@/modules/player/utils';
import { TOURNAMENT_DISCOVERY_STATUS_COLORS } from '@/modules/player/constants';
import { cn } from '@/lib/utils';

interface RegisteredTournamentClientProps {
  tournament: TournamentDetail;
  bracket: BracketData;
  schedule: TimelineCourtSchedule[];
}

export function RegisteredTournamentClient({
  tournament,
  bracket,
  schedule,
}: RegisteredTournamentClientProps) {
  const [pass, setPass] = useState<QRPass | null>(null);

  useEffect(() => {
    // Retrieve QR pass mock details
    PlayerService.getQRPass(tournament.id).then(res => setPass(res)).catch(err => console.error(err));
  }, [tournament.id]);

  const dateRange = formatTournamentDate(tournament.startDate, tournament.endDate);
  const deadline = new Date(tournament.registrationDeadline).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric'
  });
  const statusColorClass = TOURNAMENT_DISCOVERY_STATUS_COLORS[tournament.status] ?? '';

  return (
    <WidgetContainer className="bg-card/60 backdrop-blur-xl shadow-2xl">
      {/* Hero banner */}
      <div className="h-64 md:h-80 bg-gradient-to-br from-violet-700/50 via-purple-900/60 to-fuchsia-900/40 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-6 right-6">
          <span className={cn(
            'px-3 py-1.5 text-xs font-bold rounded-xl border backdrop-blur-md',
            statusColorClass
          )}>
            {tournament.status.replace('_', ' ')}
          </span>
        </div>

        {/* Hero text */}
        <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 right-6 md:right-10">
          <div className="flex flex-wrap gap-2 mb-3">
            {tournament.sports.map((sport) => (
              <span
                key={sport}
                className="text-xs font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-lg text-white border border-white/10"
              >
                {sport}
              </span>
            ))}
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white mb-3 leading-tight drop-shadow-lg">
            {tournament.title}
          </h1>
          <p className="text-base text-white/70 max-w-2xl leading-relaxed">
            Organised by {tournament.organizerName}
          </p>
        </div>
      </div>

      {/* Quick facts strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/5 bg-black/10">
        {[
          { icon: Calendar, label: 'Dates', value: dateRange, color: 'text-violet-400' },
          { icon: MapPin, label: 'Venue', value: tournament.venueName, color: 'text-emerald-400' },
          { icon: Clock, label: 'Registration Status', value: 'REGISTERED', color: 'text-emerald-400' },
          {
            icon: Users,
            label: 'Total Players',
            value: tournament.registeredCount ? String(tournament.registeredCount) : '64',
            color: 'text-blue-400',
          },
        ].map(({ icon: IconC, label, value, color }) => (
          <div
            key={label}
            className="flex items-start gap-3 p-5 border-r border-white/5 last:border-r-0 md:last:border-r-0"
          >
            <IconC className={cn('w-4 h-4 mt-0.5 flex-shrink-0', color)} />
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-0.5">{label}</p>
              <p className="text-sm font-semibold text-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="p-6 md:p-10">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="bg-white/5 border border-white/5 mb-8 h-10 w-full md:w-auto overflow-x-auto justify-start flex-nowrap whitespace-nowrap">
            <TabsTrigger value="overview" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
              <Info className="w-3.5 h-3.5" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="brackets" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
              <BarChart3 className="w-3.5 h-3.5" />
              Draws & Brackets
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
              <Swords className="w-3.5 h-3.5" />
              Schedule Timeline
            </TabsTrigger>
            <TabsTrigger value="pass" className="text-xs font-semibold gap-1.5 flex-1 md:flex-none">
              <Ticket className="w-3.5 h-3.5" />
              QR Pass ticket
            </TabsTrigger>
          </TabsList>

          {/* Overview content */}
          <TabsContent value="overview" className="space-y-6 focus:outline-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <section>
                  <h3 className="text-lg font-bold text-foreground mb-2">About Tournament</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{tournament.description}</p>
                </section>
                <section>
                  <h3 className="text-lg font-bold text-foreground mb-2">Event Regulations</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Make sure to arrive 30 minutes before your scheduled slot. Match walkover details will be finalized 15 minutes after official call timings. Bring your digital QR wristband ticket printed or loaded on screen.
                  </p>
                </section>
              </div>
              <div className="space-y-4">
                <WidgetContainer className="p-4 bg-white/5 border-white/5">
                  <h4 className="text-xs font-bold text-violet-400 uppercase tracking-wide mb-2">Venue Details</h4>
                  <p className="text-xs font-bold text-foreground">{tournament.venueName}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{tournament.venueAddress || tournament.location}</p>
                </WidgetContainer>
              </div>
            </div>
          </TabsContent>

          {/* Draws & Brackets tab */}
          <TabsContent value="brackets" className="focus:outline-none mt-0">
            <BracketViewer bracket={bracket} />
          </TabsContent>

          {/* Schedule tab */}
          <TabsContent value="schedule" className="focus:outline-none mt-0">
            <ScheduleTimeline schedule={schedule} />
          </TabsContent>

          {/* Pass tab */}
          <TabsContent value="pass" className="focus:outline-none mt-0">
            {pass ? (
              <QRPassCard pass={pass} className="max-w-md mx-auto" />
            ) : (
              <div className="text-center text-xs text-muted-foreground py-10 animate-pulse">Loading pass...</div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </WidgetContainer>
  );
}
