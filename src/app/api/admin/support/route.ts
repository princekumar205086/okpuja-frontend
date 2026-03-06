import { NextResponse } from 'next/server';
import { mockSupport } from '@/app/lib/mock/adminData';

export async function GET() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (apiBase) {
      const response = await fetch(`${apiBase}/admin/support/`, {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 30 },
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    }
  } catch {
    // Fall through to mock data
  }
  return NextResponse.json(mockSupport);
}
