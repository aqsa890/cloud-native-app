import React from 'react';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product, onSelectProduct }) {
  return (
    <div className="product-card">
      <div className="product-header">
        <h3 className="product-title">{product.name}</h3>
        <span className="product-price">${Number(product.price).toFixed(2)}</span>
      </div>
      <p className="product-desc">{product.description || 'No description available for this item.'}</p>
      
      <div className="product-footer">
        <span className="stock-tag">In Stock: {product.stock}</span>
        <button 
          className="btn btn-primary"
          onClick={() => onSelectProduct(product)}
        >
          <ShoppingCart size={16} /> Buy Now
        </button>
      </div>
    </div>
  );
}
