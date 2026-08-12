import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CreditCard, RefreshCw } from 'lucide-react';

export default function Orders({ user }) {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUserPayments = async () => {
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const data = await api.getUserPayments(user.id);
      setPayments(data);
    } catch (err) {
      setError('Could not load payment history from Payment Service.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserPayments();
  }, [user]);

  return (
    <div>
      <div className="page-header">
        <h1>Payment History</h1>
        <p>Simulated payments retrieved from <strong>Node.js Payment Service (Express + PostgreSQL)</strong></p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem' }}>
        <button className="btn btn-secondary" onClick={fetchUserPayments} disabled={loading}>
          <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh History
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          Fetching payment records...
        </div>
      ) : payments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-secondary)' }}>
          No payments processed yet for user <strong>{user?.name}</strong>.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {payments.map((p) => (
            <div key={p.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
                  <CreditCard size={18} color="#06b6d4" /> Transaction #{p.id}
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Product ID: {p.product_id} • User ID: {p.user_id}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  {new Date(p.created_at).toLocaleString()}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.3rem' }}>
                  ${Number(p.amount).toFixed(2)}
                </div>
                <span className={`badge badge-${p.status}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
