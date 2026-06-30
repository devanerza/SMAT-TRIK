const logos = [
  '/logo-bni.svg',
  '/logo-borromeus.png',
  '/logo-danamon.svg',
  '/logo-fifgroup.png',
  '/logo-fkugm.png',
  '/logo-ot.webp',
  '/logo-pln.png',
  '/logo-siloam.svg',
  '/logo-stmaria.png',
  '/logo-uii.webp',
  '/logo-universitas-mercu-buana.webp',
];

export default function LogoMarquee() {
  return (
    <div className="relative overflow-hidden w-full">
      <div className="flex animate-marquee flex-shrink-0">
        {[...logos, ...logos].map((src, i) => (
          <div
            key={`${src}-${i}`}
            className="flex-shrink-0 h-16 w-32 px-8 relative grayscale hover:grayscale-0 transition-all duration-300"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={`Logo ${i + 1}`}
              className="w-full h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
