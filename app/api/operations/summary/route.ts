import { NextResponse } from 'next/server';
import { getSummary } from '@/lib/operations/service';

export async function GET() {
  return NextResponse.json(await getSummary());
}
