import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { trackingService, shipmentsService, logisticsService } from '../services/api';

const Tracking = () => {
  const { role } = useAuth();
  const [trackings, setTrackings] = useState([]);
  const [shipments, setShipments] = useState([]);
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    shipment_id: '',
    provider_id: '',
    tracking_number: '',
    status: '',
  });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin', 'logistics_coordinator'].includes(role);
  const canUpdate = ['admin', 'logistics_coordinator'].includes(role);
  const canDelete = ['admin', 'logistics_coordinator'].includes(role);

  useEffect(() => {
    fetchTrackings();
    fetchShipments();
    fetchProviders();
  }, []);

  const fetchTrackings = async () => {
    try {
      const data = await trackingService.getAll();
      setTrackings(data);
    } catch (error) {
      console.error('Error fetching tracking:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchShipments = async () => {
    try {
      const data = await shipmentsService.getAll();
      setShipments(data);
    } catch (error) {
      console.error('Error fetching shipments:', error);
    }
  };

  const fetchProviders = async () => {
    try {
      const data = await logisticsService.getAll();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching providers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        shipment_id: parseInt(formData.shipment_id),
        provider_id: parseInt(formData.provider_id),
        tracking_number: formData.tracking_number,
        status: formData.status,
      };
      if (editingId) {
        await trackingService.update(editingId, submitData);
      } else {
        await trackingService.create(submitData);
      }
      fetchTrackings();
      resetForm();
    } catch (error) {
      console.error('Error saving tracking:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tracking record?')) {
      try {
        await trackingService.delete(id);
        fetchTrackings();
      } catch (error) {
        console.error('Error deleting tracking:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ shipment_id: '', provider_id: '', tracking_number: '', status: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (tracking) => {
    setFormData({
      shipment_id: tracking.shipment_id.toString(),
      provider_id: tracking.provider_id.toString(),
      tracking_number: tracking.tracking_number,
      status: tracking.status,
    });
    setEditingId(tracking.tracking_id);
    setShowForm(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shipment Tracking</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Tracking'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Shipment</label>
              <select value={formData.shipment_id} onChange={(e) => setFormData({ ...formData, shipment_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Shipment</option>
                {shipments.map((shipment) => (
                  <option key={shipment.shipment_id} value={shipment.shipment_id}>
                    Shipment #{shipment.shipment_id} - Order #{shipment.order_id}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Provider</label>
              <select value={formData.provider_id} onChange={(e) => setFormData({ ...formData, provider_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Provider</option>
                {providers.map((provider) => (
                  <option key={provider.provider_id} value={provider.provider_id}>{provider.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tracking Number</label>
              <input type="text" value={formData.tracking_number} onChange={(e) => setFormData({ ...formData, tracking_number: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Status</label>
              <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md">
                <option value="">Select Status</option>
                <option value="pending">Pending</option>
                <option value="in_transit">In Transit</option>
                <option value="out_for_delivery">Out for Delivery</option>
                <option value="delivered">Delivered</option>
                <option value="failed">Failed</option>
                <option value="returned">Returned</option>
              </select>
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Tracking
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Provider</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking #</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {trackings.map((tracking) => (
              <tr key={tracking.tracking_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tracking.tracking_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{tracking.shipment_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {providers.find(p => p.provider_id === tracking.provider_id)?.name || tracking.provider_id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">{tracking.tracking_number}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tracking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    tracking.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                    tracking.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-800' :
                    tracking.status === 'delivered' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {tracking.status || '-'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {tracking.updated_at ? new Date(tracking.updated_at).toLocaleString() : '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => handleEdit(tracking)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(tracking.tracking_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tracking;