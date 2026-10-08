import 'server-only';
import { and, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { db } from '@/lib/db';
import { operationsRecords, type OperationsRecordRow } from '@/lib/db/schema';
import { RECORD_KINDS, type OperationsRecord, type OperationsSummary } from '@/lib/api/types';
import { memoryStore } from './memory-store';
import { demoRecords } from './seed';

export const DEMO_ORGANIZATION_ID = 'fieldwise-demo';

const hasDatabase = Boolean(process.env.DATABASE_URL);
if (!hasDatabase) {
  console.warn('[reops] DATABASE_URL is not set. Using an in-memory store; changes reset when the server restarts.');
}

const globalForSchema = globalThis as unknown as { operationsSchemaReady?: Promise<void> };

function ensureSchema() {
  globalForSchema.operationsSchemaReady ??= (async () => {
    await db.execute(sql`
      CREATE TABLE IF NOT EXISTS operations_records (
        id serial PRIMARY KEY,
        organization_id varchar(80) NOT NULL DEFAULT 'fieldwise-demo',
        kind varchar(24) NOT NULL,
        title text NOT NULL,
        detail text NOT NULL DEFAULT '',
        status varchar(32) NOT NULL DEFAULT 'Open',
        assignee text NOT NULL DEFAULT 'Unassigned',
        branch text NOT NULL DEFAULT 'All branches',
        department text NOT NULL DEFAULT 'Operations',
        priority varchar(16) NOT NULL DEFAULT 'Normal',
        due_date date,
        progress integer NOT NULL DEFAULT 0,
        created_at timestamptz NOT NULL DEFAULT now(),
        updated_at timestamptz NOT NULL DEFAULT now()
      )
    `);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS operations_records_org_kind_idx ON operations_records (organization_id, kind)`);
    await db.execute(sql`CREATE INDEX IF NOT EXISTS operations_records_org_status_idx ON operations_records (organization_id, status)`);
  })().catch(error => {
    globalForSchema.operationsSchemaReady = undefined;
    throw error;
  });
  return globalForSchema.operationsSchemaReady;
}

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
  const { organizationId, updatedAt, createdAt, ...rest } = row;
  void organizationId;
  void updatedAt;
  return { ...rest, kind: rest.kind as OperationsRecord['kind'], createdAt: createdAt.toISOString() };
}

const scope = (...conditions: ReturnType<typeof eq>[]) =>
  and(eq(operationsRecords.organizationId, DEMO_ORGANIZATION_ID), ...conditions);

async function ensureDemoRecords() {
  await ensureSchema();
  const existing = await db.select({ id: operationsRecords.id }).from(operationsRecords).where(scope()).limit(1);
  if (existing.length) return;
  await db.insert(operationsRecords).values(demoRecords.map(record => ({ ...record, organizationId: DEMO_ORGANIZATION_ID })));
}

export async function listRecords(kind?: z.infer<typeof recordKindSchema>) {
  if (!hasDatabase) return memoryStore.list(kind);
  await ensureDemoRecords();
  const rows = await db
    .select()
    .from(operationsRecords)
    .where(kind ? scope(eq(operationsRecords.kind, kind)) : scope())
    .orderBy(desc(operationsRecords.createdAt), desc(operationsRecords.id));
  return rows.map(serialize);
}

export async function createRecord(input: z.infer<typeof recordInputSchema>) {
  const values = {
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
  };
  if (!hasDatabase) return memoryStore.create(values);
  await ensureSchema();
  const [created] = await db
    .insert(operationsRecords)
    .values({ ...values, organizationId: DEMO_ORGANIZATION_ID })
    .returning();
  return serialize(created);
}

export async function updateRecord(id: number, update: z.infer<typeof recordUpdateSchema>) {
  if (!hasDatabase) return memoryStore.update(id, update);
  await ensureSchema();
  const [updated] = await db
    .update(operationsRecords)
    .set({ ...update, updatedAt: new Date() })
    .where(scope(eq(operationsRecords.id, id)))
    .returning();
  return updated ? serialize(updated) : null;
}

export async function deleteRecord(id: number) {
  if (!hasDatabase) return memoryStore.remove(id);
  await ensureSchema();
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
