import 'server-only';
import { and, desc, eq } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { operationsRecords, type OperationsRecordRow } from '@/lib/db/schema';
import { RECORD_KINDS, type OperationsRecord, type OperationsSummary } from '@/lib/api/types';
import { demoRecords } from './seed';

export const DEMO_ORGANIZATION_ID = 'fieldwise-demo';

const shortText = z.string().trim().max(120);
const dueDate = z
  .union([z.string().regex(/^\d{4}-\d{2}-\d{2}$/), z.literal(''), z.null()])
  .transform(value => value || null);

const editableFields = {
  title: z.string().trim().min(1).max(200),
  detail: z.string().trim().max(2000),
  status: z.string().trim().max(32),
  assignee: shortText,
  branch: shortText,
  department: shortText,
  priority: z.string().trim().max(16),
  dueDate,
  progress: z.number().int().min(0).max(100),
};

export const recordKindSchema = z.enum(RECORD_KINDS);
export const recordInputSchema = z.object({ kind: recordKindSchema, ...editableFields }).partial().required({ kind: true, title: true });
export const recordUpdateSchema = z.object(editableFields).partial();
export const recordIdSchema = z.coerce.number().int().positive();

function serialize(row: OperationsRecordRow): OperationsRecord {
  const { organizationId: _org, updatedAt: _updated, createdAt, ...rest } = row;
  return { ...rest, kind: rest.kind as OperationsRecord['kind'], createdAt: createdAt.toISOString() };
}

const scope = (...conditions: ReturnType<typeof eq>[]) =>
  and(eq(operationsRecords.organizationId, DEMO_ORGANIZATION_ID), ...conditions);

async function ensureDemoRecords() {
  const existing = await db.select({ id: operationsRecords.id }).from(operationsRecords).where(scope()).limit(1);
  if (existing.length) return;
  await db.insert(operationsRecords).values(demoRecords.map(record => ({ ...record, organizationId: DEMO_ORGANIZATION_ID })));
}

export async function listRecords(kind?: z.infer<typeof recordKindSchema>) {
  await ensureDemoRecords();
  const rows = await db
    .select()
    .from(operationsRecords)
    .where(kind ? scope(eq(operationsRecords.kind, kind)) : scope())
    .orderBy(desc(operationsRecords.createdAt), desc(operationsRecords.id));
  return rows.map(serialize);
}

export async function createRecord(input: z.infer<typeof recordInputSchema>) {
  const [created] = await db
    .insert(operationsRecords)
    .values({
      organizationId: DEMO_ORGANIZATION_ID,
      kind: input.kind,
      title: input.title,
      detail: input.detail ?? '',
      status: input.status || 'Open',
      assignee: input.assignee || 'Unassigned',
      branch: input.branch || 'All branches',
      department: input.department || 'Operations',
      priority: input.priority || 'Normal',
      dueDate: input.dueDate ?? null,
      progress: input.progress ?? 0,
    })
    .returning();
  return serialize(created);
}

export async function updateRecord(id: number, update: z.infer<typeof recordUpdateSchema>) {
  const [updated] = await db
    .update(operationsRecords)
    .set({ ...update, updatedAt: new Date() })
    .where(scope(eq(operationsRecords.id, id)))
    .returning();
  return updated ? serialize(updated) : null;
}

export async function deleteRecord(id: number) {
  const deleted = await db
    .delete(operationsRecords)
    .where(scope(eq(operationsRecords.id, id)))
    .returning({ id: operationsRecords.id });
  return deleted.length > 0;
}

export async function getSummary(): Promise<OperationsSummary> {
  const records = await listRecords();
  const ofKind = (kind: string) => records.filter(record => record.kind === kind);
  const averageProgress = (kind: string) => {
    const items = ofKind(kind);
    return items.length ? Math.round(items.reduce((total, item) => total + item.progress, 0) / items.length) : 0;
  };
  return {
    employees: ofKind('employee').length,
    branches: ofKind('branch').length,
    tasksOpen: ofKind('task').filter(record => !['Completed', 'Cancelled'].includes(record.status)).length,
    requestsOpen: ofKind('request').filter(record => !['Resolved', 'Closed'].includes(record.status)).length,
    trainingCompletion: averageProgress('training'),
    kpiAchievement: averageProgress('kpi'),
    recentActivity: records.slice(0, 8),
  };
}
