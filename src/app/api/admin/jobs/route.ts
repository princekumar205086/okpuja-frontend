import { NextResponse } from 'next/server';
import { mockJobs } from '@/app/lib/mock/adminData';

export async function GET() {
  try {
    const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (apiBase) {
      const response = await fetch(`${apiBase}/admin/jobs/`, {
        headers: { 'Content-Type': 'application/json' },
        next: { revalidate: 60 },
      });
      if (response.ok) {
        const data = await response.json();
        return NextResponse.json(data);
      }
    }
  } catch {
    // Fall through to mock data
  }
  return NextResponse.json(mockJobs);
}
