export default function Home() {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col items-center justify-center p-4">
      <div className="hero bg-base-100 rounded-2xl shadow-xl max-w-lg p-8 border border-base-300">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold text-primary mb-4">AC Maintenance</h1>
            <p className="text-base-content mb-6">
              Welcome to the cooling solutions portal. The project foundation has been successfully configured.
            </p>
            <button className="btn btn-primary btn-wide">Get Started</button>
          </div>
        </div>
      </div>
    </div>
  );
}
