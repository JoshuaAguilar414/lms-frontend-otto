'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { UserAvatar } from '@/components/ui';
import { api, setStoredToken } from '@/lib/api';
import { SearchBar } from './SearchBar';
import { COMPANY_INFO } from '@/lib/constants';
import { OttoLogo } from './OttoLogo';

const USER_DROPDOWN_FALLBACK = {
  name: 'User',
  email: '',
};

function HamburgerIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function CloseIcon({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const navLinkClass =
  'text-sm font-normal text-otto-burgundy transition-opacity hover:opacity-70';
const navLinkActiveClass = 'text-sm font-semibold text-otto-burgundy';

/** Desktop header nav — 16px, line-height 150% */
const headerNavLinkClass =
  'text-base font-semibold leading-[150%] text-otto-burgundy';
const headerNavLinkActiveClass =
  'text-base font-semibold leading-[150%] text-otto-burgundy';

export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const isRestrictedPage = pathname === '/restricted';
  const [hasToken, setHasToken] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const menuDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setHasToken(true);
  }, []);

  useEffect(() => {
    if (!hasToken) return;

    let cancelled = false;
    api.auth
      .me()
      .then((u) => {
        if (cancelled) return;
        setUserName(u?.name ?? null);
        setUserEmail(u?.email ?? null);
      })
      .catch(() => {
        if (cancelled) return;
        setUserName(null);
        setUserEmail(null);
      });

    return () => {
      cancelled = true;
    };
  }, [hasToken]);

  async function redirectToShopifyAccount(destination: 'profile' | 'orders') {
    try {
      const u = await api.auth.me();
      const shopifyShopIdResolved = u?.shopifyShopId ?? null;
      const shopifyShopDomainResolved = u?.shopifyShopDomain ?? null;

      if (shopifyShopIdResolved) {
        window.location.href = `https://shopify.com/${shopifyShopIdResolved}/account/${destination}`;
        return;
      }
      if (shopifyShopDomainResolved) {
        window.location.href = `https://${shopifyShopDomainResolved}/account/${destination}`;
        return;
      }

      window.location.href = destination === 'profile' ? '/profile-settings' : '/products';
    } catch {
      window.location.href = '/';
    }
  }

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const t = event.target as Node;
      if (userMenuRef.current && !userMenuRef.current.contains(t)) {
        setUserMenuOpen(false);
      }
      if (menuDropdownRef.current && !menuDropdownRef.current.contains(t)) {
        setMenuDropdownOpen(false);
      }
    }
    if (userMenuOpen || menuDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [userMenuOpen, menuDropdownOpen]);

  const dashboardActive = pathname === '/';
  const productsActive = pathname === '/products' || pathname.startsWith('/products/');
  const ordersActive = pathname === '/orders' || pathname.startsWith('/orders/');

  if (isRestrictedPage) {
    return (
      <nav
        id="blockHeaderMain"
        className="font-sans w-full max-w-full bg-white px-6 shadow-[inset_0_-1px_0_0_#F00020] min-h-[80px] lg:h-[100px] lg:min-h-[100px] lg:px-[3.333rem]"
      >
        <div className="relative mx-auto flex h-full w-full max-w-full items-center">
          <OttoLogo />
        </div>
      </nav>
    );
  }

  return (
    <nav
      id="blockHeaderMain"
      className="relative font-sans w-full max-w-full bg-white px-6 shadow-[inset_0_-1px_0_0_#F00020] min-h-[80px] lg:h-[100px] lg:min-h-[100px] lg:px-[3.333rem]"
    >
      <div className="relative mx-auto flex h-full w-full max-w-full flex-col justify-center">
        {/* Small screen: logo | search | hamburger (single row, reference layout) */}
        <div className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 sm:gap-3 lg:hidden">
          <div className="min-w-0 shrink-0">
            <OttoLogo />
          </div>
          <div className="flex min-w-0 justify-center px-1">
            <SearchBar inline />
          </div>
          <button
            type="button"
            onClick={() => setMobileMenuOpen((o) => !o)}
            className="flex shrink-0 items-center justify-center p-1 text-otto-burgundy hover:opacity-70"
            aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <CloseIcon /> : <HamburgerIcon />}
          </button>
        </div>

        {/* Desktop: logo | search | nav */}
        <div className="hidden w-full items-center justify-between gap-8 lg:flex">
          <div className="flex min-w-0 shrink-0 items-center lg:min-w-[11rem]">
            <OttoLogo />
          </div>

          <div className="flex min-w-0 flex-1 justify-center px-2">
            <SearchBar />
          </div>

          <div className="flex shrink-0 items-center gap-7">
            <div id="navigationMain" className="flex items-center gap-7">
              <div className={`navigationToggler inline-block ${dashboardActive ? 'navigation-toggler--active' : ''}`}>
                <Link
                  href="/"
                  className={`navigationButton ${dashboardActive ? headerNavLinkActiveClass : headerNavLinkClass}`}
                >
                  Dashboard
                </Link>
              </div>
              <div className={`navigationToggler inline-block ${productsActive ? 'navigation-toggler--active' : ''}`}>
                <Link
                  href="/products"
                  className={`navigationButton ${productsActive ? headerNavLinkActiveClass : headerNavLinkClass}`}
                >
                  Products
                </Link>
              </div>
              <div className={`navigationToggler inline-block ${ordersActive ? 'navigation-toggler--active' : ''}`}>
                <Link
                  href="/orders"
                  className={`navigationButton ${ordersActive ? headerNavLinkActiveClass : headerNavLinkClass}`}
                >
                  Orders
                </Link>
              </div>
            </div>

            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-otto-burgundy text-xs font-medium text-otto-burgundy transition-colors hover:bg-otto-burgundy hover:text-white"
              aria-label="Language: English"
            >
              En
            </button>

            {/* User avatar/menu temporarily hidden per current requirement. */}
          </div>
        </div>
      </div>

      {/* Mobile sheet */}
      <div
        className={`absolute right-4 top-full z-40 w-[min(17rem,calc(100vw-2rem))] transition-[visibility,opacity,transform] duration-200 lg:hidden ${
          mobileMenuOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
        }`}
      >
        <div
          className={`grid transition-[grid-template-rows] duration-200 ease-out ${
            mobileMenuOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden rounded-lg border border-otto-burgundy/20 bg-white shadow-lg">
            <ul className="space-y-0 px-3 py-2">
              <li>
                <Link
                  href="/"
                  className={`block py-2 text-sm ${dashboardActive ? navLinkActiveClass : navLinkClass}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </li>
              <li>
                <Link
                    href="/products"
                  className={`block py-2 text-sm ${
                    pathname === '/products' || pathname.startsWith('/products/')
                      ? navLinkActiveClass
                      : navLinkClass
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Products
                </Link>
              </li>
              <li>
                <Link
                    href="/orders"
                  className={`block py-2 text-sm ${
                    pathname === '/orders' || pathname.startsWith('/orders/')
                      ? navLinkActiveClass
                      : navLinkClass
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Orders
                </Link>
              </li>
              {hasToken ? (
                <>
                  <li className="border-t border-otto-burgundy/15 pt-2 mt-2">
                    <button
                      type="button"
                      className={`block w-full py-2 text-left text-sm ${navLinkClass}`}
                      aria-label="Language: English"
                    >
                      En
                    </button>
                  </li>
                </>
              ) : (
                <li className="border-t border-otto-burgundy/15 pt-2 mt-2">
                  <Link
                    href={COMPANY_INFO.marketplaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`block py-2 text-sm ${navLinkClass}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign in
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
