import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { inventoryService, warehousesService, productsService } from '../services/api';

const Inventory = () => {
  const { role } = useAuth();
  const [inventory, setInventory] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ warehouse_id: '', product_id: '', quantity: 0 });
  const [editingId, setEditingId] = useState(null);

  const canCreate = ['admin', 'supply_chain_manager', 'warehouse_manager'].includes(role);
  const canUpdate = ['admin', 'supply_chain_manager', 'warehouse_manager'].includes(role);
  const canDelete = role === 'admin';

  useEffect(() => {
    fetchInventory();
    fetchWarehouses();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      const data = await inventoryService.getAll();
      setInventory(data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
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
        warehouse_id: parseInt(formData.warehouse_id),
        product_id: parseInt(formData.product_id),
        quantity: parseInt(formData.quantity),
      };
      if (editingId) {
        await inventoryService.update(editingId, submitData);
      } else {
        await inventoryService.create(submitData);
      }
      fetchInventory();
      resetForm();
    } catch (error) {
      console.error('Error saving inventory:', error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory record?')) {
      try {
        await inventoryService.delete(id);
        fetchInventory();
      } catch (error) {
        console.error('Error deleting inventory:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({ warehouse_id: '', product_id: '', quantity: 0 });
    setShowForm(false);
    setEditingId(null);
  };

  const handleEdit = (item) => {
    setFormData({
      warehouse_id: item.warehouse_id.toString(),
      product_id: item.product_id.toString(),
      quantity: item.quantity.toString(),
    });
    setEditingId(item.inventory_id);
    setShowForm(true);
  };

  const getWarehouseName = (id) => warehouses.find(w => w.warehouse_id === id)?.name || id;
  const getProductName = (id) => products.find(p => p.product_id === id)?.name || id;

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Inventory</h1>
        {canCreate && (
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {showForm ? 'Cancel' : 'Add Inventory'}
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 p-6 bg-white rounded-lg shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
              <label className="block text-sm font-medium text-gray-700">Product</label>
              <select value={formData.product_id} onChange={(e) => setFormData({ ...formData, product_id: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required>
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.product_id} value={product.product_id}>{product.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Quantity</label>
              <input type="number" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} className="mt-1 block w-full px-3 py-2 border rounded-md" required />
            </div>
          </div>
          <button type="submit" className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
            {editingId ? 'Update' : 'Create'} Inventory
          </button>
        </form>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warehouse</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {inventory.map((item) => (
              <tr key={item.inventory_id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.inventory_id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getWarehouseName(item.warehouse_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{getProductName(item.product_id)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.quantity}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {canUpdate && <button onClick={() => handleEdit(item)} className="text-blue-600 hover:text-blue-900 mr-4">Edit</button>}
                  {canDelete && <button onClick={() => handleDelete(item.inventory_id)} className="text-red-600 hover:text-red-900">Delete</button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;