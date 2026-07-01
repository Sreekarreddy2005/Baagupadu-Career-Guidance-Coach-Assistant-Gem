import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Bagupadu — Discover Who You Truly Are',
  description:
    'Bagupadu is an AI-powered mentoring ecosystem. Have a deep, empathetic conversation with Sahayam and discover your true self and your ideal career path.',
  openGraph: {
    title: 'Bagupadu — Discover Who You Truly Are',
    description: 'An AI mentor that understands your story and helps you find your path.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full bg-background text-text font-sans transition-colors duration-300">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
