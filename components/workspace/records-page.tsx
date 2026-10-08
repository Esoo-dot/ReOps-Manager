'use client';

import { type FormEvent, useMemo, useState } from 'react';
import { useWorkspace } from '@/components/workspace/workspace-context';
import { type Language, tx, cx, pageMeta } from '@/lib/workspace/config';
import { PageTitle, Button, Skeleton, QueryError, EmptyState, RecordStatus } from '@/components/workspace/primitives';
import { useCreateOperationsRecord, useDeleteOperationsRecord, useGetOperationsSummary, useListOperationsRecords, useUpdateOperationsRecord, useRefreshData } from '@/lib/api/hooks';
import { type OperationsRecord, type OperationsRecordInput, type RecordKind } from '@/lib/api/types';
import { Activity, BookOpenCheck, Building2, Check, ClipboardList, FileText, Filter, Plus, Search, ShieldCheck, Target, X, Pencil, Trash2 } from 'lucide-react';

const EMPTY_RECORDS: OperationsRecord[] = [];

function RecordsPage({ path, meta, language, globalSearch }: { path: string; meta: typeof pageMeta[string]; language: Language; globalSearch: string }) {
  const [localSearch, setLocalSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<OperationsRecord | null>(null);
  const [filter, setFilter] = useState('All');
  const query = useListOperationsRecords(meta.kind ? { kind: meta.kind } : undefined);
  const records = query.data ?? EMPTY_RECORDS;
  const searchValue = `${localSearch} ${globalSearch}`.trim().toLowerCase();
  const filtered = useMemo(() => records.filter(r => {
    const matches = !searchValue || `${r.title} ${r.detail} ${r.assignee} ${r.branch} ${r.department} ${r.status}`.toLowerCase().includes(searchValue);
    const filterMatches = filter === 'All' || r.status.toLowerCase().includes(filter.toLowerCase());
    return matches && filterMatches;
  }), [records, searchValue, filter]);
  const create = () => setShowCreate(true);
  return <>
    <PageTitle eyebrow={meta.eyebrow} title={meta.title} subtitle={meta.subtitle} language={language} action={<Button onClick={create} testId="button-create-record"><Plus size={15} />{tx('Add record', language)}</Button>} />
    {path === '/app/tasks' && <div className="mb-6 grid gap-3 sm:grid-cols-3"><QuickStat label="In progress" value={records.filter(r => r.status.toLowerCase().includes('progress')).length} color="#c28a3c" /><QuickStat label="Completed" value={records.filter(r => r.status.toLowerCase().includes('complete')).length} color="#507d69" /><QuickStat label="High priority" value={records.filter(r => r.priority.toLowerCase() === 'high').length} color="#b56c52" /></div>}
     {path === '/app/branches' && <div className="mb-6 grid gap-3 sm:grid-cols-3"><QuickStat label="Active locations" value={records.length} color="#507d69" /><QuickStat label="Avg. readiness" value={records.length ? `${Math.round(records.reduce((sum, record) => sum + record.progress, 0) / records.length)}%` : '—'} color="#c28a3c" /><QuickStat label="Needs attention" value={records.filter(r => r.status.toLowerCase().includes('attention')).length} color="#b56c52" /></div>}
    {path === '/app/performance' && <PerformancePanel records={records} />}
    {path === '/app/training' && <TrainingPanel records={records} />}
    <section className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="flex flex-col gap-3 border-b border-border p-4 md:flex-row md:items-center md:justify-between md:px-5">
        <div><h2 className="text-[12px] font-bold">{meta.title === 'People' ? 'Team directory' : meta.title === 'Requests' ? 'Incoming queue' : meta.title === 'Branches' ? 'Location overview' : `${meta.title} register`}</h2><p className="mt-1 text-[10px] text-muted-foreground">{filtered.length} records · updated just now</p></div>
        <div className="flex flex-wrap gap-2">
          <div className="relative min-w-[170px] flex-1 sm:flex-none"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" /><input data-testid="input-record-search" value={localSearch} onChange={e => setLocalSearch(e.target.value)} placeholder={tx('Search records', language)} className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-[11px] outline-none focus:border-primary/60" /></div>
          <div className="relative"><Filter size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" /><select aria-label="Filter records by status" data-testid="select-status-filter" value={filter} onChange={e => setFilter(e.target.value)} className="h-9 appearance-none rounded-lg border border-border bg-background pl-8 pr-7 text-[11px] outline-none"><option>All</option><option>Open</option><option>In progress</option><option>Pending</option><option>Complete</option><option>Active</option></select></div>
        </div>
      </div>
      {query.isLoading ? <div className="p-4"><Skeleton rows={5} /></div> : query.isError ? <div className="p-4"><QueryError retry={() => query.refetch()} /></div> : filtered.length === 0 ? <div className="p-4"><EmptyState language={language} search={!!searchValue || filter !== 'All'} action={create} /></div> : <RecordTable records={filtered} path={path} onEdit={setEditing} />}
    </section>
    {(showCreate || editing) && <RecordDialog kind={meta.kind ?? 'task'} record={editing} onClose={() => { setShowCreate(false); setEditing(null); }} language={language} />}
  </>;
}
function QuickStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3.5"><span className="size-2 rounded-full" style={{ background: color }} /><div className="flex-1 text-[10px] text-muted-foreground">{label}</div><strong className="text-[16px] tracking-tight">{value}</strong></div>;
}
function RecordTable({ records, path, onEdit }: { records: OperationsRecord[]; path: string; onEdit: (record: OperationsRecord) => void }) {
  const isPeople = path === '/app/employees';
  const isBranch = path === '/app/branches';
  const isKpi = path === '/app/performance';
  const isTraining = path === '/app/training';
  return <div className="divide-y divide-border/70">
    <div className="hidden grid-cols-[minmax(200px,1.6fr)_minmax(110px,1fr)_minmax(110px,1fr)_100px_80px] gap-4 bg-background/75 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[.12em] text-muted-foreground md:grid">
      <span>{isPeople ? 'Team member' : isBranch ? 'Branch' : isKpi ? 'Measure' : isTraining ? 'Course' : 'Work item'}</span><span>{isPeople ? 'Department' : 'Assigned to'}</span><span>{isPeople ? 'Branch' : 'Due / priority'}</span><span>Status</span><span className="text-right">Progress</span>
    </div>
    {records.map(record => <RecordRow key={record.id} record={record} path={path} onEdit={onEdit} />)}
  </div>;
}
function RecordRow({ record, path, onEdit }: { record: OperationsRecord; path: string; onEdit: (record: OperationsRecord) => void }) {
  const update = useUpdateOperationsRecord();
  const remove = useDeleteOperationsRecord();
  const refresh = useRefreshData();
  const isPeople = path === '/app/employees';
  const isBranch = path === '/app/branches';
  const identity = isPeople ? record.title.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : null;
  const advanceStatus = () => {
    const next = record.status.toLowerCase().includes('complete') ? 'In progress' : 'Complete';
    update.mutate({ id: record.id, data: { status: next, progress: next === 'Complete' ? 100 : Math.max(25, record.progress) } }, { onSuccess: refresh });
  };
  const deleteRecord = () => {
    if (window.confirm(`Delete “${record.title}”? This cannot be undone.`)) remove.mutate({ id: record.id }, { onSuccess: refresh });
  };
  return <div className="grid gap-3 px-4 py-4 transition-colors hover:bg-background/80 md:grid-cols-[minmax(200px,1.6fr)_minmax(110px,1fr)_minmax(110px,1fr)_100px_80px] md:items-center md:gap-4 md:px-5" data-testid={`row-record-${record.id}`}>
    <div className="flex min-w-0 items-center gap-3">{identity ? <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e6eee7] text-[10px] font-bold text-[#507d69]">{identity}</div> : <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf0e9] text-primary">{isBranch ? <Building2 size={16} /> : path === '/app/requests' ? <ClipboardList size={16} /> : path === '/app/training' ? <BookOpenCheck size={16} /> : <FileText size={16} />}</div>}<div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{record.title}</div><div className="mt-1 truncate text-[10px] text-muted-foreground">{record.detail || record.department || 'No additional details'}</div></div><div className="flex md:hidden"><RecordStatus status={record.status} /></div></div>
    <div className="flex items-center gap-2 pl-12 text-[10px] text-muted-foreground md:pl-0"><span className="md:hidden text-[9px] uppercase tracking-wide">With</span>{isPeople ? record.department || 'General' : record.assignee || 'Unassigned'}{isBranch && record.department ? ` · ${record.department}` : ''}</div>
    <div className="flex items-center gap-2 pl-12 text-[10px] text-muted-foreground md:pl-0"><span className="md:hidden text-[9px] uppercase tracking-wide">{isPeople ? 'Location' : 'Due'}</span>{isPeople ? record.branch || '—' : record.dueDate || record.priority || '—'}{!isPeople && record.dueDate && record.priority ? <span className={cx('rounded px-1.5 py-0.5 text-[9px] font-semibold', record.priority.toLowerCase() === 'high' ? 'bg-[#f8e8e2] text-[#a75b45]' : 'bg-muted text-muted-foreground')}>{record.priority}</span> : null}</div>
    <div className="hidden md:block"><RecordStatus status={record.status} /></div>
    <div className="flex items-center justify-between pl-12 md:justify-end md:pl-0"><div className="flex items-center gap-2"><div className="h-1.5 w-12 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${record.progress}%` }} /></div><span className="text-[10px] text-muted-foreground">{record.progress}%</span></div>
      <div className="ms-2 flex items-center gap-1"><button onClick={() => onEdit(record)} aria-label={`Edit ${record.title}`} data-testid={`button-edit-${record.id}`} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"><Pencil size={13} /></button><button onClick={advanceStatus} disabled={update.isPending} aria-label={`Update ${record.title} status`} data-testid={`button-status-${record.id}`} className="grid size-7 place-items-center rounded-md text-primary hover:bg-[#e8f0e9] disabled:opacity-40"><Check size={14} /></button><button onClick={deleteRecord} disabled={remove.isPending} aria-label={`Delete ${record.title}`} data-testid={`button-delete-${record.id}`} className="grid size-7 place-items-center rounded-md text-muted-foreground hover:bg-[#f8e8e2] hover:text-[#a75b45] disabled:opacity-40"><Trash2 size={13} /></button></div></div>
  </div>;
}

function RecordDialog({ kind, record, onClose, language }: { kind: RecordKind; record: OperationsRecord | null; onClose: () => void; language: Language }) {
  const create = useCreateOperationsRecord();
  const update = useUpdateOperationsRecord();
  const refresh = useRefreshData();
  const [error, setError] = useState('');
  const [values, setValues] = useState({
    title: record?.title ?? '', detail: record?.detail ?? '', status: record?.status ?? 'Open',
    assignee: record?.assignee ?? '', branch: record?.branch ?? '', department: record?.department ?? '',
    priority: record?.priority ?? 'Normal', dueDate: record?.dueDate ?? '',
    progress: record?.progress ?? 0,
  });
  const pending = create.isPending || update.isPending;
  const change = (key: keyof typeof values, value: string | number) => setValues(current => ({ ...current, [key]: value }));
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!values.title.trim()) { setError('Please add a title before saving.'); return; }
    const data = { ...values, title: values.title.trim(), dueDate: values.dueDate || null, progress: Number(values.progress) };
    if (record) update.mutate({ id: record.id, data }, { onSuccess: () => { refresh(); onClose(); }, onError: () => setError('Could not save changes. Please try again.') });
    else create.mutate({ data: { kind, ...data } as OperationsRecordInput }, { onSuccess: () => { refresh(); onClose(); }, onError: () => setError('Could not create this record. Please try again.') });
  };
  const field = (name: keyof typeof values, label: string, type = 'text', placeholder = '') => <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-muted-foreground">{tx(label, language)}</span><input data-testid={`input-record-${name}`} required={name === 'title'} type={type} value={values[name]} onChange={e => change(name, type === 'number' ? Number(e.target.value) : e.target.value)} placeholder={placeholder} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[11px] outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/10" /></label>;
  const select = (name: 'status' | 'priority', label: string, options: string[]) => <label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-muted-foreground">{tx(label, language)}</span><select data-testid={`select-record-${name}`} value={values[name]} onChange={e => change(name, e.target.value)} className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[11px] outline-none focus:border-primary/70">{options.map(o => <option key={o}>{o}</option>)}</select></label>;
  return <div className="fixed inset-0 z-[60] flex items-end justify-center bg-[#1b3030]/45 p-0 backdrop-blur-[2px] sm:items-center sm:p-4" onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
    <form onSubmit={submit} className="max-h-[92dvh] w-full max-w-[540px] overflow-y-auto rounded-t-2xl border border-border bg-card shadow-[0_24px_80px_rgba(20,38,38,.25)] sm:rounded-2xl">
      <div className="flex items-start justify-between border-b border-border px-5 py-4"><div><div className="text-[9px] font-bold uppercase tracking-[.16em] text-primary">{record ? 'UPDATE RECORD' : 'NEW WORKSPACE RECORD'}</div><h2 className="mt-1 text-[17px] font-bold">{tx(record ? 'Edit' : 'New record', language)}</h2></div><button type="button" aria-label="Close form" onClick={onClose} className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><X size={16} /></button></div>
      <div className="grid gap-3.5 p-5 sm:grid-cols-2">{field('title', 'Title', 'text', 'e.g. Prepare morning handoff')}<label className="block"><span className="mb-1.5 block text-[10px] font-semibold text-muted-foreground">{tx('Details', language)}</span><input data-testid="input-record-detail" value={values.detail} onChange={e => change('detail', e.target.value)} placeholder="A short note for the team" className="h-10 w-full rounded-lg border border-border bg-background px-3 text-[11px] outline-none focus:border-primary/70" /></label>{field('assignee', 'Assignee', 'text', 'Team member')}{field('branch', 'Branch', 'text', 'Location')}{field('department', 'Department', 'text', 'Department')}{select('status', 'Status', ['Open', 'In progress', 'Pending', 'Active', 'Complete'])}{select('priority', 'Priority', ['Low', 'Normal', 'High'])}{field('dueDate', 'Due date', 'date')}{field('progress', 'Progress', 'number')}</div>
      {error && <div role="alert" className="mx-5 rounded-lg bg-[#f8e8e2] px-3 py-2 text-[11px] text-[#a75b45]">{error}</div>}
      <div className="flex justify-end gap-2 border-t border-border px-5 py-4"><Button variant="subtle" onClick={onClose}>{tx('Cancel', language)}</Button><Button type="submit" disabled={pending} testId="button-save-record">{pending ? 'Saving…' : tx('Save record', language)}</Button></div>
    </form>
  </div>;
}

