import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { customersService } from '../services/api';

const Customers = () => {
  const { role } = useAuth();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact_email: '',
    phone: '',
    address: '',
    country: '',
  });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin'].includes(role);
  const canUpdate = ['admin', 'customer_support'].includes(role);
  const canDelete = role === 'admin';

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const data = await customersService.getAll();
      setCustomers(data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await customersService.update(editingId, formData);
      } else {
        await customersService.create(formData);
      }
      fetchCustomers();
      resetForm();
    } catch (error) {
      console.error('Error saving customer:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await customersService.delete(id);
        fetchCustomers();
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: '', contact_email: '', phone: '', address: '', country: '' });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (customer) => {
    setFormData(customer);
    setEditingId(customer.customer_id);
    setShowForm(true);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Customers</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Customer'}
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
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" value={formData.contact_email} onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Country</label>
              <input type="text" value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Address</label>
              <input type="text" value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Customer
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Country</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {customers.map((customer) => (
              <tr key={customer.customer_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.customer_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.contact_email || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.phone || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{customer.country || '-'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => handleEdit(customer)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(customer.customer_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;