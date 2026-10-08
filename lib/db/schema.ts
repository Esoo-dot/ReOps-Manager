import { date, index, integer, pgTable, serial, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const operationsRecords = pgTable(
  'operations_records',
  {
    id: serial('id').primaryKey(),
    organizationId: varchar('organization_id', { length: 80 }).notNull().default('fieldwise-demo'),
    kind: varchar('kind', { length: 24 }).notNull(),
    title: text('title').notNull(),
    detail: text('detail').notNull().default(''),
    status: varchar('status', { length: 32 }).notNull().default('Open'),
    assignee: text('assignee').notNull().default('Unassigned'),
    branch: text('branch').notNull().default('All branches'),
    department: text('department').notNull().default('Operations'),
    priority: varchar('priority', { length: 16 }).notNull().default('Normal'),
    dueDate: date('due_date', { mode: 'string' }),
    progress: integer('progress').notNull().default(0),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  table => [
    index('operations_records_org_kind_idx').on(table.organizationId, table.kind),
    index('operations_records_org_status_idx').on(table.organizationId, table.status),
  ],
);

export type OperationsRecordRow = typeof operationsRecords.$inferSelect;
