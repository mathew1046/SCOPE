import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { suppliersService } from '../services/api';

const Suppliers = () => {
  const { role } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_name: '',
    contact_email: '',
    phone: '',
    address: '',
    country: '',
  });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin', 'supply_chain_manager'].includes(role);
  const canUpdate = ['admin', 'supply_chain_manager'].includes(role);
  const canDelete = role === 'admin';

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const data = await suppliersService.getAll();
      setSuppliers(data);
    } catch (error) {
      console.error('Error fetching suppliers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await suppliersService.update(editingId, formData);
      } else {
        await suppliersService.create(formData);
      }
      fetchSuppliers();
      resetForm();
    } catch (error) {
      console.error('Error saving supplier:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      try {
        await suppliersService.delete(id);
        fetchSuppliers();
      } catch (error) {
        console.error('Error deleting supplier:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      contact_name: '',
      contact_email: '',
      phone: '',
      address: '',
      country: '',
    });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (supplier) => {
    setFormData(supplier);
    setEditingId(supplier.supplier_id);
    setShowForm(true);
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Suppliers</h1>
        {canCreate && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {showForm ? 'Cancel' : 'Add Supplier'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Name</label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Contact Email</label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="mt-1 block w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Supplier
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {suppliers.map((supplier) => (
              <tr key={supplier.supplier_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.supplier_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.contact_name || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.contact_email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{supplier.country || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && (
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Edit
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDelete(supplier.supplier_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Suppliers;