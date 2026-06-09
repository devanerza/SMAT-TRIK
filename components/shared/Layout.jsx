import Link from 'next/link';
import Navbar from '../public/Navbar';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-[#E5E7EB] pt-16 pb-12 border-t border-slate-200 text-slate-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 mb-16">
              
              {/* Footer Column 1: Logo and description */}
              <div className="lg:col-span-4 flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-orange-200">
                    <svg className="w-5 h-5 text-orange-700" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707-.707M12 12a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                  </div>
                  <span className="text-xl font-extrabold text-slate-900 tracking-tight">
                    SMAT-TRIK
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-slate-500">
                  Spesialis pendingin industri dan solusi energi HVAC terpercaya sejak 2002.
                </p>
              </div>

              {/* Column 2: Branches */}
              <div className="lg:col-span-3">
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                  Main Branches
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li>Jakarta Branch</li>
                  <li>Surabaya Branch</li>
                  <li>Yogyakarta Branch</li>
                </ul>
              </div>

              {/* Column 3: Solutions */}
              <div className="lg:col-span-3">
                <h4 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-4">
                  Solutions
                </h4>
                <ul className="space-y-2.5 text-sm">
                  <li><Link href="/services" className="hover:text-slate-900 transition-colors">Energy Solutions</Link></li>
                  <li><Link href="/services" className="hover:text-slate-900 transition-colors">Maintenance Plans</Link></li>
                  <li><Link href="/services" className="hover:text-slate-900 transition-colors">Freon Replacements</Link></li>
                </ul>
              </div>

              {/* Column 4: Support */}
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
