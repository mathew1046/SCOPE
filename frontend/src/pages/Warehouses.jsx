import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { warehousesService } from '../services/api';

const Warehouses = () => {
  const { role } = useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
  });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin', 'supply_chain_manager', 'warehouse_manager'].includes(role);
  const canUpdate = ['admin', 'supply_chain_manager', 'warehouse_manager'].includes(role);
  const canDelete = role === 'admin';

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const data = await warehousesService.getAll();
      setWarehouses(data);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
      };
      if (editingId) {
        await warehousesService.update(editingId, submitData);
      } else {
        await warehousesService.create(submitData);
      }
      fetchWarehouses();
      resetForm();
    } catch (error) {
      console.error('Error saving warehouse:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this warehouse?')) {
      try {
        await warehousesService.delete(id);
        fetchWarehouses();
      } catch (error) {
        console.error('Error deleting warehouse:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', location: '', capacity: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (warehouse) => {
    setFormData({
      ...warehouse,
      capacity: warehouse.capacity?.toString() || '',
    });
    setEditingId(warehouse.warehouse_id);
    setShowForm(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Warehouses</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Warehouse'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Capacity</label>
              <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Warehouse
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {warehouses.map((warehouse) => (
              <tr key={warehouse.warehouse_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.warehouse_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.location || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{warehouse.capacity || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => handleEdit(warehouse)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(warehouse.warehouse_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Warehouses;