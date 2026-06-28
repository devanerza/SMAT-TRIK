import Head from 'next/head';
import { useState, useEffect } from 'react';
import Layout from '@/components/shared/Layout';

const images = [
  '/SUCOFINDO-UJI-SMAT-TRIK_page-0001.webp',
  '/SUCOFINDO-UJI-SMAT-TRIK_page-0002.webp',
  '/SUCOFINDO-UJI-SMAT-TRIK_page-0003.webp',
  '/SUCOFINDO-UJI-SMAT-TRIK_page-0004.webp',
  '/SUCOFINDO-UJI-SMAT-TRIK_page-0005.webp',
  '/Sertifikat-Smatrik-scaled.webp',
];

export default function TentangKami() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);
  const next = () => setCurrent((c) => (c + 1) % images.length);
  return (
    <>
      <Head>
        <title>Tentang Kami | SMAT-TRIK</title>
        <meta name="description" content="Kami adalah perusahaan profesional yang bergerak di bidang AC ruangan sejak 1997. Mitra terpercaya untuk supply, maintenance, dan efisiensi energi AC." />
      </Head>

      <Layout>
        {/* HERO SECTION */}
        <section className="relative py-12 md:py-20 lg:py-15 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-6 flex flex-col items-start text-left">
                <h1 className="text-4xl sm:text-5xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
                  Tentang Kami
                </h1>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Kami adalah perusahaan profesional yang bergerak di bidang AC ruangan sejak tahun 1997. Kami berkonsentrasi dalam bidang efisiensi energi listrik AC sejak 2002. Kami telah menjadi partner supply, maintenance dan Aplikasi Efisiensi Energi untuk rumah tangga, perusahaan/corporate berskala kecil sampai yang berskala nasional.
                </p>
              </div>
              <div className="lg:col-span-6 relative flex justify-center">
                <div className="relative w-full h-80 max-w-lg lg:max-w-none aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/Gemini_Generated_Image_4mxywq4mxywq4mxy.webp"
                    alt="SMAT-TRIK Cooling Solution"
                    className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* POINTS SECTION */}
        <section className="py-16 md:py-20 bg-[#F3F4F6]/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Point 1 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2m6-2a10 10 0 11-20 0 10 10 0 0120 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Berpengalaman Lebih dari 20 Tahun
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Kami sudah bergerak di bidang AC ruangan sejak tahun 1997 dan concern pada efisiensi energi listrik AC sejak 2002.
                </p>
              </div>

              {/* Point 2 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Terdaftar &amp; Bersertifikat Resmi
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Refrigerant SMAT-TRIK sudah tercatat secara resmi di Kementerian Hukum dan HAM sebagai Satu-satunya Produk Rekayasa Anak Bangsa untuk Solusi Hemat Energi Listrik yang Efektif. Tercatat dengan Nomor 000104965. Tanggal permohonan pada 10 April 2018 Nomor EC00201808558.
                </p>
              </div>

              {/* Point 3 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Uji Laboratorium Tersertifikasi
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Efektifitas SMAT-TRIK sudah teruji secara resmi. Uji Laboratorium telah dilakukan dan disahkan secara resmi oleh SBU Laboratorium Sucofindo dengan Nomor 04187/DBBPAO.
                </p>
              </div>

              {/* Point 4 */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 mb-6">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">
                  Terbukti Efektif Menghemat Energi
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed">
                  Efektifitas SMAT-TRIK telah terbukti dalam efisiensi energi dan menghemat biaya khususnya biaya konsumsi daya listrik AC oleh seluruh partner dan pelanggan kami baik dari sektor komersil, residensial maupun industri.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* VISI & MISI SECTION */}
        <section className="py-16 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
              {/* VISI */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-6">
                  Visi
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  Menjadi salah satu anak bangsa yang terus berinovasi dan berkampanye Indonesia Hemat Energi.
                </p>
              </div>

              {/* MISI */}
              <div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-8">
                  Misi
                </h2>

                <div className="space-y-8">
                  <div className="flex gap-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-base shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="text-base text-slate-600 leading-relaxed">
                        Menjadi Partner Profesional Corporate di Indonesia untuk mendapatkan AC yang Dingin, Awet dan Hemat Energi.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-base shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="text-base text-slate-600 leading-relaxed">
                        Menjadi Perusahaan HVAC (Heating, Ventilation, and Air Conditioning) Terkemuka di Indonesia dengan Standard International.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-5">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-500 text-white font-bold text-base shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="text-base text-slate-600 leading-relaxed">
                        Memberikan pelayanan yang terbaik kepada setiap pelanggan dalam bidang Sistem Tata Udara.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SERTIFIKAT CAROUSEL */}
        <section className="py-16 md:py-20 bg-[#F3F4F6]/50">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 text-center mb-4">
              Sertifikat &amp; Uji Laboratorium
            </h2>
            <p className="text-lg text-slate-500 text-center mb-12 max-w-2xl mx-auto">
              Dokumen resmi sertifikasi dan hasil uji laboratorium SMAT-TRIK
            </p>

            <div className="relative">
              <div className="overflow-hidden rounded-2xl shadow-lg bg-white">
                <div className="relative aspect-[4/3] sm:aspect-[16/10]">
                  {images.map((src, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={src}
                      src={src}
                      alt={`Sertifikat ${i + 1}`}
                      className={`absolute inset-0 w-full h-full object-contain p-4 transition-opacity duration-700 ${
                        i === current ? 'opacity-100' : 'opacity-0'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 shadow-md flex items-center justify-center text-slate-700 hover:bg-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            <div className="flex justify-center gap-2 mt-6">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-colors ${
                    i === current ? 'bg-orange-500' : 'bg-slate-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
