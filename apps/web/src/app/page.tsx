import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { Trophy, CalendarDays, Activity, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      <header className="px-6 h-16 flex items-center justify-between border-b bg-background">
        <div className="font-bold text-xl tracking-tighter">DAFT Arena</div>
        <nav className="flex gap-4">
          <Link href="/login" className={buttonVariants({ variant: "ghost" })}>Login</Link>
          <Link href="/login" className={buttonVariants({ variant: "default" })}>Get Started</Link>
        </nav>
      </header>

      <main className="flex-1">
        <section className="w-full py-24 md:py-32 lg:py-48 flex items-center justify-center bg-muted/40">
          <div className="container px-4 md:px-6 text-center space-y-8">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
              Enterprise Tournament Management
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              The ultimate platform for organizing, managing, and competing in sports tournaments at scale.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/login" className={buttonVariants({ size: "lg" })}>Start Organizing</Link>
              <Link href="#features" className={buttonVariants({ size: "lg", variant: "outline" })}>Learn More</Link>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-24 bg-background">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Trophy className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Tournament Engine</h3>
                <p className="text-muted-foreground text-sm">Automated brackets, seeding, and live scoring systems.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <CalendarDays className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Smart Scheduling</h3>
                <p className="text-muted-foreground text-sm">Intelligent court mapping and conflict resolution.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <Activity className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Live Rankings</h3>
                <p className="text-muted-foreground text-sm">Real-time stats and dynamic global rankings.</p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="p-4 bg-primary/10 rounded-full">
                  <ShieldCheck className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Enterprise Security</h3>
                <p className="text-muted-foreground text-sm">Role-based access control and strict IAM policies.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-12 bg-muted/20">
        <div className="container px-4 md:px-6 mx-auto text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} DAFT Arena. All rights reserved.
        </div>
      </footer>
    </>
  );
}
