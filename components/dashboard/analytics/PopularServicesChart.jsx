export default function PopularServicesChart({ services, serviceNames = {} }) {
  if (!services || services.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-6">
          <h3 className="text-lg font-extrabold text-slate-900 mb-4">Layanan Terpopuler</h3>
          <p className="text-sm text-slate-400 py-4">Belum ada data</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...services.map((s) => s.count), 1);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="p-6">
        <h3 className="text-lg font-extrabold text-slate-900 mb-4">Layanan Terpopuler</h3>
        <div className="space-y-3 mt-2">
          {services.map((service) => {
            const name = serviceNames[service.serviceId] || service.serviceId;
            const width = (service.count / maxCount) * 100;
            return (
              <div key={service.serviceId}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-700">{name}</span>
                  <span className="font-semibold text-slate-600">{service.count}x</span>
                </div>
                <div className="h-5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-orange-500 rounded-full transition-all"
                    style={{ width: `${width}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
