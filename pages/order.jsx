import { useState, useEffect } from 'react';
import Layout from '../components/shared/Layout';
import OrderForm from '../components/public/OrderForm';

export default function OrderPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchServices() {
      try {
        const res = await fetch('/api/services');
        if (res.ok) {
          const data = await res.json();
          setServices(data);
        }
      } catch {
      } finally {
        setLoading(false);
      }
    }
    fetchServices();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Pesan Service AC</h1>
        <p className="text-base-content/60 mb-8">
          Isi form di bawah untuk memesan layanan service AC. Kami akan menghubungi Anda melalui WhatsApp.
        </p>
        <OrderForm services={services} />
      </div>
    </Layout>
  );
}
