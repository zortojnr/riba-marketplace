import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useServiceWorker } from './hooks/useServiceWorker';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/HomePage';
import { StorePage } from './pages/StorePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { StoreProvider } from './contexts/StoreContext';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  useServiceWorker(); // Initialize service worker for PWA functionality
  
  return (
    <AuthProvider>
      <StoreProvider>
        <CartProvider>
          <NotificationProvider>
            <Router>
              <AppShell>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/store/:slug" element={<StorePage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  
                  {/* Protected Routes */}
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/products" element={<ProductsPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="/onboarding" element={<OnboardingPage />} />
                </Routes>
              </AppShell>
            </Router>
            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#111827',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '16px',
                },
              }}
            />
          </NotificationProvider>
        </CartProvider>
      </StoreProvider>
    </AuthProvider>
  );
}

export default App;