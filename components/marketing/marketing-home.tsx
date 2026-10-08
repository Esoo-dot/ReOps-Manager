'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePreferences } from '@/components/preferences-provider';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Check, CheckCircle2, ChevronDown,
  ClipboardCheck, Command, Globe2, LayoutDashboard, ListTodo, Menu, Moon, Sun,
  UsersRound, X, ChartNoAxesCombined, BookOpenCheck, FileText, Building2, Bell,
} from 'lucide-react';


const copy = {
  en: {
    nav: ['Platform', 'How it works', 'For every location'],
    open: 'Open workspace', theme: 'Toggle color theme', language: 'Switch language',
    eyebrow: 'OPERATIONS, IN GOOD FORM',
    headline: 'Good operations should travel.',
    subhead: 'The standard at one location should feel just as clear at the next.',
    intro: 'ReOps Manager gives managers one practical place to coordinate people, procedures, training, requests, and performance—without losing sight of the work happening on the floor.',
    explore: 'See the workspace', below: 'A clearer view of the day',
    proof: 'One shared operating picture. In English or Arabic.',
    dashboard: 'Operations overview', locations: 'Locations in view', readiness: 'Training completion',
    tasks: 'Open tasks', requests: 'Requests to review', today: 'TODAY · FIELD UPDATE',
    task1: 'Opening checklist', task2: 'Review delivery request', task3: 'New starter: service basics',
    states: ['In progress', 'Needs review', 'Assigned'],
    sectionLabel: 'THE DISTANCE BETWEEN LOCATIONS',
    sectionTitle: 'The details are where consistency is made.',
    sectionText: 'A standard is only useful when people can find it, understand what to do, and see what needs attention next.',
    friction: [
      ['01', 'The same question, again', 'Procedures live in too many places. Teams end up asking a person instead of finding the answer.'],
      ['02', 'A quiet gap between shifts', 'Tasks and requests lose their owner as work moves from one team to another.'],
      ['03', 'A partial picture', 'Managers need to join up people, training, and branch signals before they can act.'],
    ],
    platformEyebrow: 'ONE WORKSPACE, CONNECTED',
    platformTitle: 'Make the next right action easier to see.',
    platformIntro: 'ReOps Manager brings the everyday operating pieces into one shared view. Start with what your teams need today, then build a steadier rhythm across locations.',
    modules: [
      ['Work in motion', 'Tasks and requests have a clear place, an owner, and a status your team can follow.', 'Tasks · Requests'],
      ['A standard people can use', 'Keep procedures and checklists close to the moments they are meant to guide.', 'Procedures · Checklists'],
      ['People, not just headcount', 'Keep employee and branch records connected to the work happening around them.', 'People · Branches'],
      ['Training in the flow', 'See training records and completion progress alongside day-to-day operations.', 'Training progress'],
      ['Signals worth a look', 'Bring KPI records and performance indicators into the conversation managers already have.', 'KPIs · Performance'],
    ],
    rhythmEyebrow: 'A BETTER OPERATING RHYTHM',
    rhythmTitle: 'From scattered updates to a shared next step.',
    rhythmIntro: 'A practical loop for managers who are close to the work and responsible for the whole picture.',
    steps: [
      ['Set the standard', 'Keep the procedure or checklist easy to return to.'],
      ['Put work in motion', 'Give tasks and requests an owner and a visible status.'],
      ['Support the team', 'See who is learning and where a manager can help.'],
      ['Notice the signal', 'Use branch and KPI records to focus the next conversation.'],
    ],
    sample: 'Illustrative sample workspace',
    bilingualEyebrow: 'BUILT FOR THE WAY TEAMS WORK',
    bilingualTitle: 'Clear in the language your team thinks in.',
    bilingualText: 'Switch between English and Arabic with a layout that respects the direction of each language. Shared work should not depend on one person translating the day.',
    langEn: 'English workspace', langAr: 'مساحة عمل عربية', rtlNote: 'واجهة عربية باتجاه من اليمين إلى اليسار',
    managersEyebrow: 'FOR THE PEOPLE KEEPING IT MOVING',
    managersTitle: 'A useful view for every level of the operation.',
    managers: [
      ['For operations leads', 'Spot where work is waiting, then bring the right locations into focus.'],
      ['For location managers', 'Keep local priorities, people, and shift routines visible in one place.'],
      ['For growing teams', 'Give new and experienced teammates a shared way to find the standard.'],
    ],
    closeLabel: 'START WITH A CLEARER VIEW',
    closeTitle: 'Bring the moving parts into view.',
    closeText: 'Explore the ReOps Manager workspace and see how your everyday operations can feel more connected.',
    enter: 'Explore ReOps Manager', footer: 'A shared workspace for people, process, and performance.',
    sampleTag: 'SAMPLE DATA',
  },
  ar: {
    nav: ['المنصة', 'كيف تعمل', 'لكل موقع'],
    open: 'افتح مساحة العمل', theme: 'تبديل سمة الألوان', language: 'تغيير اللغة',
    eyebrow: 'عمليات أكثر وضوحاً',
    headline: 'العمليات الجيدة تنتقل معك.',
    subhead: 'ينبغي أن يكون المعيار في موقع واضحاً بالقدر نفسه في الموقع التالي.',
    intro: 'تمنح فيلدوايز المديرين مساحة عملية واحدة لتنسيق الأشخاص والإجراءات والتدريب والطلبات والأداء، مع إبقاء العمل اليومي في الصورة.',
    explore: 'استكشف مساحة العمل', below: 'رؤية أوضح لليوم',
    proof: 'صورة تشغيلية مشتركة، بالعربية أو الإنجليزية.',
    dashboard: 'نظرة عامة على العمليات', locations: 'المواقع المعروضة', readiness: 'إتمام التدريب',
    tasks: 'المهام المفتوحة', requests: 'طلبات للمراجعة', today: 'اليوم · تحديث ميداني',
    task1: 'قائمة افتتاح الوردية', task2: 'مراجعة طلب التوريد', task3: 'موظف جديد: أساسيات الخدمة',
    states: ['قيد التنفيذ', 'تحتاج مراجعة', 'مُسندة'],
    sectionLabel: 'المسافة بين المواقع',
    sectionTitle: 'التفاصيل هي ما يصنع الاتساق.',
    sectionText: 'لا يفيد المعيار إلا عندما يستطيع الفريق العثور عليه وفهم ما عليه فعله ومعرفة ما يحتاج إلى اهتمام بعد ذلك.',
    friction: [
      ['٠١', 'السؤال نفسه من جديد', 'تتوزع الإجراءات على أماكن كثيرة، فيسأل الفريق شخصاً بدلاً من العثور على الإجابة.'],
      ['٠٢', 'فجوة هادئة بين الورديات', 'قد تفقد المهام والطلبات مسؤولها حين ينتقل العمل من فريق إلى آخر.'],
      ['٠٣', 'صورة غير مكتملة', 'يحتاج المدير إلى جمع إشارات الأشخاص والتدريب والفروع قبل اتخاذ الخطوة المناسبة.'],
    ],
    platformEyebrow: 'مساحة عمل واحدة مترابطة',
    platformTitle: 'اجعل الخطوة التالية أوضح.',
    platformIntro: 'تجمع فيلدوايز عناصر التشغيل اليومية في عرض مشترك. ابدأ بما تحتاجه الفرق اليوم، ثم ابنِ إيقاعاً أكثر ثباتاً بين المواقع.',
    modules: [
      ['العمل مستمر', 'للمهام والطلبات مكان واضح ومسؤول وحالة يمكن للفريق متابعتها.', 'المهام · الطلبات'],
      ['معيار قابل للاستخدام', 'أبقِ الإجراءات وقوائم التحقق ق��يبة من اللحظات التي ترشدها.', 'الإجراءات · قوائم التحقق'],
      ['الأشخاص قبل الأرقام', 'اربط سجلات الموظفين والفروع بالعمل الذي يجري حولهم.', 'الأشخاص · الفروع'],
      ['التدريب ضمن سير العمل', 'تابع سجلات التدريب والتقدم إلى جانب العمليات اليومية.', 'تقدم التدريب'],
      ['إشارات تستحق الانتباه', 'اجمع سجلات مؤشرات الأداء ضمن نقاشات المديرين اليومية.', 'المؤشرات · الأداء'],
    ],
    rhythmEyebrow: 'إيقاع تشغيلي أفضل',
    rhythmTitle: 'من تحديثات متفرقة إلى خطوة مشتركة.',
    rhythmIntro: 'حلقة عملية للمديرين القريبين من العمل والمسؤولين عن الصورة الكاملة.',
    steps: [
      ['حدّد المعيار', 'اجعل الإجراء أو قائمة التحقق سهلة الرجوع إليها.'],
      ['حرّك العمل', 'حدّد مسؤولاً وحالة واضحة لكل مهمة وطلب.'],
      ['ادعم الفريق', 'تابع من يتعلم وأين يمكن للمدير تقديم المساندة.'],
      ['لاحظ الإشارة', 'استخدم سجلات الفروع والمؤشرات لتركيز النقاش التالي.'],
    ],
    sample: 'مساحة عمل توضيحية', bilingualEyebrow: 'مصممة لطريقة عمل الفرق',
    bilingualTitle: 'واضحة باللغة التي يفكر بها فريقك.',
    bilingualText: 'تنقّل بين العربية والإنجليزية ضمن تخطيط يحترم اتجاه كل لغة. لا ينبغي أن يعتمد العمل المشترك على شخص واحد لترجمة تفاصيل اليوم.',
    langEn: 'مساحة عمل إنجليزية', langAr: 'مساحة عمل عربية', rtlNote: 'واجهة عربية باتجاه من اليمين إلى اليسار',
    managersEyebrow: 'لمن يحافظون على سير العمل',
    managersTitle: 'رؤية مفيدة لكل مستوى من العمليات.',
    managers: [
      ['لقادة العمليات', 'لاحظ أين ينتظر العمل، ثم ركّز على المواقع المناسبة.'],
      ['لمديري المواقع', 'أبقِ الأولويات المحلية والأشخاص وروتين الوردية في مكان واحد.'],
      ['للفرق المتنامية', 'امنح أعضاء الفريق طريقة مشتركة للعثور على المعيار.'],
    ],
    closeLabel: 'ابدأ برؤية أوضح', closeTitle: 'اجمع تفاصيل العمل في صورة واحدة.',
    closeText: 'استكشف مساحة فيلدوايز واكتشف كيف يمكن لعملياتك اليومية أن تصبح أكثر ترابطاً.',
    enter: 'استكشف فيلدوايز', footer: 'مساحة مشتركة للأشخاص والإجراءات والأداء.',
    sampleTag: 'بيانات توضيحية',
  },
} as const;

