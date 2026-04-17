import React, { useEffect, useState } from 'react';
import { dashboardAPI } from '../api/api';
import ReactApexChart from 'react-apexcharts';

interface AdminStats {
    total_customers: number;
    total_vendors: number;
    total_products: number;
    total_views: number;
    total_orders: number;
    total_revenue: number;
    total_invoices: number;
    incomplete_orders: number;
    completed_orders: number;
    last_updated_at: string;
}

const MarketplaceDashboard: React.FC = () => {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const res = await dashboardAPI.getStats();
            setStats(res.data.data);
        } catch {
            // Try refresh
            try {
                const res = await dashboardAPI.refreshStats();
                setStats(res.data.data);
            } catch { /* silent */ }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
        // Auto-refresh every hour
        const interval = setInterval(fetchStats, 60 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return (
        <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    const statCards = [
        { label: 'Total Customers', value: stats?.total_customers || 0, color: 'bg-blue-500', icon: '👥' },
        { label: 'Total Vendors', value: stats?.total_vendors || 0, color: 'bg-green-500', icon: '🏪' },
        { label: 'Total Products', value: stats?.total_products || 0, color: 'bg-purple-500', icon: '📦' },
        { label: 'Total Views', value: stats?.total_views || 0, color: 'bg-yellow-500', icon: '👁️' },
        { label: 'Total Orders', value: stats?.total_orders || 0, color: 'bg-indigo-500', icon: '🛒' },
        { label: 'Total Revenue', value: `KES ${(stats?.total_revenue || 0).toFixed(0)}`, color: 'bg-emerald-500', icon: '💰' },
        { label: 'Completed Orders', value: stats?.completed_orders || 0, color: 'bg-teal-500', icon: '✅' },
        { label: 'Pending Orders', value: stats?.incomplete_orders || 0, color: 'bg-orange-500', icon: '⏳' },
    ];

    const chartOptions = {
        chart: { type: 'bar' as const, toolbar: { show: false } },
        xaxis: { categories: ['Customers', 'Vendors', 'Products', 'Orders', 'Invoices'] },
        colors: ['#3B82F6'],
        plotOptions: { bar: { borderRadius: 4, horizontal: false } },
    };

    const chartSeries = [{
        name: 'Count',
        data: [
            stats?.total_customers || 0,
            stats?.total_vendors || 0,
            stats?.total_products || 0,
            stats?.total_orders || 0,
            stats?.total_invoices || 0,
        ],
    }];

    const orderChartOptions = {
        chart: { type: 'donut' as const },
        labels: ['Completed', 'Incomplete'],
        colors: ['#10B981', '#F59E0B'],
    };

    const orderSeries = [stats?.completed_orders || 0, stats?.incomplete_orders || 0];

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Dashboard</h1>
                <div className="flex items-center gap-3">
                    <p className="text-sm text-gray-500">
                        Last updated: {stats?.last_updated_at ? new Date(stats.last_updated_at).toLocaleString() : 'Never'}
                    </p>
                    <button
                        onClick={fetchStats}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
                    >
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-xl shadow p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">{card.label}</p>
                                <p className="text-2xl font-bold mt-1">{card.value}</p>
                            </div>
                            <span className="text-3xl">{card.icon}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-4">Platform Overview</h3>
                    <ReactApexChart options={chartOptions} series={chartSeries} type="bar" height={280} />
                </div>
                <div className="bg-white rounded-xl shadow p-4">
                    <h3 className="font-semibold mb-4">Orders Status</h3>
                    <ReactApexChart options={orderChartOptions} series={orderSeries} type="donut" height={280} />
                </div>
            </div>
        </div>
    );
};

export default MarketplaceDashboard;
