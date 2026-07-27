import React from 'react';
import Image from 'next/image';

export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden py-12 px-4">
      <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-violet-900/20 to-transparent -z-10" />
      <div className="w-full max-w-3xl z-10">
        <div className="flex justify-center mb-8">
          <Image src="/da_trans_logo.png" alt="DAFT Arena Logo" width={80} height={80} />
        </div>
        {children}
      </div>
    </div>
  );
}
