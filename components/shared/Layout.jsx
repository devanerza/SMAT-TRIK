import Link from 'next/link';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <nav className="navbar bg-primary text-primary-content px-4">
        <div className="flex-1">
          <Link href="/" className="btn btn-ghost text-xl normal-case">
            AC Maintenance Service
          </Link>
        </div>
        <div className="flex-none gap-2">
          <Link href="/order" className="btn btn-ghost btn-sm">
            Pesan Service
          </Link>
          <Link href="/login" className="btn btn-ghost btn-sm">
            Login
          </Link>
        </div>
      </nav>
      <main className="flex-1">
        {children}
      </main>
      <footer className="footer footer-center p-4 bg-base-200 text-base-content">
        <p>&copy; {new Date().getFullYear()} AC Maintenance Service</p>
      </footer>
    </div>
  );
}
