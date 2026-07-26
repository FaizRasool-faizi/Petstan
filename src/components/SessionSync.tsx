'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore } from '@/lib/store';

export function SessionSync() {
  const { data: session, status } = useSession();
  const { setUser, logout } = useAuthStore();

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUser({
        id: session.user.id,
        name: session.user.name || '',
        email: session.user.email || '',
        phone: '', // Fetch full profile if needed
        address: '', 
        role: session.user.role as any,
        createdAt: new Date(),
      });
    } else if (status === 'unauthenticated') {
      logout();
    }
  }, [session, status, setUser, logout]);

  return null;
}
