import React, { useEffect, useState } from 'react';
import { adminLocationsAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Location {
    id: string;
    region_name: string;
    created_at: string;
}

const AdminLocationsPage: React.FC = () => {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [newLocation, setNewLocation] = useState('');

    const fetchLocations = () => {
        setLoading(true);
        adminLocationsAPI.getAll().then(res => {
            setLocations(res.data.data || []);
            setLoading(false);
        });
    };

    useEffect(() => { fetchLocations(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLocation.trim()) return;
        try {
            await adminLocationsAPI.create(newLocation);
            toast.success('Location created');
            setNewLocation('');
            fetchLocations();
        } catch { toast.error('Failed to create location'); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this location?')) return;
        try {
            await adminLocationsAPI.delete(id);
            toast.success('Location deleted');
            fetchLocations();
        } catch { toast.error('Failed to delete location'); }
    };

    return (
        <div className="p-6 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Locations</h1>

            <form onSubmit={handleCreate} className="flex gap-3 mb-6">
                <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="Location name (e.g. Nairobi)"
                    className="flex-1 border rounded px-3 py-2 text-sm"
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                    Add Location
                </button>
            </form>

            {loading ? (
                <div className="flex justify-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="bg-white rounded-xl shadow overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="text-left px-4 py-3">Region Name</th>
                                <th className="text-left px-4 py-3">Created</th>
                                <th className="text-left px-4 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {locations.map((loc) => (
                                <tr key={loc.id} className="border-t hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">{loc.region_name}</td>
                                    <td className="px-4 py-3 text-gray-500">{new Date(loc.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleDelete(loc.id)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {locations.length === 0 && <p className="text-center py-10 text-gray-500">No locations found</p>}
                </div>
            )}
        </div>
    );
};

export default AdminLocationsPage;
