export default function PopularServicesChart({ services, serviceNames = {} }) {
  if (!services || services.length === 0) {
    return (
      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h3 className="card-title text-lg">Layanan Terpopuler</h3>
          <p className="text-sm text-base-content/50 py-4">Belum ada data</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...services.map((s) => s.count), 1);

  return (
    <div className="card bg-base-100 border border-base-300">
      <div className="card-body">
        <h3 className="card-title text-lg">Layanan Terpopuler</h3>
        <div className="space-y-3 mt-2">
          {services.map((service) => {
            const name = serviceNames[service.serviceId] || service.serviceId;
            const width = (service.count / maxCount) * 100;
            return (
              <div key={service.serviceId}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{name}</span>
                  <span className="font-medium">{service.count}x</span>
                </div>
                <div className="h-5 bg-base-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all"
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
