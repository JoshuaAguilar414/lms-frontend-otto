import Link from 'next/link';

/**
 * Brand logo from /public/logo.svg — sizes match #blockHeader #blockHeaderMain #logo spec.
 */
export function OttoLogo() {
  return (
    <Link href="/" id="logo" className="block shrink-0">
      <img
        src="/logo.svg"
        alt="otto group"
        className="mt-1 block h-6 w-auto lg:h-8"
        width={160}
        height={24}
      />
    </Link>
  );
}
