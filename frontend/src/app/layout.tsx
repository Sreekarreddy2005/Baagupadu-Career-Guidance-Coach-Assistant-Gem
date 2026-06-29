import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Baagupadu — Discover Who You Truly Are',
  description:
    'Baagupadu is an AI-powered mentoring ecosystem. Have a deep, empathetic conversation with Sahayam and discover your true self and your ideal career path.',
  openGraph: {
    title: 'Baagupadu — Discover Who You Truly Are',
    description: 'An AI mentor that understands your story and helps you find your path.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full bg-[#0F0F1F] text-white">{children}</body>
    </html>
  );
}
