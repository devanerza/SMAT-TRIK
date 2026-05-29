import { useRouter } from 'next/router';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';

const adminNavItems = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: '📊' },
  { label: 'Analytics', href: '/dashboard/admin/analytics', icon: '📈' },
  {
    label: 'Pengaturan',
    icon: '⚙️',
    children: [
      { label: 'Layanan', href: '/dashboard/admin/settings/services' },
      { label: 'Tim Teknisi', href: '/dashboard/admin/settings/teams' },
    ],
  },
];

const teknisiNavItems = [
  { label: 'Dashboard', href: '/dashboard/teknisi', icon: '📋' },
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

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-base-200 min-h-screen flex flex-col">
        <div className="p-4 border-b border-base-300">
          <h2 className="text-lg font-bold">AC Maintenance</h2>
          <p className="text-sm text-base-content/60 capitalize">{role}</p>
        </div>
        <nav className="flex-1 p-4">
          <ul className="menu bg-base-200 rounded-box gap-1">
            {navItems.map((item) => {
              if (item.children) {
                return (
                  <li key={item.label}>
                    <details open={item.children.some((c) => router.pathname.startsWith(c.href))}>
                      <summary className="font-medium">
                        <span>{item.icon}</span>
                        {item.label}
                      </summary>
                      <ul>
                        {item.children.map((child) => (
                          <li key={child.href}>
                            <Link
                              href={child.href}
                              className={isActive(child.href) ? 'active' : ''}
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
                    className={isActive(item.href) ? 'active' : ''}
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className="flex-1 flex flex-col">
        <header className="navbar bg-base-100 border-b border-base-300 px-6">
          <div className="flex-1" />
          <div className="flex-none gap-2">
            <div className="text-sm text-base-content/70">
              {user?.email}
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 bg-base-100">
          {children}
        </main>
      </div>
    </div>
  );
}
