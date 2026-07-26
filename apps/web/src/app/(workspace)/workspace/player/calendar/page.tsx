// @ts-nocheck
import React from 'react';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { InteractiveCalendar } from '@/modules/player/components/InteractiveCalendar';
import { Calendar } from 'lucide-react';

export const metadata = {
  title: 'Competitor Schedule Calendar | DAFT Arena',
  description: 'Your interactive matches, registration deadlines, and training schedules.',
};

export default async function PlayerCalendarPage() {
  // Mock calendar events database
  const events = [
    {
      id: 'cal_1',
      title: "Men's Singles Open vs Marcus Chen",
      type: 'MATCH' as const,
      date: '2026-08-12',
      time: '02:30 PM',
      location: 'Downtown Arena (Court 4)',
      description: 'Summer Open 32-draw bracket match.'
    },
    {
      id: 'cal_2',
      title: "Men's Doubles Open vs Ryan & James Park",
      type: 'MATCH' as const,
      date: '2026-08-13',
      time: '10:00 AM',
      location: 'Downtown Arena (Court 1)',
      description: 'Summer Open 16-draw doubles match.'
    },
    {
      id: 'cal_3',
      title: 'Summer Open 2026 Registration Deadline',
      type: 'REGISTRATION_DEADLINE' as const,
      date: '2026-08-05',
      description: 'Final check-in date for brackets.'
    },
    {
      id: 'cal_4',
      title: 'West Coast Championships Start Date',
      type: 'TOURNAMENT_DATE' as const,
      date: '2026-08-10',
      description: 'Sanctioned multi-sport tournament drafts commence.'
    },
    {
      id: 'cal_5',
      title: 'Serve Technique Drill Training Session',
      type: 'TRAINING' as const,
      date: '2026-08-15',
      time: '04:00 PM',
      location: 'Seattle Tennis Club',
      description: 'Practice serves with Coach Robert Smith.'
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10">
      <SectionHeader
        title="Schedule Calendar"
        description="Filter and track your match coordinates, entry deadlines, and club trainings."
        icon={Calendar}
        titleSize="xl"
      />

      <InteractiveCalendar events={events} />
    </div>
  );
}
