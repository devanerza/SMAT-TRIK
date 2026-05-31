import Layout from '../components/shared/Layout';
import FreonSimulator from '../components/public/FreonSimulator';

export default function SimulatorPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Simulator Freon AC</h1>
        <p className="text-base-content/60 mb-8">
          Hitung penghematan biaya listrik AC Anda dengan teknologi Smat-Trik.
        </p>
        <FreonSimulator />
      </div>
    </Layout>
  );
}
