import React, { useEffect, useState } from 'react';
import { adminVendorsAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Vendor {
    id: string;
    shop_name: string;
    user_id: string;
    is_approved: boolean;
    is_deactivated_vendor_only: boolean;
    deactivation_reason: string;
    approval_date: string | null;
    created_at: string;
}

const VendorsPage: React.FC = () => {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [pending, setPending] = useState<Vendor[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<'all' | 'pending'>('pending');
    const [rejectModal, setRejectModal] = useState<{ id: string; type: 'reject' | 'deactivate' } | null>(null);
    const [reason, setReason] = useState('');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [allRes, pendingRes] = await Promise.all([
                adminVendorsAPI.getAll(),
                adminVendorsAPI.getPending(),
            ]);
            setVendors(allRes.data.data || []);
            setPending(pendingRes.data.data || []);
        } catch { /* silent */ }
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleApprove = async (id: string) => {
        try {
            await adminVendorsAPI.approve(id);
            toast.success('Vendor approved!');
            fetchData();
        } catch { toast.error('Failed to approve'); }
    };

    const handleAction = async () => {
        if (!rejectModal || !reason) return;
        try {
            if (rejectModal.type === 'reject') {
                await adminVendorsAPI.reject(rejectModal.id, reason);
                toast.success('Vendor rejected');
            } else {
                await adminVendorsAPI.deactivate(rejectModal.id, reason);
                toast.success('Vendor deactivated');
            }
            setRejectModal(null);
            setReason('');
            fetchData();
        } catch { toast.error('Action failed'); }
    };

    const displayVendors = tab === 'pending' ? pending : vendors;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Vendors</h1>

            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setTab('pending')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    Pending ({pending.length})
                </button>
                <button
                    onClick={() => setTab('all')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === 'all' ? 'bg-blue-600 text-white' : 'bg-white border'}`}
                >
                    All Vendors ({vendors.length})
                </button>
            </div>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3">Shop Name</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Joined</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayVendors.map((vendor) => (
                                <tr key={vendor.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{vendor.shop_name}</td>
                                    <td className="px-4 py-3">
                                        {vendor.is_deactivated_vendor_only ? (
                                            <span className="px-2 py-1 rounded-full text-xs bg-red-100 text-red-800">Deactivated</span>
                                        ) : vendor.is_approved ? (
                                            <span className="px-2 py-1 rounded-full text-xs bg-green-100 text-green-800">Approved</span>
                                        ) : (
                                            <span className="px-2 py-1 rounded-full text-xs bg-yellow-100 text-yellow-800">Pending</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(vendor.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            {!vendor.is_approved && !vendor.is_deactivated_vendor_only && (
                                                <>
                                                    <button
                                                        onClick={() => handleApprove(vendor.id)}
                                                        className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => setRejectModal({ id: vendor.id, type: 'reject' })}
                                                        className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            )}
                                            {vendor.is_approved && !vendor.is_deactivated_vendor_only && (
                                                <button
                                                    onClick={() => setRejectModal({ id: vendor.id, type: 'deactivate' })}
                                                    className="text-xs bg-orange-600 text-white px-3 py-1 rounded hover:bg-orange-700"
                                                >
                                                    Deactivate
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {displayVendors.length === 0 && (
                        <p className="text-center py-10 text-gray-500">No vendors found</p>
                    )}
                </div>
            )}

            {/* Reject/Deactivate Modal */}
            {rejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 w-full max-w-md">
                        <h3 className="font-bold text-lg mb-4">
                            {rejectModal.type === 'reject' ? 'Reject Vendor' : 'Deactivate Vendor'}
                        </h3>
                        <label className="block text-sm font-medium mb-2">Reason</label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded px-3 py-2 text-sm"
                            rows={3}
                            placeholder="Enter reason..."
                        />
                        <div className="flex gap-3 mt-4">
                            <button
                                onClick={handleAction}
                                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm hover:bg-red-700"
                            >
                                Confirm
                            </button>
                            <button
                                onClick={() => { setRejectModal(null); setReason(''); }}
                                className="flex-1 border py-2 rounded-lg text-sm hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VendorsPage;
