'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

/**
 * Brand logo from /public/logo.svg — sizes match #blockHeader #blockHeaderMain #logo spec.
 */
export function OttoLogo() {
  const [logoSrc, setLogoSrc] = useState('/logo.svg');

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin/logo/current', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: { logoUrl?: string | null }) => {
        if (!mounted) return;
        if (data.logoUrl) setLogoSrc(data.logoUrl);
      })
      .catch(() => {
        // Keep default logo when custom logo is unavailable.
      });
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Link href="/" id="logo" className="block shrink-0">
      <img
        src={logoSrc}
        alt="otto group"
        className="mt-1 block h-6 w-auto lg:h-8"
        width={160}
        height={24}
      />
    </Link>
  );
}
