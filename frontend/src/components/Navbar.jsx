import React from 'react';
import { User, LogOut, ShoppingBag, CreditCard } from 'lucide-react';

export default function Navbar({ user, onOpenAuth, onLogout, activeTab, setActiveTab }) {
  return (
    <header className="navbar">
      <div className="brand">
        <div className="brand-icon">⚡</div>
        <div className="brand-title">
          Micro<span>DevSecOps</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <button 
          className={`btn ${activeTab === 'catalog' ? 'btn-secondary' : ''}`}
          style={{ background: activeTab === 'catalog' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none' }}
          onClick={() => setActiveTab('catalog')}
        >
          <ShoppingBag size={18} /> Products
        </button>

        {user && (
          <button 
            className={`btn ${activeTab === 'orders' ? 'btn-secondary' : ''}`}
            style={{ background: activeTab === 'orders' ? 'rgba(255,255,255,0.1)' : 'transparent', border: 'none' }}
            onClick={() => setActiveTab('orders')}
          >
            <CreditCard size={18} /> Payments
          </button>
        )}
      </div>

      <div className="nav-actions">
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div className="user-badge">
              <User size={16} color="#06b6d4" />
              <span>{user.name}</span>
            </div>
            <button className="btn btn-secondary" onClick={onLogout} title="Sign Out">
              <LogOut size={16} /> Logout
            </button>
          </div>
        ) : (
          <button className="btn btn-primary" onClick={onOpenAuth}>
            <User size={16} /> Sign In / Login
          </button>
        )}
      </div>
    </header>
  );
}
