import Link from 'next/link';
import Navbar from '../public/Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 overflow-x-hidden">
        {children}
      </main>
      <footer className="bg-[#E5E7EB] pt-16 pb-12 border-t border-slate-200 text-slate-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-9 gap-10 lg:gap-16 mb-16">

            {/* Footer Column 1: Logo and description */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <Link href="/" className="flex items-center gap-2 sm:gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/smattrik_logo.webp" alt="SMAT-TRIK" className="h-8 sm:h-10 w-auto transition-all duration-200" />
              </Link>
              <p className="text-sm leading-relaxed pr-32 text-slate-500">
                Spesialis pendingin industri dan solusi energi HVAC terpercaya sejak 2002.
              </p>
            </div>

            {/* Column 2: Solutions */}
            <div className="lg:col-span-3">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                Solutions
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/simulator" className="hover:text-slate-900 transition-colors">Energy Solutions</Link></li>
                <li><Link href="/order" className="hover:text-slate-900 transition-colors">Maintenance Plans</Link></li>
                <li><Link href="/aplikasi" className="hover:text-slate-900 transition-colors">Freon Replacements</Link></li>
              </ul>
            </div>

            {/* Column 3: Support */}
            <div className="lg:col-span-2">
              <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                Support
              </h4>
              <ul className="space-y-2.5 text-sm">
                <li><Link href="/contact" className="hover:text-slate-900 transition-colors">Contact Us</Link></li>
                <li><Link href="/privacy" className="hover:text-slate-900 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-slate-900 transition-colors">Terms of Service</Link></li>
              </ul>
            </div>

          </div>

          {/* Bottom Section */}
          <div className="border-t border-slate-300/60 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-slate-400 font-medium">
              &copy; {new Date().getFullYear()} Smat-trik Industrial Cooling Specialist. All rights reserved.
            </p>

            {/* Social / Web Icons */}
            <div className="flex gap-4 text-slate-400">
              <a href="#" className="hover:text-slate-600 transition-colors" aria-label="Website">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                </svg>
              </a>
              <a href="#" className="hover:text-slate-600 transition-colors" aria-label="Email">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </a>
              <a href="#" className="hover:text-slate-600 transition-colors" aria-label="Phone">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
