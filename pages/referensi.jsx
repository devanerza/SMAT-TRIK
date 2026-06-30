import Head from 'next/head';
import Layout from '@/components/shared/Layout';

const images = [
  { src: '/referensi-BIMCKUTABALI212x300.webp', label: 'BIMC Kuta Bali' },
  { src: '/REFERENSIRS.SULTANAGUNG212x300.webp', label: 'RS Sultan Agung' },
  { src: '/ReferensiRSI.Klaten212x300.webp', label: 'RSI Klaten' },
  { src: '/ReferensiRSSiloamBangka212x300.webp', label: 'RS Siloam Bangka' },
  { src: '/ReferensiRSSiloamButon212x300.webp', label: 'RS Siloam Buton' },
  { src: '/ReferensiRSSiloamJambi212x300.webp', label: 'RS Siloam Jambi' },
  { src: '/ReferensiRSSiloamKebunJeruk212x300.webp', label: 'RS Siloam Kebun Jeruk' },
  { src: '/ReferensiRSSiloamLabuanBajo212x300.webp', label: 'RS Siloam Labuan Bajo' },
  { src: '/ReferensiSiloamPalangkaRayaKaltengNov22212x300.webp', label: 'Siloam Palangka Raya' },
];

export default function ReferensiPage() {
  return (
    <>
      <Head>
        <title>Referensi | SMAT-TRIK</title>
        <meta name="description" content="Galeri referensi proyek dan mitra SMAT-TRIK dari berbagai institusi di Indonesia." />
      </Head>

      <Layout>
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
                Referensi
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed">
                Referensi proyek dan mitra SMAT-TRIK dari berbagai institusi di Indonesia.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {images.map((img, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl shadow-md bg-white">
                  <div className="aspect-[212/300] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.src}
                      alt={img.label}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                    <div className="p-4 w-full">
                      <h3 className="text-white font-semibold text-sm">{img.label}</h3>
                    </div>
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