function PerformancePanel({ records }: { records: OperationsRecord[] }) {
  const { data: summary } = useGetOperationsSummary();
  const measures = records.length ? records.slice(0, 4) : [];
  return <section className="mb-6 grid gap-5 xl:grid-cols-[1.2fr_1fr]">
    <div className="rounded-xl bg-[#24423f] p-5 text-[#f5f1e8] md:p-6"><div className="flex items-center justify-between"><div><div className="text-[9px] font-bold uppercase tracking-[.16em] text-[#e3bd7d]">NETWORK SCORE</div><h2 className="mt-2 text-[13px] font-semibold text-white/80">KPI achievement</h2></div><Target size={20} className="text-[#e3bd7d]" /></div><div className="mt-5 flex items-end gap-3"><strong className="font-[var(--app-font-serif)] text-[50px] font-extrabold leading-none tracking-[-.06em]">{summary?.kpiAchievement ?? '—'}<span className="text-[22px]">%</span></strong><span className="mb-1 text-[10px] text-white/60">against monthly targets</span></div><div className="mt-5 h-2 overflow-hidden rounded-full bg-white/15"><div className="h-full rounded-full bg-[#e3bd7d]" style={{ width: `${summary?.kpiAchievement ?? 0}%` }} /></div><div className="mt-2 flex justify-between text-[9px] text-white/45"><span>0</span><span>Network target · 90%</span><span>100</span></div></div>
    <div className="rounded-xl border border-border bg-card p-5 md:p-6"><div className="mb-4 flex items-center justify-between"><h3 className="text-[12px] font-bold">Branch indicators</h3><Activity size={16} className="text-primary" /></div>{measures.length ? <div className="space-y-4">{measures.map((r, i) => <div key={r.id}><div className="mb-1.5 flex justify-between text-[10px]"><span className="font-medium">{r.title}</span><span className="font-semibold">{r.progress}%</span></div><div className="h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${r.progress}%`, background: ['#507d69', '#c28a3c', '#6689a0', '#b56c52'][i] }} /></div></div>)}</div> : <p className="text-[11px] text-muted-foreground">Add KPI records to track your measures here.</p>}</div>
  </section>;
}
function TrainingPanel({ records }: { records: OperationsRecord[] }) {
  const completion = records.length ? Math.round(records.reduce((sum, record) => sum + record.progress, 0) / records.length) : 0;
  return <section className="mb-6 grid gap-3 sm:grid-cols-[1.3fr_1fr]">
    <div className="flex items-center gap-5 rounded-xl border border-border bg-[#f0f3eb] p-5"><div className="grid size-12 shrink-0 place-items-center rounded-xl bg-card text-primary shadow-sm"><BookOpenCheck size={21} /></div><div className="flex-1"><div className="text-[10px] font-bold uppercase tracking-[.13em] text-primary">LEARNING SNAPSHOT</div><div className="mt-1 text-[13px] font-bold">Team completion</div><div className="mt-1 text-[10px] text-muted-foreground">{records.length} courses · across all locations</div></div><strong className="font-[var(--app-font-serif)] text-[26px] font-extrabold">{completion}%</strong></div>
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"><div className="grid size-10 place-items-center rounded-lg bg-brass-soft text-brass"><ShieldCheck size={18} /></div><div><div className="text-[12px] font-bold">Compliance training</div><div className="mt-1 text-[10px] text-muted-foreground">{records.filter(r => r.status.toLowerCase().includes('complete')).length} courses fully completed</div></div></div>
  </section>;
}

export function RecordsView({ path }: { path: string }) {
  const { language, search } = useWorkspace();
  return <RecordsPage key={path} path={path} meta={pageMeta[path]} language={language} globalSearch={search} />;
}