function ThemeButton({ dark, onToggle, label }: { dark: boolean; onToggle: () => void; label: string }) {
  return <button type="button" onClick={onToggle} className="theme-toggle grid h-10 w-[66px] grid-cols-2 place-items-center rounded-full border border-border bg-card text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={label} aria-pressed={dark} data-testid="button-theme-toggle">
    <Sun size={15} aria-hidden="true" /><Moon size={15} aria-hidden="true" />
  </button>;
}

export default function MarketingHome() {
  const { dark, toggleTheme: onToggleTheme, language, setLanguage } = usePreferences();
  const [menuOpen, setMenuOpen] = useState(false);
  const t = copy[language];
  const ar = language === 'ar';
  const changeLanguage = () => setLanguage(ar ? 'en' : 'ar');
  const arrow = ar ? ArrowLeft : ArrowRight;
  const Arrow = arrow;

  return <div className="marketing min-h-[100dvh]" dir={ar ? 'rtl' : 'ltr'} lang={language}>
    <header className="mk-header sticky top-0 z-40 border-b border-border/75 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="flex shrink-0 items-center gap-2.5 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label="ReOps Manager home">
          <span className="grid size-9 place-items-center rounded-[11px] bg-primary text-primary-foreground"><Command size={19} /></span>
          <span className="font-[var(--app-font-serif)] text-[20px] font-extrabold tracking-[-.07em]">ReOps</span>
        </a>
        <nav className="hidden items-center gap-8 md:flex" aria-label={ar ? 'التنقل الرئيسي' : 'Main navigation'}>
          {t.nav.map((item, index) => <a key={item} href={['#platform', '#rhythm', '#teams'][index]} className="text-[12px] font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{item}</a>)}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeButton dark={dark} onToggle={onToggleTheme} label={t.theme} />
          <button type="button" onClick={changeLanguage} className="hidden h-10 items-center gap-2 rounded-full border border-border px-3 text-[11px] font-bold text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex" aria-label={t.language} data-testid="button-language">
            <Globe2 size={15} />{ar ? 'EN' : 'عربي'}
          </button>
          <Link href="/app" className="hidden h-10 items-center gap-2 rounded-full bg-primary px-4 text-[11px] font-bold text-primary-foreground transition hover:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex" data-testid="link-open-workspace">{t.open}<ArrowUpRight size={14} /></Link>
          <button type="button" onClick={() => setMenuOpen(value => !value)} className="grid size-10 place-items-center rounded-full border border-border text-foreground sm:hidden" aria-expanded={menuOpen} aria-controls="mobile-marketing-nav" aria-label={menuOpen ? (ar ? 'إغلاق القائمة' : 'Close menu') : (ar ? 'فتح القائمة' : 'Open menu')} data-testid="button-marketing-menu">{menuOpen ? <X size={18} /> : <Menu size={18} />}</button>
        </div>
      </div>
      {menuOpen && <nav id="mobile-marketing-nav" className="border-t border-border bg-background px-5 py-3 sm:hidden">
        {t.nav.map((item, index) => <a key={item} href={['#platform', '#rhythm', '#teams'][index]} onClick={() => setMenuOpen(false)} className="block rounded-lg px-3 py-3 text-sm font-semibold hover:bg-muted">{item}</a>)}
        <button type="button" onClick={changeLanguage} className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-3 text-sm font-semibold hover:bg-muted"><Globe2 size={16} />{ar ? 'English' : 'العربية'}</button>
        <Link href="/app" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">{t.open}<ArrowUpRight size={15} /></Link>
      </nav>}
    </header>

    <main id="top">
      <section className="mk-hero relative min-h-[640px] overflow-hidden">
        <div className="mk-grid absolute inset-0 opacity-60" aria-hidden="true" />
        <div className="absolute -top-36 h-[500px] w-[500px] rounded-full bg-[#d1a45c]/15 blur-[90px]" style={{ insetInlineEnd: '-10%' }} aria-hidden="true" />
        <div className="relative mx-auto grid max-w-[1240px] items-center gap-12 px-5 pb-20 pt-16 md:grid-cols-[.9fr_1.1fr] md:px-8 md:pb-28 md:pt-24">
          <div className="mk-reveal max-w-[560px]">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#355a52]/20 bg-white/40 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.16em] text-[#355a52] dark:text-[#c1d8cb]"><span className="size-1.5 rounded-full bg-[#c38d46]" />{t.eyebrow}</div>
            <h1 className="mk-display max-w-[660px] text-[clamp(3.5rem,7.8vw,6.65rem)] font-extrabold leading-[.93]">{t.headline}</h1>
            <p className="mt-7 max-w-[500px] text-[17px] font-semibold leading-7 opacity-80 md:text-[19px]">{t.subhead}</p>
            <p className="mt-4 max-w-[510px] text-[14px] leading-7 opacity-70">{t.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/app" className="group inline-flex h-12 items-center gap-3 rounded-full bg-[#355a52] px-6 text-[12px] font-bold text-white transition hover:bg-[#284841] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d1a45c]" data-testid="link-hero-workspace">{t.open}<Arrow size={16} className="transition-transform group-hover:translate-x-0.5" /></Link>
              <a href="#platform" className="inline-flex h-12 items-center gap-2 rounded-full px-4 text-[12px] font-bold text-[#355a52] hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#355a52] dark:text-[#d5e4dc]">{t.explore}<ArrowDown size={14} /></a>
            </div>
            <div className="mt-10 flex items-center gap-3 text-[11px] font-medium opacity-65"><span className="grid size-7 place-items-center rounded-full border border-current"><Check size={14} /></span>{t.proof}</div>
          </div>
          <div className="mk-reveal mk-delay-2 relative min-w-0">
            <div className="absolute -inset-8 rounded-[35px] bg-[#d1a45c]/12 blur-2xl" aria-hidden="true" />
            <div className="mk-dashboard relative overflow-hidden rounded-[20px] border border-white/70 bg-[#fbfaf6] text-[#243b3c] dark:border-white/10 dark:bg-[#1e3031] dark:text-[#edf0e8]">
              <div className="flex items-center justify-between border-b border-[#243b3c]/10 px-5 py-4">
                <div className="flex items-center gap-2.5"><div className="grid size-8 place-items-center rounded-lg bg-[#355a52] text-white"><Command size={16} /></div><div><div className="text-[12px] font-bold">{t.dashboard}</div><div className="mt-0.5 text-[9px] opacity-55">Northstar Collective · Sample</div></div></div>
                <div className="flex items-center gap-2"><span className="rounded-full bg-[#edf1e8] px-2.5 py-1 text-[9px] font-bold text-[#54755d] dark:bg-white/10 dark:text-[#c1d8cb]">{t.sampleTag}</span><button type="button" aria-label={t.open} className="grid size-8 place-items-center rounded-full bg-[#f0eee7] text-[#355a52] dark:bg-white/10 dark:text-[#e4cfaa]"><Bell size={14} /></button></div>
              </div>
              <div className="grid gap-4 p-5 md:p-6">
                <div className="flex items-end justify-between gap-3"><div><div className="text-[9px] font-bold uppercase tracking-[.15em] text-[#658078]">{t.today}</div><h2 className="mt-2 text-[23px] font-extrabold tracking-[-.05em]">{t.below}</h2></div><div className="hidden rounded-lg border border-[#243b3c]/10 px-3 py-2 text-[9px] font-semibold sm:block">All locations <ChevronDown size={12} className="ms-2 inline" /></div></div>
                <div className="grid grid-cols-3 gap-2.5">
                  {[{ icon: Building2, label: t.locations, value: '08' }, { icon: ListTodo, label: t.tasks, value: '14' }, { icon: BookOpenCheck, label: t.readiness, value: '76%' }].map(item => <div key={item.label} className="rounded-xl border border-[#243b3c]/10 bg-white/70 p-3 dark:bg-white/[.04]"><item.icon size={15} className="text-[#638477]" /><div className="mt-3 text-[18px] font-extrabold tracking-[-.04em]">{item.value}</div><div className="mt-1 text-[9px] leading-4 opacity-60">{item.label}</div></div>)}
                </div>
                <div className="grid gap-3 md:grid-cols-[1.1fr_.9fr]">
                  <div className="rounded-xl border border-[#243b3c]/10 bg-white/70 p-4 dark:bg-white/[.04]">
                    <div className="mb-4 flex items-center justify-between"><span className="text-[10px] font-bold">{t.tasks}</span><span className="text-[9px] text-[#658078]">14 items</span></div>
                    {[t.task1, t.task2, t.task3].map((task, i) => <div key={task} className="flex items-center gap-2.5 border-t border-[#243b3c]/[.07] py-3"><span className={`grid size-6 shrink-0 place-items-center rounded-md ${i === 0 ? 'bg-[#edf2e9] text-[#52745d]' : 'bg-[#f5eddd] text-[#9b763a]'}`}>{i === 0 ? <Check size={12} /> : <ClipboardCheck size={12} />}</span><span className="min-w-0 flex-1 truncate text-[9px] font-semibold">{task}</span><span className="hidden rounded-full bg-[#f2eee4] px-2 py-1 text-[8px] font-semibold opacity-70 sm:block">{t.states[i]}</span></div>)}
                  </div>
                  <div className="rounded-xl bg-[#355a52] p-4 text-white">
                    <div className="flex items-center justify-between"><span className="text-[10px] font-bold">{t.requests}</span><ChartNoAxesCombined size={15} className="text-[#e1bd7e]" /></div>
                    <div className="mt-5 text-[31px] font-extrabold tracking-[-.06em]">06</div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15"><div className="h-full w-[62%] rounded-full bg-[#e1bd7e]" /></div>
                    <div className="mt-2 flex justify-between text-[8px] text-white/65"><span>4 assigned</span><span>2 awaiting</span></div>
                    <div className="mt-5 flex items-center gap-2 border-t border-white/15 pt-3 text-[9px] text-white/75"><UsersRound size={13} />Shared across locations</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 hidden rounded-xl border border-border/80 bg-card px-4 py-3 text-foreground shadow-lg sm:flex sm:items-center sm:gap-3" style={{ insetInlineStart: '-26px' }}><span className="grid size-8 place-items-center rounded-lg bg-[#f3ead8] text-[#997440]"><CheckCircle2 size={16} /></span><span><span className="block text-[10px] font-bold">Shift close · recorded</span><span className="mt-0.5 block text-[9px] text-muted-foreground">Example activity, not live data</span></span></div>
          </div>
        </div>
      </section>

      <section className="border-b border-border bg-background px-5 py-5 md:px-8">
        <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <span className="text-[10px] font-bold uppercase tracking-[.15em] text-muted-foreground">{t.proof}</span>
          <div className="flex flex-wrap gap-2">{['People', 'Process', 'Locations', 'Performance'].map((name, index) => <span key={name} className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1.5 text-[10px] font-semibold text-muted-foreground"><span className="grid size-4 place-items-center rounded-full bg-primary/10 text-primary">{[UsersRound, FileText, Building2, ChartNoAxesCombined].map((Icon, iconIndex) => iconIndex === index ? <Icon key={iconIndex} size={10} /> : null)}</span>{name}</span>)}</div>
        </div>
      </section>

      <section className="bg-background px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div><div className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{t.sectionLabel}</div><h2 className="mk-display max-w-[470px] text-[clamp(2.35rem,5vw,4.1rem)] font-extrabold leading-[1.02]">{t.sectionTitle}</h2></div>
            <p className="max-w-[480px] text-[14px] leading-7 text-muted-foreground md:justify-self-end">{t.sectionText}</p>
          </div>
          <div className="mt-14 grid gap-0 border-y border-border md:grid-cols-3 md:divide-x md:divide-border">
            {t.friction.map(([num, title, desc]) => <article key={num} className="py-7 md:px-7 md:py-9 first:md:ps-0 last:md:pe-0">
              <div className="mb-9 flex items-center justify-between text-[10px] font-bold text-primary"><span>{num}</span><span className="h-px w-12 bg-primary/35" /></div><h3 className="text-[17px] font-bold tracking-tight">{title}</h3><p className="mt-3 max-w-[310px] text-[12px] leading-6 text-muted-foreground">{desc}</p>
            </article>)}
          </div>
        </div>
      </section>

      <section id="platform" className="bg-[#e9eee5] px-5 py-20 text-[#243b3c] dark:bg-[#223535] dark:text-[#edf0e8] md:px-8 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="max-w-[650px]"><div className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-[#507766] dark:text-[#c4d5bf]">{t.platformEyebrow}</div><h2 className="mk-display text-[clamp(2.5rem,5.5vw,4.5rem)] font-extrabold leading-[.98]">{t.platformTitle}</h2><p className="mt-5 max-w-[570px] text-[13px] leading-7 opacity-75">{t.platformIntro}</p></div>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
            {t.modules.map(([title, desc, tags], index) => {
              const Icon = [ListTodo, FileText, UsersRound, BookOpenCheck, ChartNoAxesCombined][index];
              return <article key={title} className={`mk-feature-card rounded-2xl border border-[#355a52]/15 bg-[#f8f7f1]/75 p-5 dark:bg-[#1d3030]/75 ${index < 2 ? 'lg:col-span-2' : 'lg:col-span-1'} ${index > 1 ? 'lg:col-span-2' : ''}`}>
                <div className="flex items-start justify-between"><span className="grid size-10 place-items-center rounded-xl bg-[#355a52] text-white"><Icon size={18} /></span><span className="text-[9px] font-bold text-[#789083]">0{index + 1}</span></div>
                <h3 className="mt-6 text-[15px] font-bold">{title}</h3><p className="mt-2 min-h-[54px] text-[11px] leading-5 opacity-70">{desc}</p><div className="mt-5 border-t border-[#355a52]/10 pt-3 text-[9px] font-bold uppercase tracking-[.1em] text-[#52745d] dark:text-[#c5d4bd]">{tags}</div>
              </article>;
            })}
          </div>
          <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-[#355a52] p-5 text-white md:px-7"><div className="flex items-center gap-3"><LayoutDashboard size={19} className="text-[#e2c27f]" /><span className="text-[12px] font-semibold">{t.sample}</span></div><span className="rounded-full border border-white/25 px-3 py-1 text-[9px] font-bold tracking-[.12em]">{t.sampleTag}</span></div>
        </div>
      </section>

      <section id="rhythm" className="bg-background px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto grid max-w-[1180px] gap-12 lg:grid-cols-[.78fr_1.22fr]">
          <div><div className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{t.rhythmEyebrow}</div><h2 className="mk-display text-[clamp(2.5rem,5vw,4.25rem)] font-extrabold leading-[.98]">{t.rhythmTitle}</h2><p className="mt-5 max-w-[420px] text-[13px] leading-7 text-muted-foreground">{t.rhythmIntro}</p><Link href="/app" className="mt-7 inline-flex items-center gap-2 rounded-full border border-border px-5 py-3 text-[11px] font-bold transition hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">{t.open}<Arrow size={14} /></Link></div>
          <div className="relative space-y-3 before:absolute before:bottom-8 before:top-8 before:w-px before:bg-border" style={{ insetInlineStart: 0 }}>
            {t.steps.map(([title, desc], index) => <article key={title} className="relative flex gap-5 rounded-2xl border border-border bg-card p-5 md:p-6">
              <span className="relative z-10 grid size-10 shrink-0 place-items-center rounded-full border border-primary/20 bg-background text-[11px] font-bold text-primary">{String(index + 1).padStart(2, '0')}</span><div className="flex-1"><h3 className="text-[14px] font-bold">{title}</h3><p className="mt-1.5 text-[11px] leading-5 text-muted-foreground">{desc}</p></div><ArrowUpRight size={15} className="mt-1 text-muted-foreground" />
            </article>)}
          </div>
        </div>
      </section>

      <section className="bg-[#f0e9d9] px-5 py-20 text-[#243b3c] dark:bg-[#283738] dark:text-[#edf0e8] md:px-8 md:py-24">
        <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1fr_.9fr] md:items-center">
          <div><div className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-[#8c7045] dark:text-[#dfc185]">{t.bilingualEyebrow}</div><h2 className="mk-display max-w-[560px] text-[clamp(2.5rem,5.3vw,4.4rem)] font-extrabold leading-[.98]">{t.bilingualTitle}</h2><p className="mt-5 max-w-[530px] text-[13px] leading-7 opacity-75">{t.bilingualText}</p><div className="mt-7 flex flex-wrap gap-2"><span className="rounded-full border border-[#243b3c]/20 px-3 py-2 text-[10px] font-semibold">{t.langEn}</span><span className="rounded-full border border-[#243b3c]/20 px-3 py-2 text-[10px] font-semibold">{t.langAr}</span></div></div>
          <div className="rounded-[22px] border border-[#243b3c]/10 bg-[#faf8f2] p-5 shadow-[0_22px_60px_rgba(36,59,60,.1)] dark:bg-[#1c2d2e] md:p-7">
            <div className="flex items-center justify-between border-b border-border pb-4"><div className="flex items-center gap-2"><span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Command size={15} /></span><span className="text-[12px] font-extrabold">ReOps</span></div><span className="rounded-full bg-primary/10 px-3 py-1 text-[9px] font-bold text-primary">{t.sampleTag}</span></div>
            <div dir="rtl" lang="ar" className="mt-6 rounded-xl bg-[#e9eee5] p-5 text-[#243b3c] dark:bg-[#273d3a] dark:text-[#edf0e8]">
              <div className="text-[9px] font-bold text-[#62806e]">{t.rtlNote}</div><div className="mt-4 flex items-center justify-between"><div><div className="text-[11px] font-semibold">مراجعة جاهزية الوردية</div><div className="mt-1 text-[9px] opacity-60">فرع الواجهة · اليوم</div></div><span className="grid size-8 place-items-center rounded-full bg-white/70 text-[#52745d] dark:bg-white/10"><Check size={15} /></span></div>
              <div className="mt-5 space-y-2"><div className="h-2 w-full rounded-full bg-[#355a52]/10"><div className="h-full w-[78%] rounded-full bg-[#638477]" /></div><div className="flex justify-between text-[9px] opacity-60"><span>التحقق من التجهيز</span><span>٧٨٪</span></div></div>
            </div>
          </div>
        </div>
      </section>

      <section id="teams" className="bg-background px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-[1180px]">
          <div className="mb-12 max-w-[650px]"><div className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-primary">{t.managersEyebrow}</div><h2 className="mk-display text-[clamp(2.4rem,5vw,4.2rem)] font-extrabold leading-[.98]">{t.managersTitle}</h2></div>
          <div className="grid gap-4 md:grid-cols-3">
            {t.managers.map(([title, desc], index) => <article key={title} className="mk-feature-card flex min-h-[210px] flex-col justify-between rounded-2xl border border-border bg-card p-6 md:p-7"><div className="flex items-center justify-between"><span className="text-[10px] font-bold text-primary">0{index + 1}</span><span className="h-px w-10 bg-primary/40" /></div><div><h3 className="text-[16px] font-bold">{title}</h3><p className="mt-2 text-[12px] leading-6 text-muted-foreground">{desc}</p></div></article>)}
          </div>
        </div>
      </section>

      <section className="px-5 pb-20 md:px-8 md:pb-28">
        <div className="relative mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-[#263f3d] px-6 py-14 text-white md:px-14 md:py-16">
          <div className="absolute inset-y-0 w-[45%] bg-[#d1a45c]/10 blur-3xl" style={{ insetInlineEnd: 0 }} aria-hidden="true" />
          <div className="relative grid gap-8 md:grid-cols-[1fr_auto] md:items-end">
            <div className="max-w-[660px]"><div className="mb-4 text-[10px] font-bold uppercase tracking-[.18em] text-[#e4c78b]">{t.closeLabel}</div><h2 className="mk-display text-[clamp(2.7rem,6vw,5rem)] font-extrabold leading-[.94]">{t.closeTitle}</h2><p className="mt-5 max-w-[530px] text-[13px] leading-7 text-white/70">{t.closeText}</p></div>
            <Link href="/app" className="group inline-flex h-12 items-center justify-center gap-3 rounded-full bg-[#e0bc77] px-6 text-[12px] font-bold text-[#263f3d] transition hover:bg-[#edca8a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white" data-testid="link-final-workspace">{t.enter}<Arrow size={15} className="transition-transform group-hover:translate-x-0.5" /></Link>
          </div>
        </div>
      </section>
    </main>
    <footer className="border-t border-border px-5 py-7 md:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-2 font-[var(--app-font-serif)] text-[15px] font-extrabold tracking-[-.06em]"><span className="grid size-7 place-items-center rounded-lg bg-primary text-primary-foreground"><Command size={14} /></span>ReOps</a>
        <p className="text-[10px] text-muted-foreground">{t.footer}</p>
        <Link href="/app" className="text-[10px] font-bold text-primary hover:underline">{t.open}</Link>
      </div>
    </footer>
  </div>;
}
