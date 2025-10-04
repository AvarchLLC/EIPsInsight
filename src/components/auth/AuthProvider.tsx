import { SessionProvider } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import { useUserStore } from '@/stores/userStore';
import { useEffect } from 'react';
import type { Session } from 'next-auth';

interface AuthProviderProps {
  children: React.ReactNode;
  session?: Session | null;
}

function SessionSyncComponent() {
  const { data: session, status } = useSession();
  const syncWithSession = useUserStore(state => state.syncWithSession);
  const setLoading = useUserStore(state => state.setLoading);
  
  useEffect(() => {
    if (status === 'loading') {
      setLoading(true);
      return;
    }
    
    setLoading(false);
    syncWithSession(session?.user);
  }, [session, status, syncWithSession, setLoading]);
  
  return null;
}

export function AuthProvider({ children, session }: AuthProviderProps) {
  return (
    <SessionProvider session={session}>
      <SessionSyncComponent />
      {children}
    </SessionProvider>
  );
}

export default AuthProvider;