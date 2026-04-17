import React, { useEffect, useState } from 'react';
import { adminProductsAPI } from '../api/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface Product {
    id: string;
    name: string;
    price: number;
    discount: number;
    is_active: boolean;
    is_highlighted: boolean;
    is_promoted: boolean;
    views_count: number;
    purchases_count: number;
    vendor?: { shop_name: string };
    created_at: string;
}

const AdminProductsPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await adminProductsAPI.getAll(page);
            setProducts(res.data.data || []);
            setTotal(res.data.total || 0);
        } catch { /* silent */ }
        setLoading(false);
    };

    useEffect(() => { fetchProducts(); }, [page]);

    const handleAction = async (id: string, action: string) => {
        try {
            switch (action) {
                case 'highlight': await adminProductsAPI.highlight(id); break;
                case 'remove-highlight': await adminProductsAPI.removeHighlight(id); break;
                case 'promote': await adminProductsAPI.promote(id); break;
                case 'remove-promote': await adminProductsAPI.removePromote(id); break;
            }
            toast.success('Action completed');
            fetchProducts();
        } catch { toast.error('Action failed'); }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Products / Ads ({total})</h1>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3">Product</th>
                                <th className="text-left px-4 py-3">Vendor</th>
                                <th className="text-left px-4 py-3">Price</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((product) => (
                                <tr key={product.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <Link to={`/ads/${product.id}`} className="font-medium hover:text-blue-600">
                                            {product.name}
                                        </Link>
                                        <div className="flex gap-1 mt-1">
                                            {!product.is_active && (
                                                <span className="text-xs bg-red-100 text-red-800 px-1 rounded">Inactive</span>
                                            )}
                                            {product.is_highlighted && (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-1 rounded">Highlighted</span>
                                            )}
                                            {product.is_promoted && (
                                                <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded">Promoted</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{product.vendor?.shop_name || 'N/A'}</td>
                                    <td className="px-4 py-3">KES {product.price}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex flex-wrap gap-1">
                                            <button
                                                onClick={() => handleAction(product.id, product.is_highlighted ? 'remove-highlight' : 'highlight')}
                                                className={`text-xs px-2 py-1 rounded ${product.is_highlighted ? 'bg-blue-100 text-blue-700 hover:bg-blue-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                {product.is_highlighted ? 'Remove Highlight' : 'Highlight'}
                                            </button>
                                            <button
                                                onClick={() => handleAction(product.id, product.is_promoted ? 'remove-promote' : 'promote')}
                                                className={`text-xs px-2 py-1 rounded ${product.is_promoted ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                                            >
                                                {product.is_promoted ? 'Remove Promo' : 'Promote'}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {products.length === 0 && <p className="text-center py-10 text-gray-500">No products found</p>}

                    {/* Pagination */}
                    <div className="flex justify-center p-4 gap-2">
                        {page > 1 && (
                            <button onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Previous</button>
                        )}
                        <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
                        {products.length === 20 && (
                            <button onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded hover:bg-gray-50 text-sm">Next</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminProductsPage;
