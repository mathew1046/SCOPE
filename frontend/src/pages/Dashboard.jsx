import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { analyticsService } from '../services/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, ComposedChart, Area
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const Dashboard = () => {
  const { role } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [revenueByCustomer, setRevenueByCustomer] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState([]);
  const [inventoryByWarehouse, setInventoryByWarehouse] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [shipmentsByProvider, setShipmentsByProvider] = useState([]);
  const [productsBySupplier, setProductsBySupplier] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [
          overviewData,
          revenueData,
          ordersData,
          inventoryData,
          productsData,
          shipmentsData,
          supplierData,
        ] = await Promise.all([
          analyticsService.getOverview(),
          analyticsService.getRevenueByCustomer(),
          analyticsService.getOrdersByStatus(),
          analyticsService.getInventoryByWarehouse(),
          analyticsService.getTopProducts(),
          analyticsService.getShipmentsByProvider(),
          analyticsService.getProductsBySupplier(),
        ]);
        
        setOverview(overviewData);
        setRevenueByCustomer(revenueData);
        setOrdersByStatus(ordersData);
        setInventoryByWarehouse(inventoryData);
        setTopProducts(productsData);
        setShipmentsByProvider(shipmentsData);
        setProductsBySupplier(supplierData);
      } catch (err) {
        setError('Failed to load analytics data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getMenuItems = () => {
    const items = {
      admin: [
        { title: 'Suppliers', path: '/suppliers', icon: '📦' },
        { title: 'Products', path: '/products', icon: '🏷️' },
        { title: 'Warehouses', path: '/warehouses', icon: '🏭' },
        { title: 'Inventory', path: '/inventory', icon: '📊' },
        { title: 'Customers', path: '/customers', icon: '👥' },
        { title: 'Orders', path: '/orders', icon: '📝' },
        { title: 'Shipments', path: '/shipments', icon: '🚚' },
        { title: 'Logistics Providers', path: '/logistics', icon: '🚁' },
        { title: 'Shipment Tracking', path: '/tracking', icon: '📍' },
      ],
      supply_chain_manager: [
        { title: 'Suppliers', path: '/suppliers', icon: '📦' },
        { title: 'Products', path: '/products', icon: '🏷️' },
        { title: 'Warehouses', path: '/warehouses', icon: '🏭' },
        { title: 'Inventory', path: '/inventory', icon: '📊' },
        { title: 'Orders (View)', path: '/orders', icon: '📝' },
      ],
      sales_manager: [
        { title: 'Orders', path: '/orders', icon: '📝' },
        { title: 'Customers (View)', path: '/customers', icon: '👥' },
        { title: 'Shipments (View)', path: '/shipments', icon: '🚚' },
      ],
      warehouse_manager: [
        { title: 'Inventory', path: '/inventory', icon: '📊' },
        { title: 'Warehouses', path: '/warehouses', icon: '🏭' },
        { title: 'Shipments', path: '/shipments', icon: '🚚' },
        { title: 'Orders (View)', path: '/orders', icon: '📝' },
      ],
      logistics_coordinator: [
        { title: 'Logistics Providers', path: '/logistics', icon: '🚁' },
        { title: 'Shipment Tracking', path: '/tracking', icon: '📍' },
        { title: 'Shipments (View)', path: '/shipments', icon: '🚚' },
      ],
      customer_support: [
        { title: 'Customers', path: '/customers', icon: '👥' },
        { title: 'Orders (View)', path: '/orders', icon: '📝' },
        { title: 'Shipments (View)', path: '/shipments', icon: '🚚' },
      ],
    };
    return items[role] || [];
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-600">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-700 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      
      <div className="mb-4 p-4 bg-blue-50 rounded-lg">
        <p className="text-sm text-gray-600">Logged in as: <span className="font-semibold">{role}</span></p>
      </div>

      {/* Overview Stats */}
      {overview && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-blue-600">{overview.total_orders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Customers</p>
            <p className="text-2xl font-bold text-green-600">{overview.total_customers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Products</p>
            <p className="text-2xl font-bold text-purple-600">{overview.total_products}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Suppliers</p>
            <p className="text-2xl font-bold text-orange-600">{overview.total_suppliers}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Warehouses</p>
            <p className="text-2xl font-bold text-cyan-600">{overview.total_warehouses}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(overview.total_revenue)}</p>
          </div>
        </div>
      )}

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Orders by Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Orders by Status</h2>
          {ordersByStatus.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  dataKey="count"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ status, count }) => `${status}: ${count}`}
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>

        {/* Revenue by Customer */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Customers by Revenue</h2>
          {revenueByCustomer.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCustomer} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(v) => `$${v/1000}k`} />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Inventory by Warehouse */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Inventory by Warehouse</h2>
          {inventoryByWarehouse.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={inventoryByWarehouse}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="warehouse" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="quantity" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>

        {/* Top Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Top Products by Orders</h2>
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="product" type="category" width={150} tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="quantity" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Charts Row 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Shipments by Provider */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Shipments by Logistics Provider</h2>
          {shipmentsByProvider.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={shipmentsByProvider}
                  dataKey="count"
                  nameKey="provider"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ provider, count }) => `${provider}: ${count}`}
                >
                  {shipmentsByProvider.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>

        {/* Products by Supplier */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Products by Supplier</h2>
          {productsBySupplier.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={productsBySupplier}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="supplier" tick={{ fontSize: 10 }} angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#F59E0B" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-400">No data available</div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <h2 className="text-xl font-semibold mb-4">Quick Links</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {getMenuItems().map((item, index) => (
          <a
            key={index}
            href={item.path}
            className="block p-6 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="text-3xl mb-2">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;