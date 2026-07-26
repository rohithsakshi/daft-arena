// @ts-nocheck
import React from 'react';
import { PlayerService } from '@/modules/player/services/player.client.service';
import { QRPassCard } from '@/modules/player/components/QRPassCard';
import { SectionHeader } from '@/components/shared/SectionHeader';
import { EmptyState } from '@/components/shared/EmptyState';
import { Ticket, AlertCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Tournament Pass QR Code | DAFT Arena',
  description: 'Download and display your tournament entry codes.',
};

export default async function TournamentPassQRPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pass = await PlayerService.getQRPass(id);

  if (!pass) {
    return (
      <div className="space-y-8 animate-in fade-in duration-500 pb-10">
        <SectionHeader
          title="Entry Pass QR"
          description="View digital gate tickets."
          titleSize="xl"
        />
        <EmptyState
          icon={AlertCircle}
          title="Pass Not Found"
          description="We couldn't generate the entry pass details for this tournament."
          action={
            <Link
              href="/workspace/player/my-tournaments"
              className="inline-flex items-center gap-2 h-10 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              Back to My Tournaments
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-10 max-w-md mx-auto">
      <SectionHeader
        title="Sanctioned Entry Pass"
        titleSize="sm"
        className="mb-4"
        action={
          <Link
            href={`/workspace/player/my-tournaments/${id}`}
            className="inline-flex items-center text-xs text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to Tournament Detail
          </Link>
        }
      />

      <QRPassCard pass={pass} />
    </div>
  );
}
