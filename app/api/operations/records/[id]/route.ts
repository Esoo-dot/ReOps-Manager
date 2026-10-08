import { NextResponse, type NextRequest } from 'next/server';
import { deleteRecord, recordIdSchema, recordUpdateSchema, updateRecord } from '@/lib/operations/service';

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Context) {
  const id = recordIdSchema.safeParse((await params).id);
  const update = recordUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!id.success || !update.success) return NextResponse.json({ error: 'Invalid record update.' }, { status: 400 });
  const updated = await updateRecord(id.data, update.data);
  if (!updated) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: Context) {
  const id = recordIdSchema.safeParse((await params).id);
  if (!id.success) return NextResponse.json({ error: 'Invalid record id.' }, { status: 400 });
  if (!(await deleteRecord(id.data))) return NextResponse.json({ error: 'Record not found.' }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
