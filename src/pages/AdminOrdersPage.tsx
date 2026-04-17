import React, { useEffect, useState } from 'react';
import { adminOrdersAPI } from '../api/api';

interface Order {
    id: string;
    customer_id: string;
    vendor_id: string;
    order_status: string;
    payment_status: string;
    payment_method: string;
    total_amount: number;
    created_at: string;
}

const statusColors: Record<string, string> = {
    order_made: 'bg-blue-100 text-blue-800',
    order_received: 'bg-yellow-100 text-yellow-800',
    delivery_in_progress: 'bg-orange-100 text-orange-800',
    delivery_made: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
};

const AdminOrdersPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setLoading(true);
        adminOrdersAPI.getAll(page).then(res => {
            setOrders(res.data.data || []);
            setTotal(res.data.total || 0);
            setLoading(false);
        });
    }, [page]);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Orders ({total})</h1>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3">Order ID</th>
                                <th className="text-left px-4 py-3">Amount</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Payment</th>
                                <th className="text-left px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs">{order.id.slice(0, 12)}...</td>
                                    <td className="px-4 py-3 font-bold">KES {order.total_amount.toFixed(0)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${statusColors[order.order_status] || 'bg-gray-100'}`}>
                                            {order.order_status.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs capitalize ${order.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {orders.length === 0 && <p className="text-center py-10 text-gray-500">No orders found</p>}
                    <div className="flex justify-center p-4 gap-2">
                        {page > 1 && <button onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded text-sm">Previous</button>}
                        <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
                        {orders.length === 20 && <button onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded text-sm">Next</button>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminOrdersPage;
