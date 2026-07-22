import React from 'react';
import { HeroCard } from '@/components/auth/HeroCard';
import { RoleInfoCard } from '@/components/auth/RoleInfoCard';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 min-h-[600px] w-full h-[85vh]">
      <div className="xl:col-span-2 order-1 xl:order-1 h-full">
        <HeroCard />
      </div>
      
      <div className="xl:col-span-1 order-3 md:order-2 xl:order-2 h-full hidden md:block">
        <RoleInfoCard />
      </div>
      
      <div className="xl:col-span-1 order-2 md:order-3 xl:order-3 h-full">
        <RegisterForm />
      </div>
    </div>
  );
}
