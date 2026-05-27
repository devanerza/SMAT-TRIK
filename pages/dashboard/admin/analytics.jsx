import { useState, useEffect, useCallback } from 'react';
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

      const [ordersRes, servicesRes, teamsRes] = await Promise.all([
        fetch(`/api/orders?${params.toString()}`),
        fetch('/api/services'),
        fetch('/api/users'),
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
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <div className="flex gap-3">
          <div className="form-control">
            <input
              type="date"
              className="input input-bordered input-sm"
              value={dateStart}
              onChange={(e) => setDateStart(e.target.value)}
            />
          </div>
          <div className="form-control">
            <input
              type="date"
              className="input input-bordered input-sm"
              value={dateEnd}
              onChange={(e) => setDateEnd(e.target.value)}
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <span className="loading loading-spinner loading-lg text-primary" />
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

          <div className="card bg-base-100 border border-base-300">
            <div className="card-body">
              <h3 className="card-title text-lg">Pelanggan Berulang</h3>
              {repeatEntries.length === 0 ? (
                <p className="text-sm text-base-content/50 py-4">
                  Belum ada pelanggan berulang
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="table table-zebra">
                    <thead>
                      <tr>
                        <th>Identitas</th>
                        <th>Jumlah Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repeatEntries.map(([identifier, customerOrders]) => (
                        <tr key={identifier}>
                          <td className="font-medium text-sm">{identifier}</td>
                          <td>{customerOrders.length}</td>
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
