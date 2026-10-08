import type { RecordKind } from '@/lib/api/types';

type SeedRecord = {
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
};

export const demoRecords: SeedRecord[] = [
  { kind: 'task', title: 'Complete opening temperature log', detail: 'Record fridge and freezer temperatures before the morning rush.', status: 'In Progress', assignee: 'Mariam Hassan', branch: 'Zamalek', department: 'Operations', priority: 'High', dueDate: '2026-10-09', progress: 65 },
  { kind: 'task', title: 'Review weekly stock variance', detail: 'Compare physical counts with the inventory report.', status: 'Todo', assignee: 'Omar Nabil', branch: 'Maadi', department: 'Inventory', priority: 'Normal', dueDate: '2026-10-10', progress: 0 },
  { kind: 'task', title: 'Refresh counter service checklist', detail: 'Check the service station and refill take-away supplies.', status: 'Completed', assignee: 'Youssef Adel', branch: 'Heliopolis', department: 'Front of house', priority: 'Low', dueDate: '2026-10-08', progress: 100 },
  { kind: 'task', title: 'Schedule equipment maintenance', detail: 'Confirm a technician visit for the espresso machine.', status: 'Blocked', assignee: 'Nour Samir', branch: 'Zamalek', department: 'Facilities', priority: 'Urgent', dueDate: '2026-10-11', progress: 25 },
  { kind: 'task', title: 'Prepare weekend team rota', detail: 'Balance coverage across lunch and evening shifts.', status: 'Todo', assignee: 'Mariam Hassan', branch: 'Maadi', department: 'People', priority: 'Normal', dueDate: '2026-10-12', progress: 0 },
  { kind: 'request', title: 'Cold room door seal replacement', detail: 'The walk-in cooler is losing temperature overnight.', status: 'In Progress', assignee: 'Facilities', branch: 'Zamalek', department: 'Maintenance', priority: 'Urgent', dueDate: '2026-10-09', progress: 50 },
  { kind: 'request', title: 'Uniform size exchange', detail: 'Exchange two new team uniforms for different sizes.', status: 'Open', assignee: 'HR team', branch: 'Maadi', department: 'People', priority: 'Normal', dueDate: '2026-10-13', progress: 0 },
  { kind: 'request', title: 'Tablet connection issue', detail: 'The register tablet disconnects from the branch network.', status: 'Waiting', assignee: 'IT support', branch: 'Heliopolis', department: 'IT', priority: 'High', dueDate: '2026-10-10', progress: 30 },
  { kind: 'employee', title: 'Mariam Hassan', detail: 'Branch manager · Joined 2023', status: 'Active', assignee: 'Mariam Hassan', branch: 'Zamalek', department: 'Management', priority: 'Normal', dueDate: null, progress: 94 },
  { kind: 'employee', title: 'Omar Nabil', detail: 'Operations lead · Joined 2024', status: 'Active', assignee: 'Omar Nabil', branch: 'Maadi', department: 'Operations', priority: 'Normal', dueDate: null, progress: 82 },
  { kind: 'employee', title: 'Nour Samir', detail: 'Service team · Joined 2025', status: 'Active', assignee: 'Nour Samir', branch: 'Zamalek', department: 'Front of house', priority: 'Normal', dueDate: null, progress: 71 },
  { kind: 'employee', title: 'Youssef Adel', detail: 'Shift supervisor · Joined 2022', status: 'Active', assignee: 'Youssef Adel', branch: 'Heliopolis', department: 'Operations', priority: 'Normal', dueDate: null, progress: 88 },
  { kind: 'branch', title: 'Zamalek', detail: 'Flagship · Cairo', status: 'Healthy', assignee: 'Mariam Hassan', branch: 'Zamalek', department: 'All teams', priority: 'Normal', dueDate: null, progress: 91 },
  { kind: 'branch', title: 'Maadi', detail: 'Garden City · Cairo', status: 'Healthy', assignee: 'Omar Nabil', branch: 'Maadi', department: 'All teams', priority: 'Normal', dueDate: null, progress: 86 },
  { kind: 'branch', title: 'Heliopolis', detail: 'Korba · Cairo', status: 'Attention', assignee: 'Youssef Adel', branch: 'Heliopolis', department: 'All teams', priority: 'High', dueDate: null, progress: 68 },
  { kind: 'training', title: 'Food safety essentials', detail: 'Annual hygiene and safe-handling refresher.', status: 'In Progress', assignee: 'Operations team', branch: 'All branches', department: 'Operations', priority: 'High', dueDate: '2026-10-16', progress: 76 },
  { kind: 'training', title: 'Service standards', detail: 'A practical guide to the Fieldwise guest experience.', status: 'In Progress', assignee: 'Front of house', branch: 'All branches', department: 'Front of house', priority: 'Normal', dueDate: '2026-10-20', progress: 63 },
  { kind: 'sop', title: 'Daily opening procedure', detail: 'A consistent start-of-day routine for every branch.', status: 'Published', assignee: 'Operations team', branch: 'All branches', department: 'Operations', priority: 'Normal', dueDate: null, progress: 92 },
  { kind: 'checklist', title: 'Closing standards', detail: 'Secure the floor, equipment, and cash-up before close.', status: 'Active', assignee: 'Shift leads', branch: 'All branches', department: 'Operations', priority: 'Normal', dueDate: null, progress: 84 },
  { kind: 'kpi', title: 'Guest satisfaction', detail: 'Target: 4.7 / 5 · Monthly', status: 'On Track', assignee: 'Branch managers', branch: 'All branches', department: 'Service', priority: 'Normal', dueDate: null, progress: 89 },
  { kind: 'kpi', title: 'Training completion', detail: 'Target: 90% · Monthly', status: 'At Risk', assignee: 'HR team', branch: 'All branches', department: 'People', priority: 'High', dueDate: null, progress: 76 },
];
