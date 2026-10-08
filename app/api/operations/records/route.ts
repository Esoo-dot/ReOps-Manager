import { NextResponse, type NextRequest } from 'next/server';
import { createRecord, listRecords, recordInputSchema, recordKindSchema } from '@/lib/operations/service';

export async function GET(request: NextRequest) {
  const kindParam = request.nextUrl.searchParams.get('kind');
  const kind = kindParam ? recordKindSchema.safeParse(kindParam) : null;
  if (kind && !kind.success) return NextResponse.json({ error: 'Invalid record filter.' }, { status: 400 });
  return NextResponse.json(await listRecords(kind?.data));
}

export async function POST(request: NextRequest) {
  const input = recordInputSchema.safeParse(await request.json().catch(() => null));
  if (!input.success) return NextResponse.json({ error: 'Invalid record details.' }, { status: 400 });
  return NextResponse.json(await createRecord(input.data), { status: 201 });
}
