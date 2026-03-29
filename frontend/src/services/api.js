import axios from 'axios';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (username, password) => {
    const response = await api.post('/auth/login', { username, password });
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

export const suppliersService = {
  getAll: async () => {
    const response = await api.get('/suppliers');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/suppliers', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/suppliers/${id}`);
    return response.data;
  },
};

export const productsService = {
  getAll: async () => {
    const response = await api.get('/products');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/products', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  },
};

export const warehousesService = {
  getAll: async () => {
    const response = await api.get('/warehouses');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/warehouses/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/warehouses', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/warehouses/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/warehouses/${id}`);
    return response.data;
  },
};

export const inventoryService = {
  getAll: async () => {
    const response = await api.get('/inventory');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/inventory', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/inventory/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/inventory/${id}`);
    return response.data;
  },
};

export const customersService = {
  getAll: async () => {
    const response = await api.get('/customers');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/customers/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/customers', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/customers/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/customers/${id}`);
    return response.data;
  },
};

export const ordersService = {
  getAll: async () => {
    const response = await api.get('/orders');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/orders', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/orders/${id}`);
    return response.data;
  },
};

export const shipmentsService = {
  getAll: async () => {
    const response = await api.get('/shipments');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/shipments/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/shipments', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/shipments/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/shipments/${id}`);
    return response.data;
  },
};

export const logisticsService = {
  getAll: async () => {
    const response = await api.get('/logistics');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/logistics/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/logistics', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/logistics/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/logistics/${id}`);
    return response.data;
  },
};

export const trackingService = {
  getAll: async () => {
    const response = await api.get('/tracking');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/tracking/${id}`);
    return response.data;
  },
  create: async (data) => {
    const response = await api.post('/tracking', data);
    return response.data;
  },
  update: async (id, data) => {
    const response = await api.put(`/tracking/${id}`, data);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/tracking/${id}`);
    return response.data;
  },
};

export const analyticsService = {
  getOverview: async () => {
    const response = await api.get('/analytics/overview');
    return response.data;
  },
  getRevenueByCustomer: async () => {
    const response = await api.get('/analytics/revenue-by-customer');
    return response.data;
  },
  getOrdersByStatus: async () => {
    const response = await api.get('/analytics/orders-by-status');
    return response.data;
  },
  getInventoryByWarehouse: async () => {
    const response = await api.get('/analytics/inventory-by-warehouse');
    return response.data;
  },
  getTopProducts: async () => {
    const response = await api.get('/analytics/top-products');
    return response.data;
  },
  getShipmentsByProvider: async () => {
    const response = await api.get('/analytics/shipments-by-provider');
    return response.data;
  },
  getProductsBySupplier: async () => {
    const response = await api.get('/analytics/products-by-supplier');
    return response.data;
  },
};