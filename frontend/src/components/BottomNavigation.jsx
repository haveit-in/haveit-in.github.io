import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Search, ShoppingCart, User, Menu } from 'lucide-react'

const BottomNavigation = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: Search, label: 'Search', path: '/restaurants' },
    { icon: ShoppingCart, label: 'Cart', path: '/cart' },
    { icon: Menu, label: 'Orders', path: '/track-order' },
    { icon: User, label: 'Profile', path: '/profile' }
  ]

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden z-40">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const active = isActive(item.path)
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center min-w-16 h-full p-2 transition-all duration-200 active:scale-95 ${
                active 
                  ? 'text-orange-500' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
              aria-label={item.label}
              style={{ touchAction: 'manipulation' }}
            >
              <item.icon 
                className={`w-6 h-6 transition-transform duration-200 ${
                  active ? 'scale-110' : 'scale-100'
                }`} 
              />
              <span className={`text-xs font-medium mt-1 transition-all duration-200 ${
                active ? 'scale-105' : 'scale-100'
              }`}>
                {item.label}
              </span>
              {active && (
                <div className="absolute top-0 w-8 h-0.5 bg-orange-500 rounded-full transition-all duration-300" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNavigation
