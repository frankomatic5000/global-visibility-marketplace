'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-[#FF6B35]/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🌍</span>
            <span className="font-bold text-xl text-[#1A1A2E] font-[family-name:var(--font-playfair)]">GVM</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-[#1A1A2E]/60 hover:text-[#FF6B35] transition-colors font-[family-name:var(--font-dm-sans)]">
              Browse
            </Link>
            <Link href="/browse/us" className="text-[#1A1A2E]/60 hover:text-[#FF6B35] transition-colors font-[family-name:var(--font-dm-sans)]">
              Countries
            </Link>
            <Link href="/host" className="text-[#1A1A2E]/60 hover:text-[#FF6B35] transition-colors font-[family-name:var(--font-dm-sans)]">
              Become a Host
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-[#1A1A2E]/60 hover:text-[#FF6B35] transition-colors font-[family-name:var(--font-dm-sans)]">
              Sign In
            </button>
            <button className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg hover:bg-[#E55A2B] transition-colors font-[family-name:var(--font-syne)]">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}