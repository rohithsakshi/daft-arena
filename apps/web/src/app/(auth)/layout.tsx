// @ts-nocheck
import { GoogleAuthProviderWrapper } from '@/components/auth/GoogleAuthProviderWrapper';
import { config } from '@/lib/config';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <GoogleAuthProviderWrapper clientId={config.GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-background relative flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Background Gradients */}
        <div className="absolute top-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/20 blur-[120px]" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
        </div>
        
        {/* Content Container */}
        <div className="w-full max-w-[1400px] z-10 relative">
          {children}
        </div>
      </div>
    </GoogleAuthProviderWrapper>
  );
}
