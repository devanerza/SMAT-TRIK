import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/aplikasi', label: 'Aplikasi' },
  { href: '/simulator', label: 'Simulasi Penghematan' },
  { href: '/about', label: 'Tentang Kami' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <header className="sticky top-0 z-50 bg-[#F9FAFB]/90 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smattrik_logo.webp" alt="SMAT-TRIK" className="h-10 w-auto" />
        </Link>

        {/* Desktop Nav Menu */}
        <nav className="hidden md:flex items-center gap-8 text-base font-semibold text-slate-600">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={
                pathname === href
                  ? 'text-orange-600 border-b-2 border-orange-600 pb-1'
                  : 'hover:text-orange-600 transition-colors'
              }
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Hamburger Button (mobile only) */}
        <button
          className="md:hidden relative z-50 w-10 h-10 flex items-center justify-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <div className="w-5 h-4 relative flex flex-col justify-between">
            <span className={`block h-0.5 w-full bg-slate-700 rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block h-0.5 w-full bg-slate-700 rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block h-0.5 w-full bg-slate-700 rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </div>
        </button>

        {/* Mobile Dropdown Menu */}
        <div
          className={`fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity duration-300 md:hidden ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`fixed top-0 right-0 z-40 h-full w-72 max-w-[85vw] bg-[#F9FAFB] shadow-2xl border-l border-slate-100 transition-transform duration-300 ease-in-out md:hidden ${menuOpen ? 'translate-x-0' : 'translate-x-full'}`}
        >
          <div className="flex flex-col gap-1 pt-24 px-6">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={
                  pathname === href
                    ? 'px-4 py-3 rounded-xl text-base font-bold text-orange-600 bg-orange-50 border border-orange-100'
                    : 'px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-100 transition-colors'
                }
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div>
          <Link
            href="/order"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            Book Service
          </Link>
        </div>
      </div>
    </header>
  );
}
