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
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <span className="loading loading-spinner loading-lg text-orange-500"></span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (allowedRole && role !== allowedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] selection:bg-orange-500 selection:text-white">
        <div className="bg-white rounded-2xl shadow-md border border-slate-100 max-w-md w-full mx-4 p-8">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold text-red-500 mb-2">403</h1>
            <p className="text-slate-500 mb-6">
              Anda tidak memiliki akses ke halaman ini.
            </p>
            <button
              className="inline-flex items-center justify-center px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-lg shadow-sm hover:shadow transition-all duration-200"
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
