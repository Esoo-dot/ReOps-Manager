import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-background px-6 text-foreground">
      <div className="max-w-md text-center">
        <p className="text-[11px] font-bold tracking-[.18em] text-primary">404</p>
        <h1 className="mt-3 font-serif text-3xl font-bold tracking-tight">This page does not exist</h1>
        <p className="mt-3 text-sm text-muted-foreground">The link may be outdated, or the page has moved.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link href="/app" className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-95">Open workspace</Link>
          <Link href="/" className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold hover:bg-muted">Home</Link>
        </div>
      </div>
    </main>
  );
}
