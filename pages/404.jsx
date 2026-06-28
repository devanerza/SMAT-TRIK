import Link from 'next/link';
import Head from 'next/head';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Halaman Tidak Ditemukan | SMAT-TRIK</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4 selection:bg-orange-500 selection:text-white">
        <div className="text-center max-w-md">
          <div className="flex justify-center mb-6">
            <div className="relative flex items-center justify-center w-16 h-16 rounded-full bg-orange-100">
              <svg className="w-9 h-9 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>

          <h1 className="text-7xl sm:text-8xl font-extrabold text-slate-200 leading-none mb-4">404</h1>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-2">Halaman Tidak Ditemukan</h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed mb-8">
            Halaman yang Anda cari mungkin telah dipindahkan, dihapus, atau tidak tersedia.
          </p>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Kembali ke Beranda
            </Link>
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-sm rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Pesan Layanan
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
