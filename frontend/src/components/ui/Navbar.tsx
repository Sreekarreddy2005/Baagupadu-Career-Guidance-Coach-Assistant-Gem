'use client';

import Link from 'next/link';
import { useAuth, UserButton } from '@clerk/nextjs';
import { Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { isSignedIn, isLoaded } = useAuth();

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between w-full px-6 py-3 border-b border-black/5 dark:border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.03)]"
      style={{
        background: 'var(--glass-strong-bg)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <Link href="/" className="flex items-center gap-2 group cursor-pointer relative">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-[var(--color-secondary)] to-[#818CF8] shadow-sm group-hover:shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all duration-300">
          <Sparkles className="w-4 h-4 text-white group-hover:scale-110 transition-transform duration-300" />
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="font-bold text-xl tracking-tight text-[var(--color-text)] group-hover:text-[var(--color-secondary)] transition-colors duration-300">Baagupadu</span>
          <span className="font-medium text-[1rem] text-[var(--color-text-muted)] opacity-80 group-hover:text-[#818CF8] transition-colors duration-300">బాగుపడు</span>
        </div>
      </Link>

      <div className="hidden md:flex items-center gap-6 text-[var(--color-text-muted)] font-medium text-[13px]">
        <Link href="/how-it-works" className="hover:text-[var(--color-text)] transition-colors">How It Works</Link>
        <Link href="/mentors" className="hover:text-[var(--color-text)] transition-colors">Mentors</Link>
        <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Pricing</Link>
        <Link href="#" className="hover:text-[var(--color-text)] transition-colors">Resources</Link>
      </div>

      <div className="flex items-center gap-4">
        <ThemeToggle />

        {isLoaded && !isSignedIn && (
          <>
            <Link href="/login" className="hidden sm:block text-[var(--color-text-muted)] font-medium text-[13px] hover:text-[var(--color-text)] transition-colors">Log in</Link>
            <Link href="/login">
              <button className="px-4 py-1.5 rounded-full bg-[var(--color-text)] text-[var(--color-background)] font-medium text-[13px] hover:bg-[var(--color-secondary)] hover:text-white transition-colors shadow-sm hover:shadow-md">
                Sign Up
              </button>
            </Link>
          </>
        )}

        {isLoaded && isSignedIn && (
          <div className="flex items-center gap-4">
            <Link href="/chat">
              <button className="px-4 py-1.5 rounded-full bg-[var(--color-secondary)] text-white font-medium text-[13px] hover:bg-[#5658d6] transition-colors shadow-sm hover:shadow-md">
                Dashboard
              </button>
            </Link>
            <UserButton />
          </div>
        )}
      </div>
    </motion.nav>
  );
}
