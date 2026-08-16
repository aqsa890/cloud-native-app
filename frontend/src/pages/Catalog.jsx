import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../services/api';
import { RefreshCw } from 'lucide-react';

export default function Catalog({ onSelectProduct }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch {
      setError('Could not load products from Gateway. Ensure Product Service (port 8002) and Gateway (port 8000) are online.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1>Microservices Product Catalog</h1>
        <p>Browse products fetched via <strong>FastAPI Product Service (Python + PostgreSQL)</strong></p>
      </div>

      <div className="arch-banner">
        <div className="arch-node" style={{ color: 'var(--accent-cyan)' }}>Frontend (React)</div>
        <div className="arch-arrow">➔</div>
        <div className="arch-node" style={{ color: 'var(--accent-blue)' }}>API Gateway (:8000)</div>
        <div className="arch-arrow">➔</div>
        <div className="arch-node" style={{ color: 'var(--accent-purple)' }}>Product Service (:8002)</div>
        <div className="arch-arrow">➔</div>
        <div className="arch-node" style={{ color: 'var(--accent-green)' }}>PostgreSQL</div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={fetchProducts} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh Catalog
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Loading products from API Gateway...
        </div>
      ) : products.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          No products available.
        </div>
      ) : (
        <div className="product-grid">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} onSelectProduct={onSelectProduct} />
          ))}
        </div>
      )}
    </div>
  );
}
