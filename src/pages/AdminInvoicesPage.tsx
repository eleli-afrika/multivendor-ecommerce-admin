import React, { useEffect, useState } from 'react';
import { adminInvoicesAPI } from '../api/api';

interface Invoice {
    id: string;
    order_id: string;
    amount: number;
    payment_method: string;
    transaction_reference: string;
    status: string;
    created_at: string;
    order?: {
        id: string;
        total_amount: number;
        customer_id: string;
        vendor_id: string;
        order_status: string;
    };
}

const AdminInvoicesPage: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminInvoicesAPI.getAll().then(res => {
            setInvoices(res.data.data || []);
            setLoading(false);
        });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Invoices ({invoices.length})</h1>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3">Reference</th>
                                <th className="text-left px-4 py-3">Amount</th>
                                <th className="text-left px-4 py-3">Method</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-mono text-xs">{inv.transaction_reference?.slice(0, 16)}...</td>
                                    <td className="px-4 py-3 font-bold">KES {inv.amount.toFixed(0)}</td>
                                    <td className="px-4 py-3 capitalize">{inv.payment_method}</td>
                                    <td className="px-4 py-3">
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">{inv.status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {invoices.length === 0 && <p className="text-center py-10 text-gray-500">No invoices found</p>}
                </div>
            )}
        </div>
    );
};

export default AdminInvoicesPage;
