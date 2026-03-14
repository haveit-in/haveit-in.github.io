import { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { CartIcon } from './Icons.jsx';

// CrossIcon component
const CrossIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

// MinusIcon component
const MinusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
  </svg>
);

// PlusIcon component
const PlusIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
);

// TrashIcon component
const TrashIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18" />
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
  </svg>
);

// EmptyCartIcon component
const EmptyCartIcon = ({ size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

export default function CartButton({ isMobile = false }) {
  const { cart, addToCart } = useApp();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const prevCountRef = useRef(cart.totalCount);

  // Trigger bounce animation when cart count increases
  useEffect(() => {
    if (cart.totalCount > prevCountRef.current) {
      setIsAnimating(true);
      const timer = setTimeout(() => setIsAnimating(false), 300);
      prevCountRef.current = cart.totalCount;
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cart.totalCount;
  }, [cart.totalCount]);

  const handleCartClick = useCallback(() => {
    setIsDrawerOpen(true);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={handleCartClick}
        className={`relative flex items-center gap-2 ${isMobile ? 'p-2 -mr-2' : 'px-4 py-2'} text-gray-700 hover:text-gray-900 transition-colors`}
        aria-label="View cart"
      >
        <CartIcon size={isMobile ? 22 : 20} />
        <span 
          className={`absolute ${isMobile ? 'top-0 right-0' : '-top-1 -right-1'} w-5 h-5 bg-[#E8711A] text-white text-xs font-bold rounded-full flex items-center justify-center transition-transform ${
            isAnimating ? 'animate-cart-bounce' : ''
          }`}
        >
          {cart.totalCount}
        </span>
      </button>

      <CartDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
    </>
  );
}

function CartDrawer({ isOpen, onClose }) {
  const { cart, updateQuantity, removeFromCart, clearCart } = useApp();
  const drawerRef = useRef(null);
  const contentRef = useRef(null);

  // Close on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Close on backdrop click
  const handleBackdropClick = useCallback((e) => {
    if (e.target === drawerRef.current) {
      onClose();
    }
  }, [onClose]);

  // Handle quantity change
  const handleQuantityChange = useCallback((itemId, currentQuantity, delta) => {
    const newQuantity = currentQuantity + delta;
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  }, [updateQuantity, removeFromCart]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={drawerRef}
      className="fixed inset-0 bg-black/50 z-50 transition-opacity"
      onClick={handleBackdropClick}
    >
      <div
        ref={contentRef}
        className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-out animate-slide-in-right"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#E8711A]/10 rounded-full flex items-center justify-center">
              <CartIcon size={20} className="text-[#E8711A]" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Your Cart</h2>
              <p className="text-sm text-gray-500">{cart.totalCount} {cart.totalCount === 1 ? 'item' : 'items'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close cart"
          >
            <CrossIcon size={20} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex flex-col h-[calc(100%-140px)]">
          {cart.items.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center px-6">
              <EmptyCartIcon size={80} />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">Your cart is empty</h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Add some delicious items to get started!
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-6 py-2.5 bg-[#E8711A] text-white font-medium rounded-lg hover:bg-[#d46517] transition-colors"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-4 py-4">
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                    >
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-200 flex items-center justify-center flex-shrink-0">
                          <span className="text-gray-400 text-xs">{item.name[0]}</span>
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-semibold text-gray-900 truncate">
                          {item.name}
                        </h4>
                        <p className="text-xs text-gray-500">{item.type || item.category}</p>
                        <p className="text-sm font-medium text-gray-900 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <TrashIcon size={16} />
                        </button>

                        <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-l-lg transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <MinusIcon size={14} />
                          </button>
                          <span className="w-8 text-center text-sm font-semibold text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-r-lg transition-colors"
                            aria-label="Increase quantity"
                          >
                            <PlusIcon size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart Button */}
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to clear your cart?')) {
                      clearCart();
                    }
                  }}
                  className="mt-4 w-full py-2 text-sm text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  Clear Cart
                </button>
              </div>

              {/* Footer with Total and Checkout */}
              <div className="border-t border-gray-100 px-4 py-4 bg-gray-50">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-medium text-gray-900">{formatPrice(cart.totalPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Delivery Fee</span>
                    <span className="font-medium text-gray-900">
                      {cart.totalPrice > 500 ? 'Free' : formatPrice(40)}
                    </span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 flex items-center justify-between">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-bold text-[#E8711A]">
                      {formatPrice(cart.totalPrice + (cart.totalPrice > 500 ? 0 : 40))}
                    </span>
                  </div>
                </div>

                <button
                  className="w-full py-3.5 bg-[#E8711A] text-white font-semibold rounded-xl hover:bg-[#d46517] transition-colors shadow-lg shadow-[#E8711A]/25"
                  onClick={() => alert('Checkout feature coming soon!')}
                >
                  Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
