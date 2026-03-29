import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ordersService, customersService, productsService } from '../services/api';

const Orders = () => {
  const { role } = useAuth();
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    customer_id: '',
    status: 'pending',
    items: [{ product_id: '', quantity: 1, unit_price: '' }],
  });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin', 'sales_manager'].includes(role);
  const canUpdate = ['admin', 'sales_manager'].includes(role);
  const canDelete = role === 'admin';

  useEffect(() => {
    fetchOrders();
    fetchCustomers();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await ordersService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await customersService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const data = await productsService.getAll();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        customer_id: parseInt(formData.customer_id),
        status: formData.status,
        items: formData.items.map(item => ({
          product_id: parseInt(item.product_id),
          quantity: parseInt(item.quantity),
          unit_price: parseFloat(item.unit_price),
        })),
      };
      if (editingId) {
        await ordersService.update(editingId, { status: formData.status });
      } else {
        await ordersService.create(submitData);
      }
      fetchOrders();
      resetForm();
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        await ordersService.delete(id);
        fetchOrders();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      customer_id: '',
      status: 'pending',
      items: [{ product_id: '', quantity: 1, unit_price: '' }],
    });
    setShowForm(false);
    setEditingId(null);
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { product_id: '', quantity: 1, unit_price: '' }],
    });
  };

  const removeItem = (index) => {
    setFormData({
      ...formData,
      items: formData.items.filter((_, i) => i !== index),
    });
  };

  const updateItem = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const getCustomerName = (id) => customers.find(c => c.customer_id === id)?.name || id;

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Order'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Customer</label>
              <select value={formData.customer_id} onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Customer</option>
                {customers.map((customer) => (
                  <option key={customer.customer_id} value={customer.customer_id}>{customer.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md">
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Order Items</label>
            {formData.items.map((item, index) => (
              <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                <select value={item.product_id} onChange={(e) => updateItem(index, 'product_id', e.target.value)} className="px-3 py-2 border rounded-md" required>
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option key={product.product_id} value={product.product_id}>{product.name}</option>
                  ))}
                </select>
                <input type="number" placeholder="Quantity" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} className="px-3 py-2 border rounded-md" min="1" required />
                <input type="number" placeholder="Unit Price" value={item.unit_price} onChange={(e) => updateItem(index, 'unit_price', e.target.value)} className="px-3 py-2 border rounded-md" step="0.01" required />
                {formData.items.length > 1 && (
                  <button type="button" onClick={() => removeItem(index)} className="px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">Remove</button>
                )}
              </div>
            ))}
            <button type="button" onClick={addItem} className="mt-2 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Add Item</button>
          </div>

          <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Order
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.order_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.order_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getCustomerName(order.customer_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(order.order_date).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                    order.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total_amount || '0.00'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => { setEditingId(order.order_id); setFormData({ ...formData, status: order.status }); setShowForm(true); }} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(order.order_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;