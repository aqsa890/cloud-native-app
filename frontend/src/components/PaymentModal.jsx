import React, { useState } from 'react';
import { api } from '../services/api';

export default function PaymentModal({ product, user, isOpen, onClose, onPaymentComplete }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  if (!isOpen || !product) return null;

  const handleProcessPayment = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await api.createPayment({
        user_id: user ? user.id : 1,
        product_id: product.id,
        amount: product.price,
      });

      setResult(response);
      if (onPaymentComplete) onPaymentComplete(response);
    } catch (err) {
      setError(err.message || 'Payment simulation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    setError('');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Simulate Payment</h2>
          <button className="close-btn" onClick={handleClose}>&times;</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {result ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div className={`badge badge-${result.transaction?.status || 'success'}`} style={{ fontSize: '1rem', padding: '0.5rem 1.25rem', marginBottom: '1rem' }}>
              Status: {result.transaction?.status?.toUpperCase()}
            </div>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{result.message}</p>
            <div style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', textAlign: 'left', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              <div><strong>Transaction ID:</strong> #{result.transaction?.id}</div>
              <div><strong>Product:</strong> {product.name}</div>
              <div><strong>Amount Paid:</strong> ${result.transaction?.amount}</div>
              <div><strong>Timestamp:</strong> {new Date(result.transaction?.created_at).toLocaleString()}</div>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleClose}>
              Done
            </button>
          </div>
        ) : (
          <div>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Item Details</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginTop: '0.2rem' }}>{product.name}</div>
              <div style={{ fontSize: '1.25rem', color: 'var(--accent-cyan)', fontWeight: 700, marginTop: '0.4rem' }}>
                ${Number(product.price).toFixed(2)}
              </div>
            </div>

            <div className="form-group">
              <label>Customer Account</label>
              <input
                type="text"
                className="form-input"
                value={user ? `${user.name} (${user.email})` : 'Guest Checkout (User #1)'}
                disabled
              />
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              ℹ️ Simulated endpoint sending <code>POST /api/payments</code> to Node.js Payment Microservice.
            </div>

            <button
              className="btn btn-primary"
              style={{ width: '100%' }}
              onClick={handleProcessPayment}
              disabled={loading}
            >
              {loading ? 'Processing Payment...' : `Confirm & Pay $${Number(product.price).toFixed(2)}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
