// Global API Client for Frontend

const API_BASE = '/api';

export function getAuthToken() {
    return localStorage.getItem('gst_admin_token') || '';
}

export function setAuthToken(token) {
    if (token) {
        localStorage.setItem('gst_admin_token', token);
    } else {
        localStorage.removeItem('gst_admin_token');
    }
}

async function request(endpoint, options = {}) {
    const headers = options.headers || {};
    const token = getAuthToken();

    if (token && !headers['Authorization']) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if (!(options.body instanceof FormData) && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const config = {
        ...options,
        headers
    };

    const res = await fetch(`${API_BASE}${endpoint}`, config);
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        const error = new Error(data.error || `Request failed with status ${res.status}`);
        error.status = res.status;
        error.data = data;
        throw error;
    }

    return data;
}

export const api = {
    // Categories
    getCategories: (all = false) => request(`/categories${all ? '?all=true' : ''}`),
    getCategory: (slug) => request(`/categories/${slug}`),
    createCategory: (data) => request('/categories', { method: 'POST', body: JSON.stringify(data) }),
    updateCategory: (id, data) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteCategory: (id) => request(`/categories/${id}`, { method: 'DELETE' }),

    // Products
    getProducts: (params = {}) => {
        const qs = new URLSearchParams();
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') {
                qs.append(k, v);
            }
        });
        return request(`/products?${qs.toString()}`);
    },
    getProduct: (identifier) => request(`/products/${identifier}`),
    createProduct: (data) => request('/products', { method: 'POST', body: JSON.stringify(data) }),
    updateProduct: (id, data) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    duplicateProduct: (id) => request(`/products/${id}/duplicate`, { method: 'POST' }),
    deleteProduct: (id) => request(`/products/${id}`, { method: 'DELETE' }),

    // Upload
    uploadImage: (file) => {
        const formData = new FormData();
        formData.append('image', file);
        return request('/upload', { method: 'POST', body: formData });
    },

    // Orders
    submitOrder: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getOrders: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/orders?${qs}`);
    },
    getOrder: (identifier) => request(`/orders/${identifier}`),
    updateOrderStatus: (id, status, notes) => request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status, notes }) }),
    updateOrderNotes: (id, internal_notes) => request(`/orders/${id}/notes`, { method: 'PUT', body: JSON.stringify({ internal_notes }) }),
    deleteOrder: (id) => request(`/orders/${id}`, { method: 'DELETE' }),

    // Inquiries
    submitInquiry: (data) => request('/inquiries', { method: 'POST', body: JSON.stringify(data) }),
    getInquiries: (params = {}) => {
        const qs = new URLSearchParams(params).toString();
        return request(`/inquiries?${qs}`);
    },
    getInquiry: (id) => request(`/inquiries/${id}`),
    updateInquiry: (id, data) => request(`/inquiries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteInquiry: (id) => request(`/inquiries/${id}`, { method: 'DELETE' }),

    // Content & Stats
    getContent: () => request('/content'),
    updateContent: (settings) => request('/content', { method: 'PUT', body: JSON.stringify({ settings }) }),
    getDashboardStats: () => request('/content/dashboard-stats'),

    // Auth
    login: (username, password) => request('/auth/login', { method: 'POST', body: JSON.stringify({ username, password }) }),
    getMe: () => request('/auth/me'),
    updateProfile: (data) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),

    // Image Upload & Automatic Optimization
    uploadImage: (file, type = 'product') => {
        const formData = new FormData();
        formData.append('image', file);
        const token = getToken();
        return fetch(`${API_BASE}/upload?type=${type}`, {
            method: 'POST',
            headers: token ? { Authorization: `Bearer ${token}` } : {},
            body: formData
        }).then(async res => {
            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || 'Upload failed');
            }
            return res.json();
        });
    }
};
