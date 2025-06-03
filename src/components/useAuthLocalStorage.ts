import { useEffect } from 'react';
import { useSession } from 'next-auth/react';

export const useAuthLocalStorage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      localStorage.setItem('user', JSON.stringify({
        id: session.user?.id,
        name: session.user?.name,
        email: session.user?.email,
        image: session.user?.image,
        tier: session.user?.tier,
        walletAddress: session.user?.walletAddress,
        expires: session.expires
      }));
    } else {
      localStorage.removeItem('user');
    }
  }, [session]);

  return null;
};