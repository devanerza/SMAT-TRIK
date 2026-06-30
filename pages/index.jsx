import Head from 'next/head';
import Link from 'next/link';
import Layout from '@/components/shared/Layout';
import LogoMarquee from '@/components/public/LogoMarquee';
import CountUp from '@/components/public/CountUp';

export default function Home() {

  return (
    <>
      <Head>
        <title>Smat-trik - Solusi Pendingin Industri Efisien & Hemat Energi</title>
        <meta name="description" content="Spesialis pendingin industri dan solusi energi HVAC terpercaya. Dapatkan efisiensi energi maksimal dengan Smat-trik Freon." />
      </Head>

      <div className="min-h-screen bg-[#F9FAFB] text-slate-800 font-sans selection:bg-orange-500 selection:text-white">


        <Layout>
          {/* HERO SECTION */}
          <section className="relative py-12 md:py-20 lg:py-15 overflow-hidden bg-cover bg-center bg-[url('/hero-ac-hemat-energi.webp')] lg:bg-none">
            {/* Mobile semi-transparent background overlay to keep text readable */}
            <div className="absolute inset-0 bg-black/40 lg:hidden pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

                {/* Left Column Content */}
                <div className="lg:col-span-6 flex flex-col items-start text-left">
                  <h1 className="text-4xl text-white font-extrabold tracking-tight lg:text-slate-900 leading-[1.1] mb-2">
                    Spesialis Efisiensi Energi Listrik AC <span className='text-orange-600'>TERBAIK</span> di Indonesia
                  </h1>

                  <p className="text-sm lg:text-md text-white lg:text-slate-600 leading-relaxed max-w-xl mb-10">
                    Optimalkan kinerja sistem pendingin industri Anda dengan teknologi terbaru yang dirancang untuk performa maksimal dengan konsumsi energi minimal.
                  </p>

                  {/* Two Main Call-to-Actions */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-6 w-full sm:w-auto">
                    <div className="flex flex-col items-center">
                      <Link
                        href="/order"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-base rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-center"
                      >
                        Smat-trik Freon Hemat Energi
                      </Link>
                      <span className="text-xs text-slate-200 mt-2 font-medium">
                        *Aplikasi untuk Seluruh Indonesia
                      </span>
                    </div>

                    <div className="flex flex-col items-center">
                      <Link
                        href="/order"
                        className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-base rounded-xl shadow-sm hover:shadow transition-all duration-200 text-center"
                      >
                        Layanan Maintenance AC
                      </Link>
                      <span className="text-xs text-slate-200 mt-2 font-medium">
                        *Jakarta • Surabaya • Yogyakarta
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column Image Grid / Graphic */}
                <div className="lg:col-span-6 relative justify-center hidden lg:flex">
                  {/* Hero Image Container */}
                  <div className="relative w-full h-80 max-w-lg lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/hero-ac-hemat-energi.webp"
                      alt="Industrial Cooling Tower"
                      className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay shadow / glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  {/* Floating Achievement Card */}
                  <div className="absolute -bottom-6 left-6 md:-left-6 bg-white/95 backdrop-blur rounded-2xl p-4 shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[280px]">
                    <div className="flex items-center justify-center w-11 h-11 rounded-full bg-orange-600 text-white shrink-0 shadow-md">
                      <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-xl font-extrabold text-slate-900 leading-tight">20%</div>
                      <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Energy Savings Achieved</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </section>

          {/* FEATURES / KEUNGGULAN SECTION */}
          <section className="py-20 bg-[#F3F4F6]/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Header */}
              <div className="text-center max-w-3xl mx-auto mb-16">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
                  Keunggulan Smat-trik Freon
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Refrigerant generasi terbaru yang dirancang khusus untuk mengurangi beban kerja kompresor dan menghemat biaya operasional.
                </p>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">

                {/* Card 1: Efisiensi Termal */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Efisiensi Termal Maksimal
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Smat-trik Freon memiliki koefisien transfer panas yang lebih tinggi dibandingkan freon standar, memungkinkan pencapaian suhu target lebih cepat dengan energi lebih rendah.
                    </p>
                  </div>

                  {/* Progress bar info */}
                  <div className="mt-8 bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between items-center text-xs font-bold text-slate-600 mb-2">
                      <span>Energy Use</span>
                      <span className="text-orange-600">20% Lower</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-orange-500 to-orange-600 h-full rounded-full" style={{ width: '80%' }}></div>
                    </div>
                  </div>
                </div>

                {/* Card 2: Ramah Lingkungan */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Ramah Lingkungan
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Low Global Warming Potential (GWP) dan nol Ozone Depletion Potential (ODP), sesuai standar regulasi lingkungan internasional.
                    </p>
                  </div>
                </div>

                {/* Card 3: Kompatibilitas Luas */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300 flex flex-col justify-between min-h-[300px]">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-700 mb-6">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3">
                      Kompatibilitas Luas
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      Dapat digunakan untuk berbagai jenis sistem HVAC industri tanpa perlu modifikasi besar pada unit eksisting Anda.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* LOGO MARQUEE */}
          <section className="bg-[#F9FAFB] py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 text-center mb-12">
                Dipercaya Oleh
              </h2>
              <LogoMarquee />
            </div>
          </section>

          {/* LAYANAN MAINTENANCE PROFESSIONAL SECTION */}
          <section className="py-20 md:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">

                {/* Left Column Image Grid (2x2) */}
                <div className="lg:col-span-6 grid grid-cols-2 gap-4">
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/hero-ac-hemat-energi.webp/" alt="HVAC Technician" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/rooftop_chillers.png" alt="Rooftop Chiller Units" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/pendingin-server-rack.webp" alt="Server Cooling Corridor" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-md">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/alat-maintenance-hvac.webp" alt="HVAC Maintenance Tools" className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                  </div>
                </div>

                {/* Right Column Content */}
                <div className="lg:col-span-6 flex flex-col items-start">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-6">
                    Layanan Maintenance Professional
                  </h2>

                  <p className="text-base text-slate-600 leading-relaxed mb-10">
                    Kami menyediakan tim teknisi bersertifikat yang siap menangani perawatan rutin hingga perbaikan darurat untuk memastikan sistem HVAC Anda beroperasi pada efisiensi puncak.
                  </p>

                  {/* Features List with customized icons */}
                  <div className="space-y-6 w-full mb-10">

                    {/* Item 1 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">
                          Kehadiran Regional
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Cabang resmi di Jakarta, Surabaya, dan Yogyakarta untuk respon cepat.
                        </p>
                      </div>
                    </div>

                    {/* Item 2 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">
                          Preventive Maintenance
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Program perawatan berkala untuk mencegah downtime yang merugikan operasional.
                        </p>
                      </div>
                    </div>

                    {/* Item 3 */}
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center text-orange-600 shrink-0 shadow-sm">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="text-base font-bold text-slate-900 mb-1">
                          Laporan Teknis Lengkap
                        </h4>
                        <p className="text-sm text-slate-500 leading-relaxed">
                          Dokumentasi detail setiap kunjungan untuk audit energi dan manajemen aset.
                        </p>
                      </div>
                    </div>

                  </div>

                  <Link
                    href="/order"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-[#111827] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-colors text-center"
                  >
                    Konsultasi Jadwal Maintenance
                  </Link>
                </div>

              </div>
            </div>
          </section>

          {/* METRICS / STATS SECTION */}
          <section className="bg-[#18181B] text-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-widest text-slate-200">
                  Mengapa Memilih SMAT-TRIK?
                </h2>
              </div>

              <div className="lg:grid grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-8 sm:flex sm:flex-col text-center">

                {/* Stat 1 */}
                <div className='mb-3 lg:m-0'>
                  <div className="text-4xl font-extrabold text-[#D97706] mb-2">
                    <CountUp end={500} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    Pekerjaan Selesai
                  </div>
                </div>

                {/* Stat 2 */}
                <div className='mb-3 lg:m-0'>
                  <div className="text-4xl font-extrabold text-[#D97706] mb-2">
                    <CountUp end={190} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    Partner Bisnis
                  </div>
                </div>

                {/* Stat 3 */}
                <div className='mb-3 lg:m-0'>
                  <div className="text-4xl font-extrabold text-[#D97706] mb-2">
                    <CountUp end={1000} />
                  </div>
                  <div className="text-xs sm:text-sm font-semibold tracking-wider text-slate-400 uppercase">
                    Pelanggan Puas
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* APLIKASI PREVIEW */}
          <section className="py-16 md:py-20 bg-[#F3F4F6]/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                  Aplikasi SMAT-TRIK
                </h2>
                <p className="text-slate-500 mt-2">
                  Berbagai proyek yang telah berhasil diimplementasikan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    company: 'Science Techno Park UGM',
                    location: 'Sleman, Yogyakarta',
                    capacity: '35 PK',
                    saving: '20%',
                    image: '/aplikasi-smat-trik-STP-UGM-01-scaled.webp',
                  },
                  {
                    company: 'BIMC Hospital Kuta Bali',
                    location: 'Bali',
                    capacity: '92,5 PK',
                    saving: '26%',
                    image: '/aplikasi-smat-trik-BIMC-KUTA-BALI-06.webp',
                  },
                  {
                    company: 'Siloam Hospitals Bali',
                    location: 'Bali',
                    capacity: '734,3 PK',
                    saving: '20%',
                    image: '/Aplikasi-SMAT-TRIK-Siloam-Group-01.webp',
                  },
                ].map((project, i) => (
                  <div key={i} className="group relative overflow-hidden rounded-2xl shadow-md bg-white">
                    <div className="aspect-[4/3] overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={project.image}
                        alt={project.company}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-[#111827] via-[#111827]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                      <div className="p-5 w-full">
                        <h3 className="text-white font-bold text-lg mb-2">{project.company}</h3>
                        <div className="space-y-1 text-sm text-slate-300">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {project.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            {project.capacity} &middot; Hemat {project.saving}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className="inline-block px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full shadow">
                        {project.saving}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center mt-10">
                <Link
                  href="/aplikasi"
                  className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#111827] hover:bg-black text-white font-bold text-sm rounded-xl shadow-md transition-colors"
                >
                  Lihat Semua Proyek
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </section>

          {/* CTA CARD BANNER */}
          <section className="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 sm:p-12 shadow-xl text-white flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
              <div className="max-w-2xl">
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
                  Siap Meningkatkan Efisiensi Pendingin Anda?
                </h3>
                <p className="text-orange-50 text-base leading-relaxed">
                  Hubungi tim ahli kami untuk audit energi sistem HVAC gratis dan penawaran khusus freon Smat-trik.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 shrink-0 w-full lg:w-auto">
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center px-8 py-4 bg-white text-orange-600 font-bold text-base rounded-xl shadow hover:shadow-lg transition-shadow text-center"
                >
                  Hubungi Kami
                </Link>
                <Link
                  href="/simulator"
                  className="inline-flex items-center justify-center px-8 py-4 border border-white text-white font-bold text-base rounded-xl hover:bg-white/10 transition-colors text-center"
                >
                  Lihat Produk
                </Link>
              </div>
            </div>
          </section>
        </Layout>
      </div>
    </>
  );
}
