import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import AmbientBackground from '@/components/AmbientBackground';

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
    <ClerkProvider>
      <html
        lang="en"
        className={`${inter.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <body className="min-h-screen bg-transparent text-text font-sans transition-colors duration-300 ">
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="relative z-10 min-h-screen">
              {children}
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
