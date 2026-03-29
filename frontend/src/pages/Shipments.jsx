import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { shipmentsService, ordersService, warehousesService } from '../services/api';

const Shipments = () => {
  const { role } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    order_id: '',
    warehouse_id: '',
    status: 'pending',
    shipped_date: '',
    delivery_date: '',
  });
  const [editingId, setEditingId] = useState(null);

const canCreate = ['admin', 'warehouse_manager', 'logistics_coordinator'].includes(role);
const canUpdate = ['admin', 'warehouse_manager', 'logistics_coordinator'].includes(role);
const canDelete = ['admin', 'logistics_coordinator'].includes(role);

  useEffect(() => {
    fetchShipments();
    fetchOrders();
    fetchWarehouses();
  }, []);

  const fetchShipments = async () => {
    try {
      const data = await shipmentsService.getAll();
      setShipments(data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const data = await ordersService.getAll();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchWarehouses = async () => {
    try {
      const data = await warehousesService.getAll();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        order_id: parseInt(formData.order_id),
        warehouse_id: parseInt(formData.warehouse_id),
        status: formData.status,
        shipped_date: formData.shipped_date || null,
        delivery_date: formData.delivery_date || null,
      };
      if (editingId) {
        await shipmentsService.update(editingId, submitData);
      } else {
        await shipmentsService.create(submitData);
      }
      fetchShipments();
      resetForm();
    } catch (error) {
      console.error('Error saving shipment:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this shipment?')) {
      try {
        await shipmentsService.delete(id);
        fetchShipments();
      } catch (error) {
        console.error('Error deleting shipment:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ order_id: '', warehouse_id: '', status: 'pending', shipped_date: '', delivery_date: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (shipment) => {
    setFormData({
      order_id: shipment.order_id.toString(),
      warehouse_id: shipment.warehouse_id.toString(),
      status: shipment.status,
      shipped_date: shipment.shipped_date ? shipment.shipped_date.slice(0, 10) : '',
      delivery_date: shipment.delivery_date ? shipment.delivery_date.slice(0, 10) : '',
    });
    setEditingId(shipment.shipment_id);
    setShowForm(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipments</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Shipment'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <select value={formData.order_id} onChange={(e) => setFormData({ ...formData, order_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Order</option>
                {orders.map((order) => (
                  <option key={order.order_id} value={order.order_id}>Order #{order.order_id}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Warehouse</label>
              <select value={formData.warehouse_id} onChange={(e) => setFormData({ ...formData, warehouse_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Warehouse</option>
                {warehouses.map((warehouse) => (
                  <option key={warehouse.warehouse_id} value={warehouse.warehouse_id}>{warehouse.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md">
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipped Date</label>
              <input type="date" value={formData.shipped_date} onChange={(e) => setFormData({ ...formData, shipped_date: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Delivery Date</label>
              <input type="date" value={formData.delivery_date} onChange={(e) => setFormData({ ...formData, delivery_date: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Shipment
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipped Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {shipments.map((shipment) => (
              <tr key={shipment.shipment_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.shipment_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{shipment.order_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {warehouses.find(w => w.warehouse_id === shipment.warehouse_id)?.name || shipment.warehouse_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    shipment.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                    shipment.status === 'shipped' ? 'bg-purple-100 text-purple-800' :
                    shipment.status === 'in_transit' ? 'bg-indigo-100 text-indigo-800' :
                    shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {shipment.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {shipment.shipped_date ? new Date(shipment.shipped_date).toLocaleDateString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => handleEdit(shipment)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(shipment.shipment_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Shipments;