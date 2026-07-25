'use client';

import React, { useState } from 'react';
import { PlayerFeedback, PlayerTournament } from '../types';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { Button } from '@/components/ui/button';
import { Star, MessageSquare, ShieldAlert, Loader2, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FeedbackFormProps {
  tournaments: PlayerTournament[];
  pastFeedbacks: PlayerFeedback[];
  onSubmit: (data: { tournamentId: string; tournamentTitle: string; ratings: { tournament: number; venue: number; officials: number }; type: 'FEEDBACK' | 'COMPLAINT' | 'SUGGESTION'; message: string }) => Promise<PlayerFeedback>;
  className?: string;
}

export function FeedbackForm({ tournaments, pastFeedbacks, onSubmit, className }: FeedbackFormProps) {
  const [selectedTourIdx, setSelectedTourIdx] = useState(0);
  const [feedbackType, setFeedbackType] = useState<'FEEDBACK' | 'COMPLAINT' | 'SUGGESTION'>('FEEDBACK');
  const [ratings, setRatings] = useState({ tournament: 5, venue: 5, officials: 5 });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbacks, setFeedbacks] = useState<PlayerFeedback[]>(pastFeedbacks);

  const activeTournament = tournaments[selectedTourIdx];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTournament) return;

    setIsSubmitting(true);
    try {
      const res = await onSubmit({
        tournamentId: activeTournament.id,
        tournamentTitle: activeTournament.title,
        ratings,
        type: feedbackType,
        message
      });
      setFeedbacks(prev => [res, ...prev]);
      setMessage('');
      setRatings({ tournament: 5, venue: 5, officials: 5 });
      alert('Feedback submitted successfully. Thank you for your review!');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (category: keyof typeof ratings) => {
    const val = ratings[category];
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((num) => (
          <Star
            key={num}
            onClick={() => setRatings(prev => ({ ...prev, [category]: num }))}
            className={cn(
              'w-5 h-5 cursor-pointer transition-colors',
              num <= val ? 'text-amber-400 fill-amber-400' : 'text-white/10 hover:text-amber-400/50'
            )}
          />
        ))}
      </div>
    );
  };

  const getStatusBadge = (status: PlayerFeedback['status']) => {
    return status === 'REVIEWED'
      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
      : 'bg-white/5 text-muted-foreground border border-white/5';
  };

  return (
    <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-8', className)}>
      {/* Left panel form */}
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        <WidgetContainer className="p-6 space-y-5">
          <h3 className="text-base font-bold text-foreground">Submit Tournament Feedback</h3>

          {/* Tournament select */}
          {tournaments.length > 0 ? (
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Select Registered Tournament
              </label>
              <select
                value={selectedTourIdx}
                onChange={(e) => setSelectedTourIdx(Number(e.target.value))}
                className="w-full h-10 px-3 rounded-xl border border-white/10 bg-black/25 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50"
              >
                {tournaments.map((t, idx) => (
                  <option key={t.id} value={idx}>{t.title} ({t.sport})</option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-xs text-muted-foreground">You must have completed/registered tournaments to submit feedback.</p>
          )}

          {/* Type toggles */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'FEEDBACK', label: 'Review' },
              { id: 'SUGGESTION', label: 'Suggestion' },
              { id: 'COMPLAINT', label: 'Complaint' }
            ].map((t) => (
              <button
                type="button"
                key={t.id}
                onClick={() => setFeedbackType(t.id as unknown)}
                className={cn(
                  'h-9 rounded-xl border text-xs font-semibold flex items-center justify-center transition-all',
                  feedbackType === t.id
                    ? 'border-violet-500 bg-violet-500/5 text-violet-400'
                    : 'border-white/5 bg-black/10 text-muted-foreground hover:bg-white/5'
                )}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Ratings Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-white/5">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Tournament</span>
              {renderStars('tournament')}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Venue</span>
              {renderStars('venue')}
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Officials</span>
              {renderStars('officials')}
            </div>
          </div>

          {/* Message Area */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
              Comments / Detailed Description
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Provide comments or details here..."
              className="w-full p-3 rounded-xl border border-white/10 bg-black/25 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || tournaments.length === 0}
            className="w-full h-11 bg-violet-600 hover:bg-violet-700 text-white font-semibold rounded-xl shadow-lg shadow-violet-500/20 gap-2"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <MessageSquare className="w-4 h-4" />
            )}
            Submit Feedback
          </Button>
        </WidgetContainer>
      </form>

      {/* Right panel history list */}
      <div className="space-y-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">Feedback History</h4>
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {feedbacks.length > 0 ? (
            feedbacks.map((fb) => (
              <WidgetContainer key={fb.id} className="p-4 space-y-3 border-white/5 bg-card/40">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h5 className="font-bold text-xs text-foreground truncate max-w-[140px]">{fb.tournamentTitle}</h5>
                    <span className={cn('inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider mt-0.5', getStatusBadge(fb.status))}>
                      {fb.status}
                    </span>
                  </div>
                  <span className="text-[9px] font-black uppercase text-violet-400">{fb.type}</span>
                </div>

                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  "{fb.message}"
                </p>

                <div className="flex gap-2.5 text-[9px] text-muted-foreground pt-1 border-t border-white/5">
                  <span>Trn: {fb.ratings.tournament}★</span>
                  <span>Ven: {fb.ratings.venue}★</span>
                  <span>Off: {fb.ratings.officials}★</span>
                </div>
              </WidgetContainer>
            ))
          ) : (
            <p className="text-center text-xs text-muted-foreground py-8">No feedback submitted yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
