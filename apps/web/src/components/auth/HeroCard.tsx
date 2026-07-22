import React from 'react';
import Image from 'next/image';

export function HeroCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden h-full min-h-[400px] lg:min-h-[600px] border border-white/10 shadow-2xl group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/Hero.png"
          alt="DAFT Arena Hero"
          fill
          priority
          className="object-cover transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/40 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          DAFT Arena
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-md leading-relaxed mb-8">
          The ultimate Tournament Execution System. Built for scale, designed for performance, engineered for champions.
        </p>
        <div className="flex flex-wrap gap-4">
          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Platform Capabilities
          </div>
          <div className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors border border-input bg-background/50 backdrop-blur-md hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 text-white border-white/20">
            Enterprise Solutions
          </div>
        </div>
      </div>
    </div>
  );
}
