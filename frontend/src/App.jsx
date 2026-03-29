import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Nav from './components/Nav';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Suppliers from './pages/Suppliers';
import Products from './pages/Products';
import Warehouses from './pages/Warehouses';
import Inventory from './pages/Inventory';
import Customers from './pages/Customers';
import Orders from './pages/Orders';
import Shipments from './pages/Shipments';
import Logistics from './pages/Logistics';
import Tracking from './pages/Tracking';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="p-8">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {isAuthenticated && <Nav />}
      <Routes>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/suppliers" element={<PrivateRoute><Suppliers /></PrivateRoute>} />
        <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
        <Route path="/warehouses" element={<PrivateRoute><Warehouses /></PrivateRoute>} />
        <Route path="/inventory" element={<PrivateRoute><Inventory /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
        <Route path="/shipments" element={<PrivateRoute><Shipments /></PrivateRoute>} />
        <Route path="/logistics" element={<PrivateRoute><Logistics /></PrivateRoute>} />
        <Route path="/tracking" element={<PrivateRoute><Tracking /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;