import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'Tentang Kami' },
  { href: '/aplikasi', label: 'Proyek Aplikasi' },
  { href: '/referensi', label: 'Referensi' },
  { href: '/simulator', label: 'Simulasi Penghematan' },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useRouter();

  return (
    <>
    <header className="sticky top-0 z-50 bg-[#F9FAFB]/70 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/smattrik_logo.webp" alt="SMAT-TRIK" className="h-8 sm:h-10 w-auto transition-all duration-200" />
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

        {/* Mobile controls (Hamburger) */}
        <div className="md:hidden flex items-center">
          <button
            className="relative z-[60] w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors focus:outline-none"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            <div className="w-5 h-4 relative flex flex-col justify-between">
              <span className={`block h-0.5 w-full bg-slate-700 rounded transition-all duration-300 origin-center ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
              <span className={`block h-0.5 w-full bg-slate-700 rounded transition-all duration-300 ${menuOpen ? 'opacity-0 scale-x-0' : ''}`} />
              <span className={`block h-0.5 w-full bg-slate-700 rounded transition-all duration-300 origin-center ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
            </div>
          </button>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <Link
            href="/order"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
          >
            Book Service
          </Link>
        </div>
      </div>
    </header>

    {/* Mobile Menu Dropdown (outside header for proper stacking above hero content) */}
    <div
      className={`fixed top-20 left-0 right-0 z-50 bg-[#F9FAFB] border-b border-slate-200/60 shadow-lg transition-all duration-300 ease-in-out origin-top md:hidden ${menuOpen ? 'max-h-[400px] opacity-100 visible' : 'max-h-0 opacity-0 invisible overflow-hidden pointer-events-none'
        }`}
    >
      <div className="py-4 px-6 flex flex-col gap-2">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={
              pathname === href
                ? 'px-4 py-3 rounded-xl text-base font-bold text-orange-600 bg-orange-50 border border-orange-100/60'
                : 'px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:bg-slate-50 transition-colors'
            }
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </Link>
        ))}
        {/* Mobile Dropdown CTA */}
        <div className="mt-2 pt-2 border-t border-slate-100">
          <Link
            href="/order"
            className="flex items-center justify-center w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-md transition-all duration-200"
            onClick={() => setMenuOpen(false)}
          >
            Book Service
          </Link>
        </div>
      </div>
    </div>
    </>
  );
}

