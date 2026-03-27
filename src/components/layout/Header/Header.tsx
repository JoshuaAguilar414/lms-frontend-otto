'use client';

import { useEffect } from 'react';
import { MainNav } from './MainNav';

export function Header() {
  useEffect(() => {
    const root = document.body;
    let lastY = window.scrollY;
    const threshold = 8;

    root.classList.add('scrolldirection-up');
    root.classList.remove('scrolldirection-down');

    const onScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY;

      // Keep header visible near top.
      if (currentY <= 0) {
        root.classList.add('scrolldirection-up');
        root.classList.remove('scrolldirection-down');
        lastY = currentY;
        return;
      }

      if (Math.abs(delta) < threshold) return;

      if (delta > 0) {
        root.classList.add('scrolldirection-down');
        root.classList.remove('scrolldirection-up');
      } else {
        root.classList.add('scrolldirection-up');
        root.classList.remove('scrolldirection-down');
      }

      lastY = currentY;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      root.classList.remove('scrolldirection-up', 'scrolldirection-down');
    };
  }, []);

  return (
    <header id="blockHeader" className="z-50 w-full flex">
      <MainNav />
    </header>
  );
}
