import type { Metadata, Viewport } from 'next';
import { DM_Sans, Manrope, Noto_Sans_Arabic } from 'next/font/google';
import { PreferencesProvider, themeInitScript } from '@/components/preferences-provider';
import './globals.css';

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-dm-sans' });
const manrope = Manrope({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-manrope' });
const notoArabic = Noto_Sans_Arabic({ subsets: ['arabic'], weight: ['400', '500', '600', '700'], variable: '--font-noto-arabic' });

export const metadata: Metadata = {
  title: 'Fieldwise — Operations management for multi-branch teams',
  description: 'Coordinate tasks, requests, people, training, SOPs and KPIs across every branch from one bilingual workspace.',
  icons: { icon: '/favicon.svg' },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f5ef' },
    { media: '(prefers-color-scheme: dark)', color: '#172526' },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${dmSans.variable} ${manrope.variable} ${notoArabic.variable}`}>
      <body suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <PreferencesProvider>{children}</PreferencesProvider>
      </body>
    </html>
  );
}
