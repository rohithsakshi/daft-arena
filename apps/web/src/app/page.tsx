import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-background flex">
      {/* 
        We use a 2-column layout on Desktop, and stack on Mobile.
        The right side contains the official Hero artwork.
      */}
      <div className="flex-none flex flex-col justify-center px-8 md:px-16 lg:px-24 z-10 lg:w-[35%] max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground">
          Welcome to DAFT Arena
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
          The ultimate Tournament Execution System. Built for scale, designed for performance, engineered for champions.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link 
            href="/capabilities" 
            className={buttonVariants({ 
              size: "lg", 
              className: "h-14 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300" 
            })}
          >
            Login
          </Link>
          <Link 
            href="/capabilities?mode=register" 
            className={buttonVariants({ 
              size: "lg", 
              variant: "outline", 
              className: "h-14 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-600/10 hover:text-violet-200 hover:border-violet-400 bg-background/50 backdrop-blur-md transition-all duration-300" 
            })}
          >
            Sign Up
          </Link>
        </div>
      </div>

      {/* Right Side: Hero Artwork (hidden on mobile, absolute overlay, or true split depending on layout) */}
      <div className="absolute inset-0 lg:static lg:flex-1 z-0 bg-black/10">
        <div className="relative w-full h-full">
          <Image
            src="/Hero.png"
            alt="DAFT Arena Hero"
            fill
            priority
            className="object-cover object-center lg:object-right"
          />
          {/* Gradients to fade smoothly into the background color */}
          <div className="absolute inset-0 bg-background/60 lg:bg-transparent" />
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent hidden lg:block" />
        </div>
      </div>
    </main>
  );
}
