import Head from 'next/head';
import Layout from '@/components/shared/Layout';

const projects = [
  {
    company: 'Science Techno Park UGM',
    location: 'Sleman, Yogyakarta',
    date: 'November 2019',
    capacity: '35 PK',
    saving: '20%',
    image: '/aplikasi-smat-trik-STP-UGM-01-scaled.webp',
  },
  {
    company: 'BIMC Hospital Kuta Bali',
    location: 'Bali',
    date: 'April 2021',
    capacity: '92,5 PK',
    saving: '26%',
    image: '/aplikasi-smat-trik-BIMC-KUTA-BALI-06.webp',
  },
  {
    company: 'Siloam Hospitals Bali',
    location: 'Bali',
    date: '2019',
    capacity: '734,3 PK',
    saving: '20%',
    image: '/Aplikasi-SMAT-TRIK-Siloam-Group-01.webp',
  },
  {
    company: 'PT INDONESIA POWER UJP LONTAR BANTEN',
    location: 'Tangerang, Banten',
    date: 'Februari 2016',
    capacity: '5 PK',
    saving: '31%',
    image: '/aplikasi-smatrik-indonesia-power-01.webp',
  },
  {
    company: 'Universitas Islam Indonesia',
    location: 'Sleman, Yogyakarta',
    date: 'November 2022',
    capacity: '-',
    saving: '20 - 30%',
    image: '/aplikasi-smatrik-uii-01.webp',
  },
];

export default function AplikasiPage() {
  return (
    <>
      <Head>
        <title>Aplikasi | SMAT-TRIK</title>
        <meta name="description" content="Galeri proyek aplikasi SMAT-TRIK yang telah terpasang di berbagai sektor industri, komersial, dan residensial." />
      </Head>

      <Layout>
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Aplikasi SMAT-TRIK
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                Berbagai proyek aplikasi SMAT-TRIK yang telah berhasil diimplementasikan di berbagai sektor di seluruh Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, i) => (
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {project.date}
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
          </div>
        </section>
      </Layout>
    </>
  );
}
