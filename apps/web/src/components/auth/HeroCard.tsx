import React from 'react';
import Image from 'next/image';

export function HeroCard() {
  return (
    <div className="relative rounded-2xl overflow-hidden h-full min-h-[400px] lg:min-h-[600px] border border-white/10 shadow-2xl group">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/loginpage.png"
          alt="DAFT Arena Login Hero"
          fill
          priority
          className="object-cover object-right transition-transform duration-1000 group-hover:scale-105"
        />
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-background/20 to-transparent" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-end">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4 text-white">
          DAFT Arena
        </h1>
        <p className="text-lg md:text-xl text-white/80 max-w-md leading-relaxed mb-8">
          The ultimate Tournament Execution System. Built for scale, designed for performance, engineered for champions.
        </p>
      </div>
    </div>
  );
}
