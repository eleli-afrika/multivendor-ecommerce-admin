import React, { useEffect, useState } from 'react';
import { adminPackagesAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Package {
    id: string;
    name: string;
    base_monthly_price: number;
    product_limit: number;
    can_appear_in_related: boolean;
    can_appear_on_landing: boolean;
    can_appear_in_sidebar: boolean;
    can_appear_as_promoted: boolean;
}

const AdminPackagesPage: React.FC = () => {
    const [packages, setPackages] = useState<Package[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editData, setEditData] = useState<Partial<Package>>({});

    const fetchPackages = () => {
        setLoading(true);
        adminPackagesAPI.getAll().then(res => {
            setPackages(res.data.data || []);
            setLoading(false);
        });
    };

    useEffect(() => { fetchPackages(); }, []);

    const handleEdit = (pkg: Package) => {
        setEditingId(pkg.id);
        setEditData({ ...pkg });
    };

    const handleSave = async () => {
        if (!editingId) return;
        try {
            await adminPackagesAPI.update(editingId, editData as Record<string, unknown>);
            toast.success('Package updated');
            setEditingId(null);
            fetchPackages();
        } catch { toast.error('Update failed'); }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Subscription Packages</h1>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {packages.map((pkg) => (
                        <div key={pkg.id} className="bg-white rounded-xl shadow p-6">
                            {editingId === pkg.id ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Package Name</label>
                                        <input
                                            value={editData.name || ''}
                                            onChange={e => setEditData({ ...editData, name: e.target.value })}
                                            className="w-full border rounded px-3 py-2 text-sm mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Monthly Price (KES)</label>
                                        <input
                                            type="number"
                                            value={editData.base_monthly_price || 0}
                                            onChange={e => setEditData({ ...editData, base_monthly_price: Number(e.target.value) })}
                                            className="w-full border rounded px-3 py-2 text-sm mt-1"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500">Product Limit (-1 = unlimited)</label>
                                        <input
                                            type="number"
                                            value={editData.product_limit || 0}
                                            onChange={e => setEditData({ ...editData, product_limit: Number(e.target.value) })}
                                            className="w-full border rounded px-3 py-2 text-sm mt-1"
                                        />
                                    </div>
                                    {(['can_appear_in_related', 'can_appear_on_landing', 'can_appear_in_sidebar', 'can_appear_as_promoted'] as const).map(field => (
                                        <label key={field} className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={!!(editData as Record<string, unknown>)[field]}
                                                onChange={e => setEditData({ ...editData, [field]: e.target.checked })}
                                            />
                                            {field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                        </label>
                                    ))}
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={handleSave} className="flex-1 bg-blue-600 text-white py-2 rounded text-sm">Save</button>
                                        <button onClick={() => setEditingId(null)} className="flex-1 border py-2 rounded text-sm">Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h3 className="font-bold text-lg">{pkg.name}</h3>
                                        <button onClick={() => handleEdit(pkg)} className="text-xs text-blue-600 hover:underline">Edit</button>
                                    </div>
                                    <p className="text-2xl font-bold text-blue-600 mb-3">KES {pkg.base_monthly_price}/mo</p>
                                    <p className="text-sm text-gray-500 mb-3">
                                        Products: {pkg.product_limit === -1 ? 'Unlimited' : pkg.product_limit}
                                    </p>
                                    <div className="space-y-1">
                                        {[
                                            { label: 'Appear in Related', value: pkg.can_appear_in_related },
                                            { label: 'Landing Page', value: pkg.can_appear_on_landing },
                                            { label: 'Sidebar', value: pkg.can_appear_in_sidebar },
                                            { label: 'Promoted', value: pkg.can_appear_as_promoted },
                                        ].map(item => (
                                            <div key={item.label} className="flex items-center gap-2 text-sm">
                                                <span className={item.value ? 'text-green-500' : 'text-gray-300'}>
                                                    {item.value ? '✓' : '✗'}
                                                </span>
                                                {item.label}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminPackagesPage;
