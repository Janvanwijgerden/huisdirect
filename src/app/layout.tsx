import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Huisdirect Vind jouw perfecte woning',
  description: 'Bekijk woningen door heel Nederland. Eenvoudig, transparant en altijd actueel.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={inter.variable}>
<body className={`${inter.variable} font-sans antialiased bg-white text-neutral-900`}>        {children}
      </body>
    </html>
  );
}