import React, { useEffect, useState } from 'react';
import { adminReviewsAPI } from '../api/api';
import { toast } from 'react-toastify';

interface Review {
    id: string;
    reviewer_id: string;
    vendor_id: string;
    product_id: string | null;
    rating: number;
    comment: string;
    is_hidden_by_admin: boolean;
    created_at: string;
}

const AdminReviewsPage: React.FC = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = () => {
        setLoading(true);
        adminReviewsAPI.getAll().then(res => {
            setReviews(res.data.data || []);
            setLoading(false);
        });
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleToggle = async (id: string, isHidden: boolean) => {
        try {
            if (isHidden) {
                await adminReviewsAPI.unhide(id);
            } else {
                await adminReviewsAPI.hide(id);
            }
            toast.success(isHidden ? 'Review unhidden' : 'Review hidden');
            fetchReviews();
        } catch { toast.error('Action failed'); }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Reviews</h1>

            {loading ? (
                <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>
            ) : (
                <div className="space-y-4">
                    {reviews.map((review) => (
                        <div key={review.id} className={`bg-white rounded-xl shadow p-4 ${review.is_hidden_by_admin ? 'opacity-60' : ''}`}>
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <span key={s}>{s <= review.rating ? '★' : '☆'}</span>
                                            ))}
                                        </div>
                                        <span className="text-gray-500 text-sm">({review.rating}/5)</span>
                                        {review.is_hidden_by_admin && (
                                            <span className="text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded">Hidden</span>
                                        )}
                                    </div>
                                    <p className="text-sm">{review.comment}</p>
                                    <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleString()}</p>
                                </div>
                                <button
                                    onClick={() => handleToggle(review.id, review.is_hidden_by_admin)}
                                    className={`text-xs px-3 py-1 rounded ${review.is_hidden_by_admin ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}
                                >
                                    {review.is_hidden_by_admin ? 'Unhide' : 'Hide'}
                                </button>
                            </div>
                        </div>
                    ))}
                    {reviews.length === 0 && <p className="text-center py-10 text-gray-500">No reviews found</p>}
                </div>
            )}
        </div>
    );
};

export default AdminReviewsPage;
