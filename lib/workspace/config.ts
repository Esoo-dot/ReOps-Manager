import { BookOpenCheck, Building2, ChartNoAxesCombined, ClipboardCheck, ClipboardList, FileText, LayoutDashboard, ListTodo, UsersRound, type LucideIcon } from 'lucide-react';
import type { RecordKind } from '@/lib/api/types';

export type Language = 'en' | 'ar';
export type NavItem = { href: string; label: string; ar: string; icon: LucideIcon };

export const navigation: NavItem[] = [
  { href: '/app', label: 'Overview', ar: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/app/tasks', label: 'Tasks', ar: 'المهام', icon: ListTodo },
  { href: '/app/procedures', label: 'Procedures', ar: 'الإجراءات', icon: FileText },
  { href: '/app/checklists', label: 'Checklists', ar: 'قوائم التحقق', icon: ClipboardCheck },
  { href: '/app/employees', label: 'People', ar: 'الفريق', icon: UsersRound },
  { href: '/app/branches', label: 'Branches', ar: 'الفروع', icon: Building2 },
  { href: '/app/requests', label: 'Requests', ar: 'الطلبات', icon: ClipboardList },
  { href: '/app/training', label: 'Training', ar: 'التدريب', icon: BookOpenCheck },
  { href: '/app/performance', label: 'Performance', ar: 'الأداء', icon: ChartNoAxesCombined },
];
export const pageMeta: Record<string, { eyebrow: string; title: string; subtitle: string; kind?: RecordKind }> = {
  '/app/tasks': { eyebrow: 'WORK MANAGEMENT', title: 'Tasks', subtitle: 'Keep the next shift moving.', kind: 'task' },
  '/app/employees': { eyebrow: 'YOUR PEOPLE', title: 'People', subtitle: 'The people behind every good shift.', kind: 'employee' },
  '/app/branches': { eyebrow: 'FIELD LOCATIONS', title: 'Branches', subtitle: 'A clear view across every location.', kind: 'branch' },
  '/app/requests': { eyebrow: 'SERVICE DESK', title: 'Requests', subtitle: 'Resolve what your team needs next.', kind: 'request' },
  '/app/training': { eyebrow: 'LEARNING & DEVELOPMENT', title: 'Training', subtitle: 'Build confidence, one module at a time.', kind: 'training' },
  '/app/performance': { eyebrow: 'FIELD PULSE', title: 'Performance', subtitle: 'See what is working across the operation.', kind: 'kpi' },
  '/app/procedures': { eyebrow: 'FIELD PLAYBOOK', title: 'Procedures', subtitle: 'One clear standard, wherever the shift happens.', kind: 'sop' },
  '/app/checklists': { eyebrow: 'SHIFT RHYTHM', title: 'Checklists', subtitle: 'Small checks that keep every location ready.', kind: 'checklist' },
};
export const labels: Record<string, [string, string]> = {
  'Overview': ['Overview', 'نظرة عامة'], 'Tasks': ['Tasks', 'المهام'], 'People': ['People', 'الفريق'],
  'Branches': ['Branches', 'الفروع'], 'Requests': ['Requests', 'الطلبات'], 'Training': ['Training', 'التدريب'],
  'Performance': ['Performance', 'الأداء'], 'Settings': ['Settings', 'الإعدادات'],
  'Procedures': ['Procedures', 'الإجراءات'], 'Checklists': ['Checklists', 'قوائم التحقق'],
  'Good morning': ['Good morning', 'صباح الخير'], 'Good afternoon': ['Good afternoon', 'مساء الخير'],
  'Workspace': ['Workspace', 'مساحة العمل'], 'Add record': ['Add record', 'إضافة سجل'],
  'Search anything': ['Search anything', 'ابحث هنا'], 'All branches': ['All branches', 'كل الفروع'],
  'Today at a glance': ['Today at a glance', 'لمحة اليوم'], 'Open tasks': ['Open tasks', 'المهام المفتوحة'],
  'Open requests': ['Open requests', 'الطلبات المفتوحة'], 'Training completion': ['Training completion', 'إتمام التدريب'],
  'KPI achievement': ['KPI achievement', 'تحقيق المؤشرات'], 'Recent activity': ['Recent activity', 'النشاط الأخير'],
  'Due soon': ['Due soon', 'مستحقة قريباً'], 'No records yet': ['No records yet', 'لا توجد سجلات بعد'],
  'Create your first record to get this workspace moving.': ['Create your first record to get this workspace moving.', 'أنشئ أول سجل لبدء العمل في مساحة الفريق.'],
  'New record': ['New record', 'سجل جديد'], 'Title': ['Title', 'العنوان'], 'Details': ['Details', 'التفاصيل'],
  'Assignee': ['Assignee', 'المسؤول'], 'Branch': ['Branch', 'الفرع'], 'Department': ['Department', 'القسم'],
  'Status': ['Status', 'الحالة'], 'Priority': ['Priority', 'الأولوية'], 'Due date': ['Due date', 'تاريخ الاستحقاق'],
  'Save record': ['Save record', 'حفظ السجل'], 'Cancel': ['Cancel', 'إلغاء'], 'Edit': ['Edit', 'تعديل'],
  'Delete': ['Delete', 'حذف'], 'Search records': ['Search records', 'البحث في السجلات'],
  'Nothing matches your search': ['Nothing matches your search', 'لا توجد نتائج مطابقة'],
  'Try a different search or clear the current filter.': ['Try a different search or clear the current filter.', 'جرّب كلمة بحث أخرى أو أزل التصفية الحالية.'],
  'Team members': ['Team members', 'أعضاء الفريق'], 'Active roster': ['Active roster', 'الفريق النشط'],
  'Across all branches': ['Across all branches', 'في جميع الفروع'], 'Current queue': ['Current queue', 'قائمة الطلبات الحالية'],
  'Team average': ['Team average', 'متوسط الفريق'], 'Field operations': ['Field operations', 'العمليات الميدانية'],
  'Here’s the pulse of your operation today.': ['Here’s the pulse of your operation today.', 'إليك ملخص عملياتك اليوم.'],
  'A steady start across the network.': ['A steady start across the network.', 'بداية مستقرة عبر الفروع.'],
  'Your teams are making progress. Use the live indicators below to see where support is needed.': ['Your teams are making progress. Use the live indicators below to see where support is needed.', 'تتقدم الفرق بشكل جيد. راجع المؤشرات أدناه لمعرفة الفروع التي تحتاج إلى دعم.'],
  'Could not load workspace data': ['Could not load workspace data', 'تعذّر تحميل بيانات مساحة العمل'],
  'Please try again. Your work is still here.': ['Please try again. Your work is still here.', 'حاول مرة أخرى. بياناتك ما زالت محفوظة.'],
  'In Progress': ['In Progress', 'قيد التنفيذ'], 'Complete': ['Complete', 'مكتمل'],
  'No results found': ['No results found', 'لم يتم العثور على نتائج'],
  'Jump to a record': ['Jump to a record', 'انتقل إلى سجل'],
  'Keep the next shift moving.': ['Keep the next shift moving.', 'حافظ على استمرارية الوردية القادمة.'],
  'The people behind every good shift.': ['The people behind every good shift.', 'الأشخاص الذين يصنعون نجاح كل وردية.'],
  'A clear view across every location.': ['A clear view across every location.', 'رؤية واضحة لكل موقع.'],
  'Resolve what your team needs next.': ['Resolve what your team needs next.', 'تابع احتياجات فريقك القادمة.'],
  'Build confidence, one module at a time.': ['Build confidence, one module at a time.', 'عزّز الخبرة خطوة بخطوة.'],
  'See what is working across the operation.': ['See what is working across the operation.', 'تابع ما ينجح في عملياتك.'],
  'One clear standard, wherever the shift happens.': ['One clear standard, wherever the shift happens.', 'معيار واضح وموحّد في كل وردية.'],
  'Small checks that keep every location ready.': ['Small checks that keep every location ready.', 'تحققات بسيطة تحافظ على جاهزية كل موقع.'],
  'Make Fieldwise work the way your team does.': ['Make Fieldwise work the way your team does.', 'خصص فيلدوايز بما يناسب طريقة عمل فريقك.'],
  'A shared operating view for managers coordinating teams, process, and performance.': ['A shared operating view for managers coordinating teams, process, and performance.', 'مساحة موحدة للمديرين لتنسيق الفرق والإجراءات والأداء.'],
  'Shift readiness': ['Shift readiness', 'جاهزية الوردية'],
  'Live operations brief': ['Live operations brief', 'ملخص العمليات المباشر'],
  'View field report': ['View field report', 'عرض تقرير العمليات'],
  'View reports': ['View reports', 'عرض التقارير'],
  'Workspace preferences': ['Workspace preferences', 'تفضيلات مساحة العمل'],
  'Set up the shared workspace for your locations.': ['Set up the shared workspace for your locations.', 'إعداد مساحة العمل المشتركة لمواقعك.'],
  'Display language': ['Display language', 'لغة العرض'],
  'Arabic automatically switches the workspace to right-to-left.': ['Arabic automatically switches the workspace to right-to-left.', 'يؤدي اختيار العربية إلى تحويل مساحة العمل إلى الاتجاه من اليمين إلى اليسار.'],
  'Organization': ['Organization', 'المؤسسة'],
  'Active workspace': ['Active workspace', 'مساحة عمل نشطة'],
  'Week starts on': ['Week starts on', 'بداية الأسبوع'],
  'Choose the first day of the week.': ['Choose the first day of the week.', 'اختر أول يوم في الأسبوع.'],
  'Preference saved': ['Preference saved', 'تم حفظ التفضيل'],
  'Your workspace, at a glance': ['Your workspace, at a glance', 'مساحة عملك في لمحة'],
  'Open search': ['Open search', 'فتح البحث'],
  'Close search': ['Close search', 'إغلاق البحث'],
  'Searching workspace…': ['Searching workspace…', 'جارٍ البحث في مساحة العمل…'],
};
export function tx(en: string, language: Language) { return language === 'ar' ? (labels[en]?.[1] ?? en) : (labels[en]?.[0] ?? en); }
export function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(' '); }
export function recordPath(kind: RecordKind) {
  if (kind === 'task') return '/app/tasks';
  if (kind === 'employee') return '/app/employees';
  if (kind === 'branch') return '/app/branches';
  if (kind === 'request') return '/app/requests';
  if (kind === 'training') return '/app/training';
  if (kind === 'kpi') return '/app/performance';
  if (kind === 'sop') return '/app/procedures';
  return '/app/checklists';
}
