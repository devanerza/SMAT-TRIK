import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

const adminNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/admin',
    icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6',
  },
  {
    label: 'Analytics',
    href: '/dashboard/admin/analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z',
  },
  {
    label: 'Pengaturan',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065zM15 12a3 3 0 11-6 0 3 3 0 016 0z',
    children: [
      { label: 'Layanan', href: '/dashboard/admin/settings/services' },
      { label: 'Tim Teknisi', href: '/dashboard/admin/settings/teams' },
    ],
  },
];

const teknisiNavItems = [
  {
    label: 'Dashboard',
    href: '/dashboard/teknisi',
    icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
];

export default function DashboardLayout({ children }) {
  const { user, role, signOut } = useAuth();
  const router = useRouter();
  const navItems = role === 'teknisi' ? teknisiNavItems : adminNavItems;

  const handleLogout = async () => {
    await signOut();
    router.push('/login');
  };

  const isActive = (href) => {
    if (href === '/dashboard/admin' || href === '/dashboard/teknisi') {
      return router.pathname === href;
    }
    return router.pathname.startsWith(href);
  };

  const NavIcon = ({ path }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d={path} />
    </svg>
  );

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-slate-800 selection:bg-orange-500 selection:text-white">
      <aside className="fixed top-0 left-0 bottom-0 w-64 bg-white border-r border-slate-200 flex flex-col z-30">
        <div className="p-5 border-b border-slate-100">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-9 h-9 rounded-full bg-orange-100">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.32 11.32l.707-.707M12 12a3 3 0 100-6 3 3 0 000 6z" />
              </svg>
            </div>
            <div>
              <h2 className="text-lg font-extrabold tracking-tight text-slate-900 leading-tight">SMAT-TRIK</h2>
              <p className="text-xs font-semibold text-slate-400 capitalize">{role}</p>
            </div>
          </Link>
        </div>
        <nav className="flex-1 p-4">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              if (item.children) {
                const isOpen = item.children.some((c) => router.pathname.startsWith(c.href));
                return (
                  <li key={item.label}>
                    <details open={isOpen} className="group">
                      <summary className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:text-orange-600 hover:bg-orange-50 cursor-pointer list-none transition-colors [&::-webkit-details-marker]:hidden">
                        <span className="shrink-0"><NavIcon path={item.icon} /></span>
                        {item.label}
                      </summary>
                      <ul className="ml-4 mt-1 space-y-0.5">
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={`flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                                isActive(child.href)
                                  ? 'text-orange-600 bg-orange-50 font-semibold'
                                  : 'text-slate-500 hover:text-orange-600 hover:bg-orange-50'
                              }`}
                            >
                              {child.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                );
              }
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${
                      isActive(item.href)
                        ? 'text-orange-600 bg-orange-50'
                        : 'text-slate-600 hover:text-orange-600 hover:bg-orange-50'
                    }`}
                  >
                    <span className="shrink-0"><NavIcon path={item.icon} /></span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <header className="sticky top-0 z-40 bg-[#F9FAFB]/90 backdrop-blur-md border-b border-slate-100 px-6 h-16 flex items-center justify-end gap-4">
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium text-slate-500">
              {user?.email}
            </div>
            <button
              className="inline-flex items-center justify-center px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg shadow-sm hover:shadow transition-all duration-200"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
