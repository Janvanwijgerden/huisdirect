import type { Metadata } from 'next';
import { Playfair_Display, DM_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

export const metadata: Metadata = {
title: 'Huisdirect  Vind jouw perfecte woning',
description: 'Bekijk woningen door heel Nederland. Eenvoudig, transparant en altijd actueel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-stone-50 text-stone-900 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
