'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

export function GoogleAuthProviderWrapper({ children, clientId }: { children: React.ReactNode, clientId?: string }) {
  const effectiveClientId = clientId && clientId.trim().length > 0 ? clientId : 'unconfigured-google-client-id';
  return <GoogleOAuthProvider clientId={effectiveClientId}>{children}</GoogleOAuthProvider>;
}

