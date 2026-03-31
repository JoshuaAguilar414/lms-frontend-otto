import { NextResponse } from 'next/server';
import { getCurrentLogoUrl } from '@/lib/adminStorage';

export async function GET() {
  const logoUrl = await getCurrentLogoUrl();
  return NextResponse.json({ logoUrl });
}
