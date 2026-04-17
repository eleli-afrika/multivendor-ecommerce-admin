import React, { useEffect, useState } from 'react';
import { adminUsersAPI } from '../api/api';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

interface User {
    id: string;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    is_deactivated: boolean;
    created_at: string;
    location?: { region_name: string };
}

const AdminUsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    const fetchUsers = () => {
        setLoading(true);
        adminUsersAPI.getAll(page).then(res => {
            setUsers(res.data.data || []);
            setTotal(res.data.total || 0);
            setLoading(false);
        });
    };

    useEffect(() => { fetchUsers(); }, [page]);

    const handleDeactivate = async (id: string) => {
        if (!confirm('Deactivate this user?')) return;
        try {
            await adminUsersAPI.deactivate(id);
            toast.success('User deactivated');
            fetchUsers();
        } catch { toast.error('Failed to deactivate'); }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Users ({total})</h1>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3">Name</th>
                                <th className="text-left px-4 py-3">Email</th>
                                <th className="text-left px-4 py-3">Phone</th>
                                <th className="text-left px-4 py-3">Location</th>
                                <th className="text-left px-4 py-3">Status</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <Link to={`/users/${user.id}`} className="font-medium hover:text-blue-600">
                                            {user.first_name} {user.last_name}
                                        </Link>
                                        <p className="text-xs text-gray-400">@{user.username}</p>
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">{user.email}</td>
                                    <td className="px-4 py-3 text-gray-600">{user.phone || '—'}</td>
                                    <td className="px-4 py-3 text-gray-500">{user.location?.region_name || '—'}</td>
                                    <td className="px-4 py-3">
                                        <span className={`text-xs px-2 py-1 rounded-full ${user.is_deactivated ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                            {user.is_deactivated ? 'Deactivated' : 'Active'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {!user.is_deactivated && (
                                            <button
                                                onClick={() => handleDeactivate(user.id)}
                                                className="text-xs text-red-600 hover:underline"
                                            >
                                                Deactivate
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {users.length === 0 && <p className="text-center py-10 text-gray-500">No users found</p>}
                    <div className="flex justify-center p-4 gap-2">
                        {page > 1 && <button onClick={() => setPage(page - 1)} className="px-4 py-2 border rounded text-sm">Previous</button>}
                        <span className="px-4 py-2 text-sm text-gray-600">Page {page}</span>
                        {users.length === 20 && <button onClick={() => setPage(page + 1)} className="px-4 py-2 border rounded text-sm">Next</button>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsersPage;
