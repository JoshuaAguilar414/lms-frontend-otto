'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStoredToken } from '@/lib/api';

interface AuthGuardProps {
  children: React.ReactNode;
}

/**
 * Redirects to /restricted when the user is not signed in (no LMS token).
 * Use around protected page content (dashboard, My Courses, etc.).
 *
 * Frontend-only mode note:
 * Keep backend integration intact, but bypass redirect for UI development.
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setAllowed(true);
    } else {
      // Frontend-only bypass: show pages without backend auth.
      // Re-enable protected-route behavior by switching to:
      // setAllowed(false);
      // router.replace('/restricted');
      setAllowed(true);
    }
  }, [router]);

  // Still deciding or redirect in progress
  if (allowed === null || allowed === false) {
    return null;
  }
  return <>{children}</>;
}
