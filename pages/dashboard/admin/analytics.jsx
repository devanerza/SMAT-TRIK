import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import ProtectedRoute from '../../../components/shared/ProtectedRoute';
import DashboardLayout from '../../../components/shared/DashboardLayout';
import OrderTrendChart from '../../../components/dashboard/analytics/OrderTrendChart';
import PopularServicesChart from '../../../components/dashboard/analytics/PopularServicesChart';
import TeamProductivityTable from '../../../components/dashboard/analytics/TeamProductivityTable';
import QuotaUtilizationChart from '../../../components/dashboard/analytics/QuotaUtilizationChart';
import {
  aggregateDailyOrderTrend,
  aggregatePopularServices,
  aggregateTeamProductivity,
  groupRepeatCustomers,
  calculateQuotaUtilization,
} from '../../../lib/analytics';

function AdminAnalyticsPage() {
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateStart, setDateStart] = useState('');
  const [dateEnd, setDateEnd] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (dateStart) params.set('startDate', dateStart);
      if (dateEnd) params.set('endDate', dateEnd);

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = `Bearer ${token}`;

      const [ordersRes, servicesRes, teamsRes] = await Promise.all([
        fetch(`/api/orders?${params.toString()}`, { headers }),
        fetch('/api/services', { headers }),
        fetch('/api/users', { headers }),
      ]);

      if (ordersRes.ok) setOrders(await ordersRes.json());
      if (servicesRes.ok) setServices(await servicesRes.json());
      if (teamsRes.ok) setTeams(await teamsRes.json());
    } catch {
    } finally {
      setLoading(false);
    }
  }, [dateStart, dateEnd]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const trend = aggregateDailyOrderTrend(orders);

  const allOrderItems = orders.flatMap((o) => o.order_items || []);

  const popularServices = aggregatePopularServices(allOrderItems);

  const serviceNames = {};
  services.forEach((s) => {
    serviceNames[s.id] = s.name;
  });

  const period = {};
  if (dateStart) period.startDate = dateStart;
  if (dateEnd) period.endDate = dateEnd;
  const productivity = aggregateTeamProductivity(orders, allOrderItems, period);

  const teamNames = {};
  teams.forEach((t) => {
    teamNames[t.id] = t.name || t.email;
  });

  const utilization = calculateQuotaUtilization(orders, period);

  const repeatCustomers = groupRepeatCustomers(orders);
  const repeatEntries = Object.entries(repeatCustomers);

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="form-control">
            <input
              type="date"
              className="input input-bordered input-sm bg-white border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg text-sm w-full"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
          <div className="form-control">
            <input
              type="date"
              className="input input-bordered input-sm bg-white border-slate-200 focus:border-orange-500 focus:ring-orange-500 rounded-lg text-sm w-full"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-orange-500" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <OrderTrendChart daily={trend.daily} weekly={trend.weekly} />

          <div className="space-y-6">
            <PopularServicesChart
              services={popularServices}
              serviceNames={serviceNames}
            />
            <QuotaUtilizationChart utilization={utilization} />
          </div>

          <TeamProductivityTable
            productivity={productivity}
            teamNames={teamNames}
          />

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-6">
              <h3 className="text-lg font-extrabold text-slate-900 mb-4">Pelanggan Berulang</h3>
              {repeatEntries.length === 0 ? (
                <p className="text-sm text-slate-400 py-4">
                  Belum ada pelanggan berulang
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="text-left font-semibold text-slate-500 pb-3">Identitas</th>
                        <th className="text-left font-semibold text-slate-500 pb-3">Jumlah Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repeatEntries.map(([identifier, customerOrders]) => (
                        <tr key={identifier} className="border-b border-slate-50 last:border-0">
                          <td className="font-medium text-slate-800 py-3">{identifier}</td>
                          <td className="text-slate-600 py-3">{customerOrders.length}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default function AdminAnalyticsPageProtected() {
  return (
    <ProtectedRoute allowedRole="admin">
      <AdminAnalyticsPage />
    </ProtectedRoute>
  );
}
