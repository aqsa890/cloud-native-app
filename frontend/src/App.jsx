import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import PaymentModal from './components/PaymentModal';
import Catalog from './pages/Catalog';
import Orders from './pages/Orders';

export default function App() {
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('catalog');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Restore saved auth session if present
  useEffect(() => {
    const savedUser = localStorage.getItem('auth_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('auth_user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData, token) => {
    setUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(userData));
    localStorage.setItem('auth_token', token);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
    setActiveTab('catalog');
  };

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
  };

  return (
    <div className="app-container">
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="main-content">
        {activeTab === 'catalog' ? (
          <Catalog onSelectProduct={handleSelectProduct} />
        ) : (
          <Orders user={user} />
        )}
      </main>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <PaymentModal
        product={selectedProduct}
        user={user}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onPaymentComplete={() => {
          if (user && activeTab === 'orders') {
            // refresh history if on orders page
          }
        }}
      />
    </div>
  );
}
