'use client';

import { type ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ErrorBoundary } from '@/components/error-boundary';
import { usePreferences } from '@/components/preferences-provider';
import { WorkspaceContext } from '@/components/workspace/workspace-context';
import { tx, cx, recordPath, navigation, pageMeta } from '@/lib/workspace/config';
import { useGetOperationsSummary, useListOperationsRecords } from '@/lib/api/hooks';
import { ArrowRight, Bell, ChevronDown, Command, Globe2, Menu, MoreHorizontal, Search, Settings2, Sparkles, X, Sun, Moon } from 'lucide-react';

export function Shell({ children }: { children: ReactNode }) {
  const { dark, toggleTheme: onToggleTheme, language, setLanguage } = usePreferences();
  const path = usePathname();
  const { push: setLocation } = useRouter();
  const [search, setSearch] = useState('');
  const [mobileMenu, setMobileMenu] = useState(false);
  const [globalSearchOpen, setGlobalSearchOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!mobileMenu) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setMobileMenu(false); };
    window.addEventListener('keydown', closeOnEscape);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', closeOnEscape); };
  }, [mobileMenu]);
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
  const setLang = setLanguage;
  const active = path;
  const meta = pageMeta[active];
  const shellContent = (
    <div dir={ar ? 'rtl' : 'ltr'} className="grain min-h-[100dvh] bg-background text-foreground">
      <aside id="workspace-drawer" aria-label={ar ? 'التنقل في مساحة العمل' : 'Workspace navigation'} aria-modal={mobileMenu ? true : undefined} role={mobileMenu ? 'dialog' : undefined} className={cx('fixed inset-y-0 z-40 flex w-[252px] flex-col bg-sidebar text-sidebar-foreground transition-transform duration-300 max-md:w-[280px]', ar ? 'right-0' : 'left-0', mobileMenu ? 'translate-x-0' : ar ? 'translate-x-full md:translate-x-0' : '-translate-x-full md:translate-x-0')}>
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
                {href === '/app/requests' && (summaryQuery.data?.requestsOpen ?? 0) > 0 && <span className="rounded-full bg-[#d6a55a] px-2 py-0.5 text-[10px] font-bold text-[#263b3f]">{summaryQuery.data?.requestsOpen}</span>}
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
          <Link href="/app/settings" onClick={() => setMobileMenu(false)} data-testid="link-nav-settings" className={cx('flex h-10 items-center gap-3 rounded-lg px-3 text-[13px] font-medium', active === '/app/settings' ? 'bg-[#33534f] text-white' : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground')}><Settings2 size={17} />{tx('Settings', language)}</Link>
          <div className="mt-4 flex items-center gap-3 border-t border-sidebar-border px-2 pt-4">
            <div className="grid size-9 place-items-center rounded-full bg-[#476662] text-[11px] font-bold text-white">AM</div>
            <div className="min-w-0 flex-1"><div className="truncate text-[12px] font-semibold">Amira Mansour</div><div className="text-[10px] text-sidebar-foreground/50">Regional manager</div></div>
            <MoreHorizontal size={17} className="text-sidebar-foreground/55" />
          </div>
        </div>
      </aside>
      {mobileMenu && <button type="button" aria-label={ar ? 'إغلاق التنقل' : 'Close navigation'} onClick={() => setMobileMenu(false)} className="fixed inset-0 z-30 cursor-default bg-[#16282b]/55 backdrop-blur-[2px] md:hidden" />}
      <div className={cx('min-h-[100dvh] transition-[margin] duration-300', ar ? 'md:mr-[252px]' : 'md:ml-[252px]')}>
        <header className="sticky top-0 z-20 flex h-[68px] items-center gap-4 border-b border-border/80 bg-background/95 px-5 backdrop-blur-md md:px-8">
          <button type="button" onClick={() => setMobileMenu(true)} aria-expanded={mobileMenu} aria-controls="workspace-drawer" className="rounded-lg p-2 hover:bg-muted md:hidden" aria-label={ar ? 'فتح التنقل' : 'Open navigation'}><Menu size={20} /></button>
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
              <button type="button" onClick={onToggleTheme} aria-label={ar ? 'تبديل السمة' : 'Toggle theme'} aria-pressed={dark} className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{dark ? <Sun size={16} /> : <Moon size={16} />}</button>
              <button type="button" onClick={() => setLocation('/app/requests')} aria-label={`Open requests, ${summaryQuery.data?.requestsOpen ?? 0} open`} className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-muted"><Bell size={17} />{(summaryQuery.data?.requestsOpen ?? 0) > 0 && <span className="absolute -right-1 -top-1 grid min-w-4 place-items-center rounded-full bg-[#c57252] px-1 text-[8px] font-bold text-white">{summaryQuery.data?.requestsOpen}</span>}</button>
            <div className="mx-1 hidden h-6 w-px bg-border sm:block" />
            <div className="grid size-8 place-items-center rounded-full bg-[#dce8df] text-[10px] font-bold text-[#315c4c]">AM</div>
          </div>
           {globalSearchOpen && <div role="dialog" aria-modal="true" aria-label={tx('Jump to a record', language)} className="fixed inset-0 z-[70] bg-background p-4 md:hidden">
             <div className="flex items-center gap-2"><div className="relative flex-1"><Search size={16} className={cx('absolute top-1/2 -translate-y-1/2 text-muted-foreground', ar ? 'right-3' : 'left-3')} /><input id="mobile-global-search" autoFocus value={search} onChange={event => setSearch(event.target.value)} placeholder={tx('Search anything', language)} className={cx('h-11 w-full rounded-xl border border-border bg-card text-sm outline-none focus:border-primary/60', ar ? 'pr-10 pl-3' : 'pl-10 pr-3')} /></div><button type="button" aria-label={tx('Close search', language)} onClick={() => setGlobalSearchOpen(false)} className="grid size-10 place-items-center rounded-lg hover:bg-muted"><X size={18} /></button></div>
             <div role="listbox" className="mt-3 space-y-1">{search.trim() && (allRecordsQuery.isLoading ? <div className="px-3 py-4 text-xs text-muted-foreground">{tx('Searching workspace…', language)}</div> : searchResults.length ? searchResults.map(record => <button type="button" role="option" key={record.id} onClick={() => { setGlobalSearchOpen(false); setLocation(recordPath(record.kind)); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-start hover:bg-muted"><span className="grid size-9 shrink-0 place-items-center rounded-lg bg-[#e9eee7] text-[10px] font-bold uppercase text-primary">{record.kind.slice(0, 2)}</span><span className="min-w-0 flex-1"><span className="block truncate text-xs font-semibold">{record.title}</span><span className="mt-1 block truncate text-[10px] capitalize text-muted-foreground">{record.kind} · {record.branch || record.department}</span></span><ArrowRight size={14} className="text-muted-foreground" /></button>) : <div className="px-3 py-4 text-xs text-muted-foreground">{tx('No results found', language)}</div>)}</div>
           </div>}
        </header>
        <main className="mx-auto w-full max-w-[1440px] px-5 pb-12 pt-7 md:px-8 md:pt-9">
          <WorkspaceContext.Provider value={{ language, setLanguage: setLang, search, branchCount }}>{children}</WorkspaceContext.Provider>
          <footer className="mt-12 flex flex-wrap items-center justify-between gap-2 border-t border-border/70 pt-5 text-[10px] text-muted-foreground"><span>Fieldwise Operations · Northstar Collective</span><span>Built for the people who keep things moving.</span></footer>
        </main>
      </div>
    </div>
  );
  return <RoutedErrorBoundary>{shellContent}</RoutedErrorBoundary>;
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const location = usePathname();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}
