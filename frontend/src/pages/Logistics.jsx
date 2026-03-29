import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { logisticsService } from '../services/api';

const Logistics = () => {
  const { role } = useAuth();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    contact_email: '',
    phone: '',
    service_type: '',
  });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin', 'logistics_coordinator'].includes(role);
  const canUpdate = ['admin', 'logistics_coordinator'].includes(role);
  const canDelete = ['admin', 'logistics_coordinator'].includes(role);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const data = await logisticsService.getAll();
      setProviders(data);
    } catch (error) {
      console.error('Error fetching logistics providers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await logisticsService.update(editingId, formData);
      } else {
        await logisticsService.create(formData);
      }
      fetchProviders();
      resetForm();
    } catch (error) {
      console.error('Error saving logistics provider:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this logistics provider?')) {
      try {
        await logisticsService.delete(id);
        fetchProviders();
      } catch (error) {
        console.error('Error deleting logistics provider:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', contact_name: '', contact_email: '', phone: '', service_type: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (provider) => {
    setFormData(provider);
    setEditingId(provider.provider_id);
    setShowForm(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Logistics Providers</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Provider'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input type="text" value={formData.contact_name} onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Service Type</label>
              <input type="text" value={formData.service_type} onChange={(e) => setFormData({ ...formData, service_type: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" placeholder="e.g., Express Delivery, Air Freight, Ground Transport" />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Provider
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {providers.map((provider) => (
              <tr key={provider.provider_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.provider_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.contact_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.contact_email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{provider.service_type || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => handleEdit(provider)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(provider.provider_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Logistics;