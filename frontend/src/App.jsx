import { useState, useEffect, useCallback } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import './App.css'
import Landing from './pages/Landing.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import UserDashboard from './pages/UserDashboard.jsx'
import PartnerLanding from './pages/PartnerLanding.jsx'
import PartnerLogin from './pages/PartnerLogin.jsx'
import PartnerRegister from './pages/PartnerRegister.jsx'
import PartnerWaitingApproval from './pages/PartnerWaitingApproval.jsx'
import PartnerRejected from './pages/PartnerRejected.jsx'
import AdminRestaurants from './pages/AdminRestaurants.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminOrders from './pages/AdminOrders.jsx'
import AdminUsers from './pages/AdminUsers.jsx'
import AdminAnalytics from './pages/AdminAnalytics.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import Restaurants from './pages/Restaurants.jsx'
import RestaurantDetails from './pages/RestaurantDetails.jsx'
import CartPage from './pages/CartPage.jsx'
import CheckoutPage from './pages/CheckoutPage.jsx'
import OrderSuccessPage from './pages/OrderSuccessPage.jsx'
import OrderTrackingPage from './pages/OrderTrackingPage.jsx'
import RestaurantOrdersPage from './pages/RestaurantOrdersPage.jsx'
import { AdminLayout } from './components/AdminLayout.jsx'
import AuthPanel from './components/AuthPanel.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import FloatingCartBar from './components/FloatingCartBar.jsx'
import RestaurantConflictModal from './components/RestaurantConflictModal.jsx'
import Toast from './components/Toast.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import BottomNavigation from './components/BottomNavigation.jsx'
import { DashboardLayout } from './components/DashboardLayout.jsx'
import { DashboardHome } from './components/DashboardHome.jsx'
import PartnerOrders from './pages/PartnerOrders.jsx'
import PartnerMenu from './pages/PartnerMenu.jsx'
import PartnerEarnings from './pages/PartnerEarnings.jsx'
import PartnerSettings from './pages/PartnerSettings.jsx'
import PartnerDashboard from './pages/PartnerDashboard.jsx'
import AboutUs from './pages/AboutUs.jsx'
import FAQs from './pages/FAQs.jsx'
import ContactUs from './pages/ContactUs.jsx'
import PrivacyPolicy from './pages/PrivacyPolicy.jsx'
import TermsConditions from './pages/TermsConditions.jsx'
import HelpCenter from './pages/HelpCenter.jsx'
import TrackOrder from './pages/TrackOrder.jsx'
import Feedback from './pages/Feedback.jsx'
import Careers from './pages/Careers.jsx'
import Blog from './pages/Blog.jsx'
import CookiePolicy from './pages/CookiePolicy.jsx'

function App() {
  const location = useLocation()
  const [authOpen, setAuthOpen] = useState(false)
  const [authMode, setAuthMode] = useState('login') // 'login' | 'signup'
  const [activeMode, setActiveMode] = useState('food') // 'food' | 'groceries'

  const openLogin = useCallback(() => {
    setAuthMode('login')
    setAuthOpen(true)
  }, [])

  const openSignup = useCallback(() => {
    setAuthMode('signup')
    setAuthOpen(true)
  }, [])

  const closeAuth = useCallback(() => {
    setAuthOpen(false)
  }, [])

  useEffect(() => {
    if (!authOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAuth()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [authOpen, closeAuth])

  useEffect(() => {
    const original = document.body.style.overflow
    if (authOpen) document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = original
    }
  }, [authOpen])

  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <CartProvider>
            <div className="min-h-screen bg-gray-50">
            <Routes>
              <Route
                path="/"
                element={<Landing onOpenLogin={openLogin} onOpenSignup={openSignup} activeMode={activeMode} setActiveMode={setActiveMode} />}
              />
              <Route
                path="/profile"
                element={<ProfilePage activeMode={activeMode} />}
              />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/restaurants" element={<Restaurants />} />
              <Route path="/restaurants/:id" element={<RestaurantDetails />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/orders/success" element={<OrderSuccessPage />} />
              <Route path="/orders/:id/tracking" element={<OrderTrackingPage />} />
              <Route path="/restaurant/orders" element={<RestaurantOrdersPage />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsConditions />} />
              <Route path="/help" element={<HelpCenter />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/careers" element={<Careers />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/cookies" element={<CookiePolicy />} />
              <Route
                path="/partner"
                element={<PartnerLanding />}
              />
              <Route
                path="/partner/login"
                element={<PartnerLogin />}
              />
              <Route
                path="/partner/register"
                element={<PartnerRegister />}
              />
              <Route
                path="/partner/waiting-approval"
                element={<PartnerWaitingApproval />}
              />
              <Route
                path="/partner/rejected"
                element={<PartnerRejected />}
              />
              <Route
                path="/admin/login"
                element={<AdminLogin />}
              />
              <Route
                path="/admin/restaurants"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminRestaurants />} />
              </Route>
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminDashboard />} />
              </Route>
              <Route
                path="/admin/orders"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminOrders />} />
              </Route>
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminUsers />} />
              </Route>
              <Route
                path="/admin/analytics"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<AdminAnalytics />} />
              </Route>
              <Route
                path="/user/dashboard"
                element={
                  <ProtectedRoute requiredRole="user">
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/partner/dashboard"
                element={
                  <ProtectedRoute requiredRole="restaurant_owner">
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<PartnerDashboard />} />
                <Route path="orders" element={<PartnerOrders />} />
                <Route path="menu" element={<PartnerMenu />} />
                <Route path="earnings" element={<PartnerEarnings />} />
                <Route path="settings" element={<PartnerSettings />} />
              </Route>
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
            <AuthPanel
              open={authOpen}
              mode={authMode}
              onClose={closeAuth}
              onModeChange={setAuthMode}
              activeMode={activeMode}
            />
            <FloatingCartBar />
            <RestaurantConflictModal />
            <Toast />
            {!location.pathname.startsWith('/partner/dashboard') && <BottomNavigation onLoginClick={openLogin} />}
          </div>
        </CartProvider>
      </ToastProvider>
    </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
