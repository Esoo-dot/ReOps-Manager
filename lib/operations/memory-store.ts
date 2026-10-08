import 'server-only';
import type { OperationsRecord, RecordKind } from '@/lib/api/types';
import { demoRecords } from './seed';

type Store = { records: OperationsRecord[]; nextId: number };

// Used only when DATABASE_URL is not configured, so the app stays usable in a fresh preview.
// Kept on globalThis so it survives hot reloads in development.
const globalForStore = globalThis as unknown as { operationsMemoryStore?: Store };

function createStore(): Store {
  const now = Date.now();
  const records = demoRecords.map((record, index) => ({
    ...record,
    id: index + 1,
    createdAt: new Date(now - index * 60_000).toISOString(),
  }));
  return { records, nextId: records.length + 1 };
}

const store = (globalForStore.operationsMemoryStore ??= createStore());

const newestFirst = (a: OperationsRecord, b: OperationsRecord) =>
  b.createdAt.localeCompare(a.createdAt) || b.id - a.id;

export const memoryStore = {
  list(kind?: RecordKind) {
    return store.records.filter(record => !kind || record.kind === kind).sort(newestFirst);
  },
  create(record: Omit<OperationsRecord, 'id' | 'createdAt'>) {
    const created: OperationsRecord = { ...record, id: store.nextId++, createdAt: new Date().toISOString() };
    store.records.push(created);
    return created;
  },
  update(id: number, update: Partial<Omit<OperationsRecord, 'id' | 'kind' | 'createdAt'>>) {
    const record = store.records.find(item => item.id === id);
    if (!record) return null;
    Object.assign(record, update);
    return record;
  },
  remove(id: number) {
    const before = store.records.length;
    store.records = store.records.filter(item => item.id !== id);
    return store.records.length < before;
  },
};
