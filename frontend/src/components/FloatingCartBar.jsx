import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { ShoppingCart, IndianRupee } from 'lucide-react'

const FloatingCartBar = () => {
  const navigate = useNavigate()
  const { getCartTotals, isEmpty, getMinimumOrderInfo } = useCart()
  
  if (isEmpty()) return null

  const { itemCount, total } = getCartTotals()
  const { met: minOrderMet } = getMinimumOrderInfo()

  const handleViewCart = () => {
    navigate('/cart')
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 md:hidden">
      <div className="px-4 py-3">
        <button
          onClick={handleViewCart}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-lg py-3 px-4 font-medium transition-colors flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute -top-2 -right-2 bg-white text-orange-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <span>View Cart</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-sm opacity-90">{itemCount} items</span>
            <div className="flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              <span className="font-bold">{total.toFixed(0)}</span>
            </div>
          </div>
        </button>
        
        {!minOrderMet && (
          <div className="mt-2 text-center text-sm text-orange-600">
            Add more items to meet minimum order requirement
          </div>
        )}
      </div>
    </div>
  )
}

export default FloatingCartBar
