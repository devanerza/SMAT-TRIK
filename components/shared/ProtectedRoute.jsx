import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children, allowedRole }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRole && role !== allowedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-200">
        <div className="card bg-base-100 shadow-xl max-w-md p-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-error mb-4">403</h1>
            <p className="text-base-content mb-4">
              Anda tidak memiliki akses ke halaman ini.
            </p>
            <button
              className="btn btn-primary"
              onClick={() => router.push('/login')}
            >
              Kembali ke Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
