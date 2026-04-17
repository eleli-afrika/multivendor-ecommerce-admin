import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const adminApiClient = axios.create({
    baseURL: API_URL,
    headers: { 'Content-Type': 'application/json' },
});

adminApiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('adminToken');
        if (token && token !== 'undefined' && token !== 'null') {
            config.headers['x-access-token'] = token;
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ===================== AUTH =====================
export const adminAuthAPI = {
    login: (data: { email: string; password: string }) =>
        adminApiClient.post('/auth/admin/login', data),
};

// ===================== DASHBOARD =====================
export const dashboardAPI = {
    getStats: () => adminApiClient.get('/admin/dashboard'),
    refreshStats: () => adminApiClient.post('/admin/stats/refresh'),
};

// ===================== USERS =====================
export const adminUsersAPI = {
    getAll: (page = 1, limit = 20) =>
        adminApiClient.get(`/admin/users?page=${page}&limit=${limit}`),
    deactivate: (id: string) => adminApiClient.post(`/admin/users/${id}/deactivate`),
};

// ===================== VENDORS =====================
export const adminVendorsAPI = {
    getAll: (page = 1, limit = 20) =>
        adminApiClient.get(`/admin/vendors?page=${page}&limit=${limit}`),
    getPending: () => adminApiClient.get('/admin/vendors/pending'),
    approve: (id: string) => adminApiClient.post(`/admin/vendors/${id}/approve`),
    reject: (id: string, reason: string) =>
        adminApiClient.post(`/admin/vendors/${id}/reject`, { reason }),
    deactivate: (id: string, reason: string) =>
        adminApiClient.post(`/admin/vendors/${id}/deactivate`, { reason }),
};

// ===================== PRODUCTS =====================
export const adminProductsAPI = {
    getAll: (page = 1, limit = 20) =>
        adminApiClient.get(`/admin/products?page=${page}&limit=${limit}`),
    highlight: (id: string) => adminApiClient.post(`/admin/products/${id}/highlight`),
    removeHighlight: (id: string) => adminApiClient.post(`/admin/products/${id}/remove-highlight`),
    promote: (id: string) => adminApiClient.post(`/admin/products/${id}/promote`),
    removePromote: (id: string) => adminApiClient.post(`/admin/products/${id}/remove-promote`),
};

// ===================== ORDERS =====================
export const adminOrdersAPI = {
    getAll: (page = 1, limit = 20) =>
        adminApiClient.get(`/admin/orders?page=${page}&limit=${limit}`),
};

// ===================== INVOICES =====================
export const adminInvoicesAPI = {
    getAll: () => adminApiClient.get('/admin/invoices'),
};

// ===================== REVIEWS =====================
export const adminReviewsAPI = {
    getAll: () => adminApiClient.get('/admin/reviews'),
    hide: (id: string) => adminApiClient.post(`/admin/reviews/${id}/hide`),
    unhide: (id: string) => adminApiClient.post(`/admin/reviews/${id}/unhide`),
};

// ===================== PACKAGES =====================
export const adminPackagesAPI = {
    getAll: () => adminApiClient.get('/admin/packages'),
    create: (data: Record<string, unknown>) => adminApiClient.post('/admin/packages', data),
    update: (id: string, data: Record<string, unknown>) =>
        adminApiClient.put(`/admin/packages/${id}`, data),
};

// ===================== LOCATIONS =====================
export const adminLocationsAPI = {
    getAll: () => adminApiClient.get('/admin/locations'),
    create: (regionName: string) =>
        adminApiClient.post('/admin/locations', { region_name: regionName }),
    delete: (id: string) => adminApiClient.delete(`/admin/locations/${id}`),
};

// ===================== CHAT =====================
export const adminChatAPI = {
    getAll: () => adminApiClient.get('/admin/chat'),
    getMessages: (convId: string) =>
        adminApiClient.get(`/chat/conversations/${convId}/messages`),
};
