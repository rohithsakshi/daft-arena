'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BracketData, BracketRound, BracketMatch } from '../types';
import { Button } from '@/components/ui/button';
import { WidgetContainer } from '@/components/shared/WidgetContainer';
import { ZoomIn, ZoomOut, Maximize2, Minimize2, Move, Award, Swords } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BracketViewerProps {
  bracket: BracketData;
  className?: string;
}

export function BracketViewer({ bracket, className }: BracketViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [isFullscreen, setIsFullscreen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);

  // Keyboard navigation for zoom
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '=' || e.key === '+') {
        e.preventDefault();
        handleZoomIn();
      } else if (e.key === '-') {
        e.preventDefault();
        handleZoomOut();
      } else if (e.key === '0') {
        e.preventDefault();
        resetView();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleZoomIn = () => setZoom(z => Math.min(2.5, z + 0.15));
  const handleZoomOut = () => setZoom(z => Math.max(0.4, z - 0.15));
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  // Mouse drag triggers panning
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex flex-col h-[650px] relative border border-white/5 bg-black/45 rounded-2xl overflow-hidden select-none",
        isFullscreen && "fixed inset-0 w-screen h-screen z-50 rounded-none bg-background border-0",
        className
      )}
    >
      {/* Control panel buttons */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 z-20 bg-black/60 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-lg">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          title="Zoom In (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </Button>
        <span className="text-[10px] font-bold text-muted-foreground w-12 text-center uppercase tracking-wide">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          title="Zoom Out (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-white/10 mx-1" />
        <Button
          variant="ghost"
          size="icon"
          onClick={resetView}
          className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5 text-[10px] font-bold"
          title="Reset zoom (0)"
        >
          Reset
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleFullscreen}
          className="w-8 h-8 rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/5"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </Button>
      </div>

      {/* Helper drag tip */}
      <div className="absolute bottom-4 left-4 flex items-center gap-1.5 z-20 text-[10px] font-semibold text-muted-foreground bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/5">
        <Move className="w-3.5 h-3.5 text-violet-400" />
        Drag canvas to Pan/Move view
      </div>

      {/* Canvas workspace area */}
      <div
        ref={viewerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={cn(
          "flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing",
          isDragging && "cursor-grabbing"
        )}
      >
        <div
          className="absolute flex items-start gap-16 md:gap-24 p-12 md:p-20 transition-transform duration-75 origin-top-left"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          }}
        >
          {bracket.rounds.map((round, rIdx) => (
            <div key={rIdx} className="flex flex-col justify-around h-[400px] w-[220px] shrink-0 relative">
              {/* Round Title Header */}
              <div className="absolute -top-10 left-0 right-0 text-center">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-white/5 border border-white/5 px-2.5 py-1 rounded-full">
                  {round.roundName}
                </span>
              </div>

              {round.matches.map((match, mIdx) => {
                const isBye = match.status === 'BYE';
                return (
                  <div key={mIdx} className="relative py-2 flex flex-col justify-center">
                    {/* Node connector line */}
                    {rIdx < bracket.rounds.length - 1 && (
                      <div className="absolute top-1/2 -right-8 md:-right-12 w-8 md:w-12 h-px bg-white/10" />
                    )}

                    {/* Match bracket container */}
                    <div className={cn(
                      "p-3 rounded-xl border border-white/5 bg-card/60 backdrop-blur-md shadow-md text-xs space-y-2 hover:border-violet-500/20 transition-all",
                      (match.player1.id === 'plr_12345' || match.player2.id === 'plr_12345') && 'border-violet-500/40 bg-violet-600/5'
                    )}>
                      {/* Player 1 details */}
                      <div className={cn(
                        "flex justify-between items-center",
                        match.player1.isWinner && "font-bold text-foreground",
                        match.player1.isWinner === false && "opacity-50"
                      )}>
                        <span className="truncate pr-2">{match.player1.name}</span>
                        {match.player1.score && <span className="font-mono text-[10px]">{match.player1.score}</span>}
                      </div>

                      {/* Divider */}
                      <div className="h-px bg-white/5 flex items-center justify-center">
                        {!isBye && <span className="text-[9px] text-muted-foreground/30 px-1 bg-card">vs</span>}
                      </div>

                      {/* Player 2 details */}
                      <div className={cn(
                        "flex justify-between items-center",
                        match.player2.isWinner && "font-bold text-foreground",
                        match.player2.isWinner === false && "opacity-50"
                      )}>
                        <span className="truncate pr-2">{match.player2.name}</span>
                        {match.player2.score && <span className="font-mono text-[10px]">{match.player2.score}</span>}
                      </div>

                      {/* Match footer info (court, schedule) */}
                      {!isBye && (match.scheduledTime || match.courtName) && (
                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[9px] text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Swords className="w-2.5 h-2.5 text-violet-400" />
                            {match.courtName ?? 'Court TBD'}
                          </span>
                          <span>{match.scheduledTime}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
