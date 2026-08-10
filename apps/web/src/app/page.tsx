// @ts-nocheck
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { buttonVariants } from '@/components/ui/button';
import { Play, Sparkles } from 'lucide-react';

export const metadata = {
  title: 'DAFT Arena — Enterprise Tournament Management',
  description: 'The ultimate Tournament Execution System. Built for scale, designed for performance, engineered for champions.',
};

export default function LandingPage() {
  return (
    <main className="relative min-h-screen w-full overflow-x-hidden bg-background flex flex-col-reverse lg:flex-row">
      {/* Left: Content */}
      <div className="flex-none w-full lg:w-[40%] max-w-2xl flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24 z-10 py-10 md:py-20 relative">
        {/* Tag */}
        <div className="inline-flex items-center gap-2 mb-6 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 w-fit">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span className="text-xs font-semibold text-violet-400 tracking-wide">Enterprise Sports Platform</span>
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 text-foreground leading-[1.1] break-words">
          Welcome to{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500">
            DAFT Arena
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground leading-relaxed mb-10">
          The ultimate Tournament Execution System. Built for scale, designed for performance, engineered for champions.
        </p>

        <div className="flex flex-wrap gap-4">
          <Link
            href="/roles"
            className={buttonVariants({
              size: 'lg',
              className:
                'h-14 px-8 text-lg bg-violet-600 hover:bg-violet-700 text-white border-0 shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-all duration-300',
            })}
          >
            Get Started Free
          </Link>
          <Link
            href="/roles?intent=login"
            className={buttonVariants({
              size: 'lg',
              variant: 'outline',
              className:
                'h-14 px-8 text-lg border-violet-500/50 text-violet-300 hover:bg-violet-600/10 hover:text-violet-200 hover:border-violet-400 bg-background/50 backdrop-blur-md transition-all duration-300',
            })}
          >
            Sign In
          </Link>
        </div>

        {/* Demo Mode CTA */}
        <div className="mt-8 pt-8 border-t border-border/50">
          <p className="text-sm text-muted-foreground mb-3">
            Not ready to sign up? Explore with a demo account.
          </p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 text-sm font-semibold text-violet-400 hover:text-violet-300 transition-colors group"
          >
            <div className="w-8 h-8 rounded-full bg-violet-500/10 flex items-center justify-center group-hover:bg-violet-500/20 transition-colors">
              <Play className="w-3.5 h-3.5 text-violet-400 ml-0.5" />
            </div>
            Try Demo — No sign-up required
          </Link>
        </div>
      </div>

      {/* Right: Hero Artwork */}
      <div className="relative w-full h-[45vh] min-h-[300px] lg:h-auto lg:flex-1 z-0">
        <div className="relative w-full h-full">
          <Image
            src="/Hero.png"
            alt="DAFT Arena — Tournament management platform hero"
            fill
            priority
            className="object-cover object-center lg:object-right"
          />
          {/* Gradient overlays */}
          <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-background to-transparent hidden lg:block" />
          {/* Mobile bottom gradient to blend with content */}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent lg:hidden" />
        </div>
      </div>
    </main>
  );
}
