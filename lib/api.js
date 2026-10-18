/**
 * @file api.js
 * @description Frontend API Client bridging Next.js to the dedicated backend service.
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * Universal fetch wrapper with authorization and error handling
 */
async function fetchApi(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sum_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }

  return await response.json();
}

// 1. Authentication Endpoints
export const authApi = {
  register: (userData) =>
    fetchApi('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  login: (email, password) =>
    fetchApi('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  googleLogin: (idToken) =>
    fetchApi('/auth/google', {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    }),

  getMe: () => fetchApi('/auth/me'),
};

// 2. Product Catalog Endpoints
export const productApi = {
  getProducts: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/products${query ? `?${query}` : ''}`);
  },

  getProductBySlug: (slug) => fetchApi(`/products/${slug}`),
};

// 3. Checkout & Payment Endpoints
export const checkoutApi = {
  initiateCheckout: (orderPayload) =>
    fetchApi('/checkout/initiate', {
      method: 'POST',
      body: JSON.stringify(orderPayload),
    }),

  getOrderDetails: (orderNumber) => fetchApi(`/checkout/order/${orderNumber}`),
};

// 4. CRM & Excel Data Export Endpoints
export const crmApi = {
  getCustomers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/crm/customers${query ? `?${query}` : ''}`);
  },

  getOrders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchApi(`/crm/orders${query ? `?${query}` : ''}`);
  },

  exportOrdersExcelUrl: () => `${API_BASE_URL}/export/orders/excel`,
  exportCustomersExcelUrl: () => `${API_BASE_URL}/export/customers/excel`,
};

// 5. Media Upload Endpoints (Cloudinary passthrough)
async function uploadFile(endpoint, file, fieldName) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('sum_token') : null;
  const formData = new FormData();
  formData.append(fieldName, file);

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Upload failed' }));
    throw new Error(errorData.message || `Upload failed (${response.status})`);
  }
  return response.json();
}

export const uploadApi = {
  uploadVideo: (file) => uploadFile('/upload/video', file, 'video'),
  uploadImage: (file) => uploadFile('/upload/image', file, 'image'),
  deleteMedia: (publicId, resourceType = 'image') =>
    fetchApi('/upload/delete', {
      method: 'POST',
      body: JSON.stringify({ publicId, resourceType }),
    }),
};
