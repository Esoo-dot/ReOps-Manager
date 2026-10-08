export const RECORD_KINDS = ['task', 'request', 'employee', 'branch', 'training', 'sop', 'checklist', 'kpi'] as const;

export type RecordKind = (typeof RECORD_KINDS)[number];

export interface OperationsRecord {
  id: number;
  kind: RecordKind;
  title: string;
  detail: string;
  status: string;
  assignee: string;
  branch: string;
  department: string;
  priority: string;
  dueDate: string | null;
  progress: number;
  createdAt: string;
}

export interface OperationsRecordInput {
  kind: RecordKind;
  title: string;
  detail?: string;
  status?: string;
  assignee?: string;
  branch?: string;
  department?: string;
  priority?: string;
  dueDate?: string | null;
  progress?: number;
}

export type OperationsRecordUpdate = Partial<Omit<OperationsRecordInput, 'kind'>>;

export interface OperationsSummary {
  employees: number;
  branches: number;
  tasksOpen: number;
  requestsOpen: number;
  trainingCompletion: number;
  kpiAchievement: number;
  recentActivity: OperationsRecord[];
}

export type ListOperationsRecordsParams = { kind?: RecordKind };
