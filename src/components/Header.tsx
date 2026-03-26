'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-athos-azure/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">◆</span>
            <span className="font-bold text-xl text-athos-navy font-[family-name:var(--font-playfair)]">GVM</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/browse" className="text-athos-gray hover:text-athos-azure transition-colors font-[family-name:var(--font-dm-sans)]">
              Browse
            </Link>
            <Link href="/browse/us" className="text-athos-gray hover:text-athos-azure transition-colors font-[family-name:var(--font-dm-sans)]">
              Countries
            </Link>
            <Link href="/host" className="text-athos-gray hover:text-athos-azure transition-colors font-[family-name:var(--font-dm-sans)]">
              Become a Host
            </Link>
          </nav>

          {/* Auth buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-athos-gray hover:text-athos-azure transition-colors font-[family-name:var(--font-dm-sans)]">
              Sign In
            </button>
            <button className="bg-athos-azure text-white px-4 py-2 rounded-lg hover:bg-athos-deep-blue transition-colors font-[family-name:var(--font-syne)]">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
