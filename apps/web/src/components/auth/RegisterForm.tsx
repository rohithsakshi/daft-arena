'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/services/auth.service';
import { toast } from 'sonner';

const registerSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { fullName: '', email: '', phone: '', password: '', confirmPassword: '' },
  });

  const onSubmit = async (data: RegisterValues) => {
    setIsLoading(true);
    try {
      await AuthService.register(data);
      toast.success("Registration successful! Welcome to DAFT Arena.");
      router.push('/workspace');
    } catch (error: any) {
      toast.error(error.message || "Failed to register account.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col justify-center p-5 md:p-7 rounded-2xl border border-white/5 bg-card/60 backdrop-blur-xl shadow-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Create Account</h2>
        <p className="text-muted-foreground text-sm">Let&apos;s get you started</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="name" className="text-xs font-semibold text-foreground/80">Full Name</Label>
          <Input id="name" placeholder="John Doe" className="h-11 bg-background/50 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg placeholder:text-muted-foreground/40 transition-all" {...form.register('fullName')} />
          {form.formState.errors.fullName && <p className="text-xs text-destructive mt-1">{form.formState.errors.fullName.message}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold text-foreground/80">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" className="h-11 bg-background/50 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg placeholder:text-muted-foreground/40 transition-all" {...form.register('email')} />
            {form.formState.errors.email && <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-semibold text-foreground/80">Phone</Label>
            <Input id="phone" type="tel" placeholder="+1 (555) 000-0000" className="h-11 bg-background/50 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg placeholder:text-muted-foreground/40 transition-all" {...form.register('phone')} />
            {form.formState.errors.phone && <p className="text-xs text-destructive mt-1">{form.formState.errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-xs font-semibold text-foreground/80">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"} 
              className="h-11 bg-background/50 border-white/10 focus-visible:ring-violet-500 focus-visible:border-violet-500 rounded-lg placeholder:text-muted-foreground/40 transition-all pr-10"
              {...form.register('password')} 
            />
            <button 
              type="button" 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-violet-400 transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {form.formState.errors.password && <p className="text-xs text-destructive mt-1">{form.formState.errors.password.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input id="confirmPassword" type={showPassword ? "text" : "password"} {...form.register('confirmPassword')} />
          {form.formState.errors.confirmPassword && <p className="text-xs text-destructive mt-1">{form.formState.errors.confirmPassword.message}</p>}
        </div>

        <Button 
          type="submit" 
          className="w-full h-11 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white rounded-lg shadow-[0_0_15px_rgba(124,58,237,0.2)] hover:shadow-[0_0_25px_rgba(124,58,237,0.4)] transition-all duration-300 border-0 mt-4" 
          disabled={isLoading}
        >
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <div className="my-6 relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center w-full">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 px-3 bg-card">
          OR
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" type="button" className="h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:text-foreground transition-all rounded-lg gap-2 text-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
          Google
        </Button>
        <Button variant="outline" type="button" className="h-11 bg-white/5 border-white/10 hover:bg-white/10 hover:text-foreground transition-all rounded-lg gap-2 text-sm">
          <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="currentColor" d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.04 2.34-.73 3.83-.65 1.25.07 2.3.56 3.03 1.5-2.85 1.77-2.3 5.48.51 6.64-.7 1.83-1.47 3.63-2.45 4.68zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/></svg>
          Apple
        </Button>
      </div>
    </div>
  );
}
