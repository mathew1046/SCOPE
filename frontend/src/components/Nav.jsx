import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Nav = () => {
  const { role, logout, isAuthenticated } = useAuth();

  const getMenuItems = () => {
    if (!isAuthenticated) return [];
    
    const items = {
      admin: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Suppliers', path: '/suppliers' },
        { title: 'Products', path: '/products' },
        { title: 'Warehouses', path: '/warehouses' },
        { title: 'Inventory', path: '/inventory' },
        { title: 'Customers', path: '/customers' },
        { title: 'Orders', path: '/orders' },
        { title: 'Shipments', path: '/shipments' },
        { title: 'Logistics', path: '/logistics' },
        { title: 'Tracking', path: '/tracking' },
      ],
      supply_chain_manager: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Suppliers', path: '/suppliers' },
        { title: 'Products', path: '/products' },
        { title: 'Warehouses', path: '/warehouses' },
        { title: 'Inventory', path: '/inventory' },
        { title: 'Orders', path: '/orders' },
      ],
      sales_manager: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Orders', path: '/orders' },
        { title: 'Customers', path: '/customers' },
        { title: 'Shipments', path: '/shipments' },
      ],
      warehouse_manager: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Inventory', path: '/inventory' },
        { title: 'Warehouses', path: '/warehouses' },
        { title: 'Shipments', path: '/shipments' },
        { title: 'Orders', path: '/orders' },
      ],
      logistics_coordinator: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Logistics', path: '/logistics' },
        { title: 'Tracking', path: '/tracking' },
        { title: 'Shipments', path: '/shipments' },
      ],
      customer_support: [
        { title: 'Dashboard', path: '/dashboard' },
        { title: 'Customers', path: '/customers' },
        { title: 'Orders', path: '/orders' },
        { title: 'Shipments', path: '/shipments' },
      ],
    };
    return items[role] || [];
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-white font-bold text-xl">LogiTrack</Link>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {getMenuItems().map((item, index) => (
                  <Link
                    key={index}
                    to={item.path}
                    className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-gray-300 text-sm mr-4">Role: {role}</span>
            <button
              onClick={logout}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Nav;