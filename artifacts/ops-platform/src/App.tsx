import { type FormEvent, type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import {
  useCreateOperationsRecord, useDeleteOperationsRecord, useGetOperationsSummary,
  useListOperationsRecords, useUpdateOperationsRecord, getGetOperationsSummaryQueryKey,
  getListOperationsRecordsQueryKey,
} from '@workspace/api-client-react';
import type { OperationsRecord, OperationsRecordInput, RecordKind } from '@workspace/api-client-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  Activity, ArrowDownLeft, ArrowRight, ArrowUpRight, Bell, BookOpenCheck, BriefcaseBusiness,
  Building2, CalendarDays, ChartNoAxesCombined, Check, CheckCircle2, ChevronDown, ChevronRight,
  CircleHelp, Clock3, ClipboardCheck, ClipboardList, Command, FileText, Filter, Globe2,
  LayoutDashboard, ListTodo, Menu, MoreHorizontal, Plus, Search, Settings2, ShieldCheck,
  Sparkles, Target, UsersRound, X, RefreshCw, Pencil, Trash2, type LucideIcon,
} from 'lucide-react';
import { Link, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();
type Language = 'en' | 'ar';
type NavItem = { href: string; label: string; ar: string; icon: LucideIcon };

const navigation: NavItem[] = [
  { href: '/', label: 'Overview', ar: 'نظرة عامة', icon: LayoutDashboard },
  { href: '/tasks', label: 'Tasks', ar: 'المهام', icon: ListTodo },
  { href: '/procedures', label: 'Procedures', ar: 'الإجراءات', icon: FileText },
  { href: '/checklists', label: 'Checklists', ar: 'قوائم التحقق', icon: ClipboardCheck },
  { href: '/employees', label: 'People', ar: 'الفريق', icon: UsersRound },
  { href: '/branches', label: 'Branches', ar: 'الفروع', icon: Building2 },
  { href: '/requests', label: 'Requests', ar: 'الطلبات', icon: ClipboardList },
  { href: '/training', label: 'Training', ar: 'التدريب', icon: BookOpenCheck },
  { href: '/performance', label: 'Performance', ar: 'الأداء', icon: ChartNoAxesCombined },
];
const pageMeta: Record<string, { eyebrow: string; title: string; subtitle: string; kind?: RecordKind }> = {
  '/tasks': { eyebrow: 'WORK MANAGEMENT', title: 'Tasks', subtitle: 'Keep the next shift moving.', kind: 'task' },
  '/employees': { eyebrow: 'YOUR PEOPLE', title: 'People', subtitle: 'The people behind every good shift.', kind: 'employee' },
  '/branches': { eyebrow: 'FIELD LOCATIONS', title: 'Branches', subtitle: 'A clear view across every location.', kind: 'branch' },
  '/requests': { eyebrow: 'SERVICE DESK', title: 'Requests', subtitle: 'Resolve what your team needs next.', kind: 'request' },
  '/training': { eyebrow: 'LEARNING & DEVELOPMENT', title: 'Training', subtitle: 'Build confidence, one module at a time.', kind: 'training' },
  '/performance': { eyebrow: 'FIELD PULSE', title: 'Performance', subtitle: 'See what is working across the operation.', kind: 'kpi' },
  '/procedures': { eyebrow: 'FIELD PLAYBOOK', title: 'Procedures', subtitle: 'One clear standard, wherever the shift happens.', kind: 'sop' },
  '/checklists': { eyebrow: 'SHIFT RHYTHM', title: 'Checklists', subtitle: 'Small checks that keep every location ready.', kind: 'checklist' },
};
const labels: Record<string, [string, string]> = {
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
function tx(en: string, language: Language) { return language === 'ar' ? (labels[en]?.[1] ?? en) : (labels[en]?.[0] ?? en); }
function cx(...classes: Array<string | false | undefined>) { return classes.filter(Boolean).join(' '); }
function recordPath(kind: RecordKind) {
  if (kind === 'task') return '/tasks';
  if (kind === 'employee') return '/employees';
  if (kind === 'branch') return '/branches';
  if (kind === 'request') return '/requests';
  if (kind === 'training') return '/training';
  if (kind === 'kpi') return '/performance';
  if (kind === 'sop') return '/procedures';
  return '/checklists';
}

function Shell() {
  const [path, setLocation] = useLocation();
  const [language, setLanguage] = useState<Language>(() => {
    try { return localStorage.getItem('fieldwise-language') === 'ar' ? 'ar' : 'en'; } catch { return 'en'; }
  });
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const allRecordsQuery = useListOperationsRecords();
  const summaryQuery = useGetOperationsSummary();
  const allRecords = allRecordsQuery.data ?? [];
  const searchResults = search.trim()
    ? allRecords.filter(record => `${record.title} ${record.detail} ${record.assignee} ${record.branch} ${record.department} ${record.kind}`.toLowerCase().includes(search.trim().toLowerCase())).slice(0, 7)
    : [];
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setGlobalSearchOpen(true);
        searchRef.current?.focus();
      }
      if (event.key === 'Escape') {
        setGlobalSearchOpen(false);
        searchRef.current?.blur();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
  const ar = language === 'ar';
  const branchCount = summaryQuery.data?.branches ?? 0;
  const readiness = summaryQuery.data
    ? Math.round((summaryQuery.data.trainingCompletion + summaryQuery.data.kpiAchievement) / 2)
    : 0;
  const setLang = (next: Language) => {
    setLanguage(next);
    try { localStorage.setItem('fieldwise-language', next); } catch { /* preferences are optional */ }
  };
  const active = path === '/' ? '/' : path;
  const meta = pageMeta[active];
  const shellContent = (
    <div dir={ar ? 'rtl' : 'ltr'} className="grain min-h-[100dvh] bg-background text-foreground">
      <aside className={cx('fixed inset-y-0 z-40 flex w-[252px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 max-md:w-[280px]', ar ? 'right-0' : 'left-0', mobileMenu ? 'translate-x-0' : ar ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}>
        <div className="flex h-[82px] items-center gap-3 border-b border-sidebar-border px-6">
          <div className="grid size-10 place-items-center rounded-xl bg-accent text-sidebar font-bold"><Command size={20} /></div>
          <div><div className="font-[var(--app-font-serif)] text-[17px] font-extrabold tracking-[-.04em]">fieldwise</div><div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.18em] text-sidebar-foreground/55">Operations</div></div>
          <button type="button" onClick={() => setMobileMenu(false)} className="ms-auto rounded-md p-2 text-sidebar-foreground/65 md:hidden" aria-label="Close menu"><X size={18} /></button>
        </div>
        <div className="px-4 pt-6">
           <div className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-sidebar-foreground/45">{tx('Workspace', language)}</div>
          <div className="mb-5 flex items-center gap-3 rounded-xl border border-sidebar-border bg-sidebar-accent/60 px-3 py-3">
            <div className="grid size-9 place-items-center rounded-lg bg-[#d6a55a] text-sm font-bold text-[#263b3f]">N</div>
            <div className="min-w-0 flex-1"><div className="truncate text-[13px] font-semibold">Northstar Collective</div><div className="mt-0.5 truncate text-[11px] text-sidebar-foreground/55">Operations workspace</div></div>
            <ChevronDown size={15} className="text-sidebar-foreground/55" />
          </div>
          <nav className="space-y-1" aria-label="Main navigation">
            {navigation.map(({ href, label, ar: arabic, icon: Icon }) => {
              const selected = active === href;
              return <Link key={href} href={href} onClick={() => setMobileMenu(false)} data-testid={`link-nav-${href === '/' ? 'overview' : href.slice(1)}`} className={cx('group flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium transition-colors', selected ? 'bg-[#33534f] text-white shadow-sm' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground')}>
                <Icon size={17} strokeWidth={selected ? 2.3 : 1.8} /><span className="flex-1">{ar ? arabic : label}</span>
                {href === '/requests' && (summaryQuery.data?.requestsOpen ?? 0) > 0 && <span className="rounded-full bg-[#d6a55a] px-2 py-0.5 text-[10px] font-bold text-[#263b3f]">{summaryQuery.data?.requestsOpen}</span>}
              </Link>;
            })}
          </nav>
        </div>
        <div className="mt-auto px-4 pb-5">
          <div className="mb-4 rounded-xl bg-[#263b3f] p-4">
            <div className="mb-2 flex items-center justify-between"><span className="text-[11px] font-semibold text-sidebar-foreground/75">Shift readiness</span><Sparkles size={14} className="text-accent" /></div>
             <div className="text-[22px] font-bold tracking-tight">{summaryQuery.isLoading ? '—' : readiness}<span className="text-sm text-sidebar-foreground/55">%</span></div>
             <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${readiness}%` }} /></div>
             <div className="mt-2 text-[10px] text-sidebar-foreground/50">Across {branchCount} locations</div>
          </div>
          <Link href="/settings" onClick={() => setMobileMenu(false)} data-testid="link-nav-settings" className={cx('flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium', active === '/settings' ? 'bg-[#33534f] text-white' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground')}><Settings2 size={17} />{tx('Settings', language)}</Link>
          <div className="mt-4 flex items-center gap-3 border-t border-sidebar-border px-2 pt-4">
            <div className="grid size-9 place-items-center rounded-full bg-[#476662] text-[11px] font-bold text-white">AM</div>
            <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold">Amira Mansour</div><div className="text-[10px] text-sidebar-foreground/50">Regional manager</div></div>
            <MoreHorizontal size={17} className="text-sidebar-foreground/55" />
          </div>
        </div>
      </aside>
      {mobileMenu && <button type="button" aria-label="Close navigation" onClick={() => setMobileMenu(false)} className="fixed inset-0 z-30 bg-[#16282b]/45 md:hidden" />}
      <div className={cx('min-h-[100dvh] transition-[margin] duration-300', ar ? 'md:mr-[252px]' : 'md:ml-[252px]')}>
        <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-border/80 bg-background/95 px-5 backdrop-blur-md md:px-8">
          <button type="button" onClick={() => setMobileMenu(true)} className="rounded-lg p-2 hover:bg-muted md:hidden" aria-label="Open navigation"><Menu size={20} /></button>
           <div className="relative hidden w-full max-w-[380px] md:block">
            <Search size={16} className={cx('absolute top-1/2 -translate-y-1/2 text-muted-foreground', ar ? 'right-3' : 'left-3')} />
             <input ref={searchRef} data-testid="input-global-search" value={search} onFocus={() => setGlobalSearchOpen(true)} onChange={e => { setSearch(e.target.value); setGlobalSearchOpen(true); }} placeholder={tx('Search anything', language)} className={cx('h-10 w-full rounded-lg border border-border bg-card text-[12px] outline-none transition focus:border-primary/60 focus:ring-2 focus:ring-primary/10', ar ? 'pr-9 pl-12' : 'pl-9 pr-12')} />
            <kbd className={cx('absolute top-1/2 -translate-y-1/2 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground', ar ? 'left-2' : 'right-2')}>⌘ K</kbd>
             {globalSearchOpen && search.trim() && <div role="listbox" aria-label={tx('Jump to a record', language)} className="absolute inset-x-0 top-12 z-50 overflow-hidden rounded-xl border border-border bg-card p-1.5 shadow-[0_16px_42px_rgba(26,40,39,.16)]">
               {allRecordsQuery.isLoading ? <div className="px-3 py-4 text-[11px] text-muted-foreground">Searching workspace…</div> : searchResults.length ? searchResults.map(record => <button type="button" role="option" key={record.id} onClick={() => { setSearch(record.title); setGlobalSearchOpen(false); setLocation(recordPath(record.kind)); searchRef.current?.blur(); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition hover:bg-muted">
                 <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e9eee7] text-[9px] font-bold uppercase text-primary">{record.kind.slice(0, 2)}</span>
                 <span className="min-w-0 flex-1"><span className="block truncate text-[11px] font-semibold">{record.title}</span><span className="mt-0.5 block truncate text-[9px] capitalize text-muted-foreground">{record.kind} · {record.branch || record.department}</span></span>
                 <ArrowRight size={13} className="text-muted-foreground" />
               </button>) : <div className="px-3 py-4 text-[11px] text-muted-foreground">{tx('No results found', language)}</div>}
             </div>}
          </div>
          <div className="ms-auto flex items-center gap-2">
             <button type="button" aria-label={tx('Open search', language)} onClick={() => { setGlobalSearchOpen(true); window.setTimeout(() => document.getElementById('mobile-global-search')?.focus(), 0); }} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted md:hidden"><Search size={17} /></button>
            <button onClick={() => setLang(ar ? 'en' : 'ar')} type="button" data-testid="button-language" className="flex h-9 items-center gap-2 rounded-lg px-2.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"><Globe2 size={15} /><span>{ar ? 'English' : 'العربية'}</span></button>
             <button type="button" onClick={() => setLocation('/requests')} aria-label={`Open requests, ${summaryQuery.data?.requestsOpen ?? 0} open`} className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Bell size={17} />{(summaryQuery.data?.requestsOpen ?? 0) > 0 && <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-[#c57252] px-1 text-[8px] font-bold text-white">{summaryQuery.data?.requestsOpen}</span>}</button>
            <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <div className="grid size-8 place-items-center rounded-full bg-[#dce8df] text-[10px] font-bold text-[#315c4c]">AM</div>
          </div>
           {globalSearchOpen && <div role="dialog" aria-modal="true" aria-label={tx('Jump to a record', language)} className="fixed inset-0 z-[70] bg-background p-4 md:hidden">
             <div className="flex items-center gap-2"><div className="relative flex-1"><Search size={16} className={cx('absolute top-1/2 -translate-y-1/2 text-muted-foreground', ar ? 'right-3' : 'left-3')} /><input id="mobile-global-search" autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder={tx('Search anything', language)} className={cx('h-11 w-full rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/60', ar ? 'pr-10 pl-3' : 'pl-10 pr-3')} /></div><button type="button" aria-label={tx('Close search', language)} onClick={() => setGlobalSearchOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-muted"><X size={18} /></button></div>
             <div role="listbox" className="mt-3 space-y-1">{search.trim() && (allRecordsQuery.isLoading ? <div className="px-3 py-4 text-xs text-muted-foreground">{tx('Searching workspace…', language)}</div> : searchResults.length ? searchResults.map(record => <button type="button" role="option" key={record.id} onClick={() => { setGlobalSearchOpen(false); setLocation(recordPath(record.kind)); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-start hover:bg-muted"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e9eee7] text-[10px] font-bold uppercase text-primary">{record.kind.slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{record.title}</span><span className="mt-1 block truncate text-[10px] capitalize text-muted-foreground">{record.kind} · {record.branch || record.department}</span></span><ArrowRight size={14} className="text-muted-foreground" /></button>) : <div className="px-3 py-4 text-xs text-muted-foreground">{tx('No results found', language)}</div>)}</div>
           </div>}
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-7 md:px-8 md:pt-9">
          <Switch>
            <Route path="/" component={() => <Dashboard language={language} globalSearch={search} />} />
            <Route path="/settings" component={() => <SettingsPage language={language} setLanguage={setLang} branchCount={branchCount} />} />
            {Object.entries(pageMeta).map(([href, data]) => <Route key={href} path={href} component={() => <RecordsPage path={href} meta={data} language={language} globalSearch={search} />} />)}
            <Route component={NotFound} />
          </Switch>
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-5 text-[10px] text-muted-foreground"><span>Fieldwise Operations · Northstar Collective</span><span>Built for the people who keep things moving.</span></footer>
        </main>
      </div>
    </div>
  );
  return <RoutedErrorBoundary>{shellContent}</RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function PageTitle({ eyebrow, title, subtitle, action, language }: { eyebrow: string; title: string; subtitle: string; action?: ReactNode; language: Language }) {
  return <div className="mb-8 flex flex-wrap items-end justify-between gap-4 page-enter"><div><div className="mb-2 text-[10px] font-bold tracking-[.18em] text-primary">{tx(eyebrow, language)}</div><h1 className="font-[var(--app-font-serif)] text-[34px] font-extrabold leading-none tracking-[-.05em] md:text-[40px]">{tx(title, language)}</h1><p className="mt-3 text-[13px] text-muted-foreground">{tx(subtitle, language)}</p></div>{action}</div>;
}
function Button({ children, onClick, variant = 'primary', testId, type = 'button', disabled = false }: { children: ReactNode; onClick?: () => void; variant?: 'primary' | 'subtle' | 'outline'; testId?: string; type?: 'button' | 'submit'; disabled?: boolean }) {
  return <button type={type} onClick={onClick} disabled={disabled} data-testid={testId} className={cx('inline-flex h-10 items-center justify-center gap-2 rounded-lg px-4 text-[12px] font-semibold transition duration-150 disabled:cursor-not-allowed disabled:opacity-50', variant === 'primary' ? 'bg-primary text-primary-foreground shadow-sm hover:brightness-95' : variant === 'outline' ? 'border border-border bg-card text-foreground hover:bg-muted' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>{children}</button>;
}
function MetricCard({ label, value, note, icon: Icon, accent, progress }: { label: string; value: string | number; note?: string; icon: LucideIcon; accent: string; progress?: number }) {
  return <article className="rounded-xl border border-border/90 bg-card p-4 shadow-[0_2px_8px_rgba(35,51,54,.025)] md:p-5" data-testid={`metric-${label.toLowerCase().replaceAll(' ', '-')}`}>
    <div className="flex items-center justify-between"><span className="text-[11px] font-medium text-muted-foreground">{label}</span><div className="grid size-8 place-items-center rounded-lg" style={{ backgroundColor: `${accent}18`, color: accent }}><Icon size={16} /></div></div>
     <div className="mt-4 flex items-end justify-between"><strong className="font-[var(--app-font-serif)] text-[30px] font-extrabold leading-none tracking-[-.05em]">{value}</strong>{note && <span className="mb-0.5 text-[10px] font-medium text-muted-foreground">{note}</span>}</div>
    {progress !== undefined && <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full" style={{ width: `${Math.min(100, progress)}%`, backgroundColor: accent }} /></div>}
  </article>;
}
function Skeleton({ rows = 3 }: { rows?: number }) {
  return <div className="space-y-3" aria-label="Loading records">{Array.from({ length: rows }).map((_, i) => <div key={i} className="flex animate-pulse items-center gap-4 rounded-xl border border-border bg-card p-4"><div className="size-9 rounded-lg bg-muted" /><div className="flex-1 space-y-2"><div className="h-3 w-1/3 rounded bg-muted" /><div className="h-2.5 w-1/2 rounded bg-muted" /></div><div className="h-6 w-16 rounded-full bg-muted" /></div>)}</div>;
}
function QueryError({ retry }: { retry: () => void }) {
  return <div className="rounded-xl border border-[#e8c5b9] bg-[#fff8f4] p-6 text-center"><div className="mx-auto grid size-10 place-items-center rounded-full bg-[#f7e5dd] text-[#a65c43]"><CircleHelp size={19} /></div><h3 className="mt-3 text-sm font-bold">Could not load workspace data</h3><p className="mt-1 text-xs text-muted-foreground">Please try again. Your work is still here.</p><Button variant="outline" onClick={retry}><RefreshCw size={14} />Retry</Button></div>;
}
function EmptyState({ action, language, search = false }: { action?: () => void; language: Language; search?: boolean }) {
  return <div className="rounded-xl border border-dashed border-border bg-card/60 px-6 py-12 text-center"><div className="mx-auto grid size-12 place-items-center rounded-2xl bg-[#e9eee7] text-primary">{search ? <Search size={21} /> : <ClipboardCheck size={21} />}</div><h3 className="mt-4 text-sm font-bold">{tx(search ? 'Nothing matches your search' : 'No records yet', language)}</h3><p className="mx-auto mt-1 max-w-xs text-xs leading-5 text-muted-foreground">{tx(search ? 'Try a different search or clear the current filter.' : 'Create your first record to get this workspace moving.', language)}</p>{action && !search && <div className="mt-5"><Button onClick={action}><Plus size={15} />{tx('Add record', language)}</Button></div>}</div>;
}
function statusTone(status: string) {
  const value = status.toLowerCase();
  if (value.includes('complete') || value.includes('active') || value.includes('approved') || value.includes('on track')) return 'bg-[#e6f1e9] text-[#3d7453]';
  if (value.includes('progress') || value.includes('review') || value.includes('pending') || value.includes('scheduled')) return 'bg-[#f8efd9] text-[#95712e]';
  if (value.includes('block') || value.includes('urgent') || value.includes('overdue') || value.includes('declined')) return 'bg-[#f8e8e2] text-[#a75b45]';
  return 'bg-muted text-muted-foreground';
}
function RecordStatus({ status }: { status: string }) { return <span className={cx('inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize', statusTone(status))}>{status || 'Open'}</span>; }

function useRefreshData() {
  const qc = useQueryClient();
  return () => {
    qc.invalidateQueries({ queryKey: getListOperationsRecordsQueryKey() });
    qc.invalidateQueries({ queryKey: getGetOperationsSummaryQueryKey() });
  };
}
function Dashboard({ language, globalSearch }: { language: Language; globalSearch: string }) {
  const { data: summary, isLoading, isError, refetch } = useGetOperationsSummary();
  const { data: records, isLoading: recordsLoading, isError: recordsError, refetch: retryRecords } = useListOperationsRecords();
  const [, setLocation] = useLocation();
  const hour = Number(new Intl.DateTimeFormat('en-US', { hour: '2-digit', hourCycle: 'h23', timeZone: 'Africa/Cairo' }).format(new Date()));
  const salutation = hour < 12 ? 'Good morning' : 'Good afternoon';
  const today = new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Africa/Cairo' }).format(new Date());
  const latest = (summary?.recentActivity ?? []).filter(r => `${r.title} ${r.detail} ${r.assignee} ${r.branch}`.toLowerCase().includes(globalSearch.toLowerCase())).slice(0, 5);
  const dueSoon = (records ?? [])
    .filter(record => record.dueDate && !['complete', 'completed', 'cancelled', 'canceled'].includes(record.status.toLowerCase()))
    .sort((left, right) => (left.dueDate ?? '').localeCompare(right.dueDate ?? ''))
    .slice(0, 4);
  return <>
     <PageTitle eyebrow={`${today} · ${tx('Field operations', language)}`} title={`${tx(salutation, language)}, Amira`} subtitle="Here’s the pulse of your operation today." language={language} action={<Button onClick={() => setLocation('/tasks')}><Plus size={15} />{tx('Add record', language)}</Button>} />
    <section className="mb-7 overflow-hidden rounded-2xl bg-[#24423f] text-[#f5f1e8] shadow-[0_9px_28px_rgba(32,59,55,.12)]">
      <div className="relative flex flex-col justify-between gap-6 p-6 md:flex-row md:items-center md:px-8 md:py-7">
        <div className="pointer-events-none absolute -right-7 -top-16 size-64 rounded-full border border-white/10" /><div className="pointer-events-none absolute -right-1 top-2 size-40 rounded-full border border-white/10" />
         <div className="relative"><div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.18em] text-[#e3bd7d]"><span className="size-1.5 rounded-full bg-[#e3bd7d]" />Live operations brief</div><h2 className="font-[var(--app-font-serif)] text-[23px] font-bold tracking-[-.035em] md:text-[27px]">{tx('A steady start across the network.', language)}</h2><p className="mt-2 max-w-lg text-[12px] leading-5 text-[#f5f1e8]/65">{tx('Your teams are making progress. Use the live indicators below to see where support is needed.', language)}</p></div>
        <button onClick={() => setLocation('/performance')} className="relative inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#e3bd7d] px-4 text-xs font-bold text-[#203c39] hover:bg-[#edca91]">View field report<ArrowRight size={15} /></button>
      </div>
    </section>
    <div className="mb-3 flex items-center justify-between"><h2 className="text-[12px] font-bold">{tx('Today at a glance', language)}</h2><button onClick={() => setLocation('/performance')} className="text-[10px] font-semibold text-primary hover:underline">View reports <ArrowRight size={12} className="inline" /></button></div>
    {isLoading ? <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-[126px] animate-pulse rounded-xl border border-border bg-card" />)}</div> : isError || !summary ? <QueryError retry={() => refetch()} /> : <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
       <MetricCard label={tx('Team members', language)} value={summary.employees} note={tx('Active roster', language)} icon={UsersRound} accent="#507d69" />
       <MetricCard label={tx('Open tasks', language)} value={summary.tasksOpen} note={tx('Across all branches', language)} icon={ListTodo} accent="#c28a3c" />
       <MetricCard label={tx('Open requests', language)} value={summary.requestsOpen} note={tx('Current queue', language)} icon={ClipboardList} accent="#b56c52" />
       <MetricCard label={tx('Training completion', language)} value={`${summary.trainingCompletion}%`} note={tx('Team average', language)} icon={BookOpenCheck} accent="#6689a0" progress={summary.trainingCompletion} />
    </div>}
    <div className="mt-7 grid gap-5 xl:grid-cols-[1.45fr_1fr]">
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-[13px] font-bold">{tx('Recent activity', language)}</h2><p className="mt-1 text-[10px] text-muted-foreground">The latest movement across your teams</p></div><button onClick={() => setLocation('/tasks')} className="rounded-lg border border-border px-3 py-1.5 text-[10px] font-semibold hover:bg-muted">View all</button></div>
        {recordsLoading ? <Skeleton rows={4} /> : recordsError ? <QueryError retry={() => retryRecords()} /> : latest.length ? <div className="divide-y divide-border/70">{latest.map((record, i) => <ActivityRow key={record.id} record={record} index={i} />)}</div> : <EmptyState language={language} search={!!globalSearch} />}
      </section>
      <section className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between"><div><h2 className="text-[13px] font-bold">{tx('Due soon', language)}</h2><p className="mt-1 text-[10px] text-muted-foreground">Keep an eye on the next handoff</p></div><CalendarDays size={17} className="text-muted-foreground" /></div>
        {recordsLoading ? <Skeleton rows={3} /> : recordsError ? <QueryError retry={() => retryRecords()} /> : dueSoon.length ? <div className="space-y-2.5">{dueSoon.map(r => <div key={r.id} className="flex items-center gap-3 rounded-lg bg-background px-3 py-3"><div className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#f6ead5] text-[#9d7235]"><Clock3 size={15} /></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{r.title}</div><div className="mt-1 text-[10px] text-muted-foreground">{r.branch || 'Unassigned branch'} · {r.dueDate}</div></div><span className="size-2 rounded-full" style={{ backgroundColor: r.priority.toLowerCase() === 'high' ? '#c76c4c' : '#c5a250' }} /></div>)}</div> : <EmptyState language={language} action={() => setLocation('/tasks')} />}
      </section>
    </div>
    {!isLoading && summary && <section className="mt-5 grid gap-4 rounded-xl border border-border bg-card p-5 md:grid-cols-[1fr_auto] md:items-center md:px-6"><div><div className="flex items-center gap-2 text-[12px] font-bold"><Target size={16} className="text-primary" />Performance pulse</div><p className="mt-1 text-[10px] text-muted-foreground">Target achievement across active branch KPIs</p></div><div className="flex items-center gap-3"><div className="h-2 w-40 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-[#588a71]" style={{ width: `${summary.kpiAchievement}%` }} /></div><strong className="text-sm">{summary.kpiAchievement}%</strong><ArrowUpRight size={15} className="text-primary" /></div></section>}
  </>;
}
function ActivityRow({ record, index }: { record: OperationsRecord; index: number }) {
  const Icon = record.kind === 'request' ? ArrowDownLeft : record.kind === 'employee' ? UsersRound : record.kind === 'training' ? BookOpenCheck : ClipboardCheck;
  const colors = ['#e9eee7', '#f6ead5', '#f5e8e2', '#e5edf0', '#ede8f2'];
  return <div className="flex items-center gap-3 py-3.5" data-testid={`activity-record-${record.id}`}><div className="grid size-9 shrink-0 place-items-center rounded-lg" style={{ color: ['#507d69', '#a67b38', '#ac684f', '#577f91', '#776a8c'][index % 5], backgroundColor: colors[index % 5] }}><Icon size={16} /></div><div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{record.title}</div><div className="mt-1 truncate text-[10px] text-muted-foreground">{record.assignee || record.department || 'Operations'}{record.branch ? ` · ${record.branch}` : ''}</div></div><div className="hidden text-right sm:block"><RecordStatus status={record.status} /><div className="mt-1.5 text-[9px] text-muted-foreground">{record.createdAt?.slice(0, 10)}</div></div><ChevronRight size={15} className="text-muted-foreground/70" /></div>;
}

function RecordsPage({ path, meta, language, globalSearch }: { path: string; meta: typeof pageMeta[string]; language: Language; globalSearch: string }) {
  const [localSearch, setLocalSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [editing, setEditing] = useState<OperationsRecord | null>(null);
  const [filter, setFilter] = useState('All');
  const query = useListOperationsRecords(meta.kind ? { kind: meta.kind } : undefined);
  const records = query.data ?? [];
  const searchValue = `${localSearch} ${globalSearch}`.trim().toLowerCase();
  const filtered = useMemo(() => records.filter(r => {
    const matches = !searchValue || `${r.title} ${r.detail} ${r.assignee} ${r.branch} ${r.department} ${r.status}`.toLowerCase().includes(searchValue);
    const filterMatches = filter === 'All' || r.status.toLowerCase().includes(filter.toLowerCase());
    return matches && filterMatches;
  }), [records, searchValue, filter]);
  const create = () => setShowCreate(true);
  return <>
    <PageTitle eyebrow={meta.eyebrow} title={meta.title} subtitle={meta.subtitle} language={language} action={<Button onClick={create} testId="button-create-record"><Plus size={15} />{tx('Add record', language)}</Button>} />
    {path === '/tasks' && <div className="mb-6 grid gap-3 sm:grid-cols-3"><QuickStat label="In progress" value={records.filter(r => r.status.toLowerCase().includes('progress')).length} color="#c28a3c" /><QuickStat label="Completed" value={records.filter(r => r.status.toLowerCase().includes('complete')).length} color="#507d69" /><QuickStat label="High priority" value={records.filter(r => r.priority.toLowerCase() === 'high').length} color="#b56c52" /></div>}
     {path === '/branches' && <div className="mb-6 grid gap-3 sm:grid-cols-3"><QuickStat label="Active locations" value={records.length} color="#507d69" /><QuickStat label="Avg. readiness" value={records.length ? `${Math.round(records.reduce((sum, record) => sum + record.progress, 0) / records.length)}%` : '—'} color="#c28a3c" /><QuickStat label="Needs attention" value={records.filter(r => r.status.toLowerCase().includes('attention')).length} color="#b56c52" /></div>}
    {path === '/performance' && <PerformancePanel records={records} />}
    {path === '/training' && <TrainingPanel records={records} />}
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
  const isPeople = path === '/employees';
  const isBranch = path === '/branches';
  const isKpi = path === '/performance';
  const isTraining = path === '/training';
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
  const isPeople = path === '/employees';
  const isBranch = path === '/branches';
  const identity = isPeople ? record.title.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() : null;
  const advanceStatus = () => {
    const next = record.status.toLowerCase().includes('complete') ? 'In progress' : 'Complete';
    update.mutate({ id: record.id, data: { status: next, progress: next === 'Complete' ? 100 : Math.max(25, record.progress) } }, { onSuccess: refresh });
  };
  const deleteRecord = () => {
    if (window.confirm(`Delete “${record.title}”? This cannot be undone.`)) remove.mutate({ id: record.id }, { onSuccess: refresh });
  };
  return <div className="grid gap-3 px-4 py-4 transition-colors hover:bg-background/80 md:grid-cols-[minmax(200px,1.6fr)_minmax(110px,1fr)_minmax(110px,1fr)_100px_80px] md:items-center md:gap-4 md:px-5" data-testid={`row-record-${record.id}`}>
    <div className="flex min-w-0 items-center gap-3">{identity ? <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#e6eee7] text-[10px] font-bold text-[#507d69]">{identity}</div> : <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#edf0e9] text-primary">{isBranch ? <Building2 size={16} /> : path === '/requests' ? <ClipboardList size={16} /> : path === '/training' ? <BookOpenCheck size={16} /> : <FileText size={16} />}</div>}<div className="min-w-0 flex-1"><div className="truncate text-[11px] font-semibold">{record.title}</div><div className="mt-1 truncate text-[10px] text-muted-foreground">{record.detail || record.department || 'No additional details'}</div></div><div className="flex md:hidden"><RecordStatus status={record.status} /></div></div>
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
    <div className="flex items-center gap-4 rounded-xl border border-border bg-card p-5"><div className="grid size-10 place-items-center rounded-lg bg-[#f6ead5] text-[#a67b38]"><ShieldCheck size={18} /></div><div><div className="text-[12px] font-bold">Compliance training</div><div className="mt-1 text-[10px] text-muted-foreground">{records.filter(r => r.status.toLowerCase().includes('complete')).length} courses fully completed</div></div></div>
  </section>;
}
function SettingsPage({ language, setLanguage, branchCount }: { language: Language; setLanguage: (language: Language) => void; branchCount: number }) {
  const [saved, setSaved] = useState(false);
  const [weekStart, setWeekStart] = useState<'Monday' | 'Sunday' | 'Saturday'>(() => {
    try {
      const savedValue = localStorage.getItem('fieldwise-week-start');
      return savedValue === 'Sunday' || savedValue === 'Saturday' ? savedValue : 'Monday';
    } catch { return 'Monday'; }
  });
  const toggleLanguage = (next: Language) => { setLanguage(next); setSaved(true); window.setTimeout(() => setSaved(false), 2200); };
  const updateWeekStart = (next: 'Monday' | 'Sunday' | 'Saturday') => {
    setWeekStart(next);
    try { localStorage.setItem('fieldwise-week-start', next); } catch { /* preferences are optional */ }
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2200);
  };
  return <>
    <PageTitle eyebrow="YOUR WORKSPACE" title="Settings" subtitle="Make Fieldwise work the way your team does." language={language} />
    <div className="grid gap-5">
      <div className="space-y-5">
        <section className="rounded-xl border border-border bg-card">
          <div className="border-b border-border px-5 py-4"><h2 className="text-[13px] font-bold">Workspace preferences</h2><p className="mt-1 text-[10px] text-muted-foreground">Set up the shared workspace for your locations.</p></div>
          <div className="divide-y divide-border/70">
            <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-[#e9eee7] text-primary"><Globe2 size={16} /></div><div><div className="text-[11px] font-semibold">{tx('Display language', language)}</div><div className="mt-1 text-[10px] text-muted-foreground">{tx('Arabic automatically switches the workspace to right-to-left.', language)}</div></div></div><div className="flex rounded-lg border border-border p-1"><button onClick={() => toggleLanguage('en')} data-testid="button-set-english" className={cx('rounded-md px-3 py-1.5 text-[10px] font-semibold', language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>English</button><button onClick={() => toggleLanguage('ar')} data-testid="button-set-arabic" className={cx('rounded-md px-3 py-1.5 text-[10px] font-semibold', language === 'ar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted')}>العربية</button></div></div>
             <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-[#f6ead5] text-[#a67b38]"><Building2 size={16} /></div><div><div className="text-[11px] font-semibold">Organization</div><div className="mt-1 text-[10px] text-muted-foreground">Northstar Collective · {branchCount} active branches</div></div></div><span className="rounded-full bg-[#e6f1e9] px-2.5 py-1 text-[9px] font-semibold text-[#3d7453]">Active workspace</span></div>
             <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-5"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-[#e7edf0] text-[#577f91]"><CalendarDays size={16} /></div><div><div className="text-[11px] font-semibold">{tx('Week starts on', language)}</div><div className="mt-1 text-[10px] text-muted-foreground">{tx('Choose the first day of the week.', language)}</div></div></div><select aria-label="First day of the week" value={weekStart} onChange={event => updateWeekStart(event.target.value as typeof weekStart)} className="h-9 rounded-lg border border-border bg-background px-3 text-[10px]"><option>Monday</option><option>Sunday</option><option>Saturday</option></select></div>
          </div>
           {saved && <div role="status" className="border-t border-border bg-[#eaf2e9] px-5 py-2.5 text-[10px] font-semibold text-[#47745b]"><CheckCircle2 size={13} className="mr-1 inline" />{tx('Preference saved', language)}</div>}
        </section>
        <section className="rounded-xl border border-border bg-card p-5"><div className="flex items-center gap-3"><div className="grid size-9 place-items-center rounded-lg bg-muted text-muted-foreground"><BriefcaseBusiness size={16} /></div><div><h2 className="text-[12px] font-bold">{tx('Your workspace, at a glance', language)}</h2><p className="mt-1 text-[10px] text-muted-foreground">{tx('A shared operating view for managers coordinating teams, process, and performance.', language)}</p></div></div></section>
      </div>
    </div>
  </>;
}

function Router() { return <Shell />; }
function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}
export default App;
