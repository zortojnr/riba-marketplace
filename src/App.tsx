import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { useServiceWorker } from './hooks/useServiceWorker';
import { AppShell } from './components/layout/AppShell';
import { NavigationProvider } from './contexts/NavigationContext';
import { LayoutWrapper } from './components/layout/LayoutWrapper';
import { AuthPage } from './pages/AuthPage';
import { HomePage } from './pages/HomePage';
import ProtectedStorePage from './pages/ProtectedStorePage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { SharedProductPage } from './pages/SharedProductPage';

import { ProductsPage } from './pages/ProductsPage';
import { OrdersPage } from './pages/OrdersPage';
import { SettingsPage } from './pages/SettingsPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { DashboardPage } from './pages/DashboardPage';
import { ComprehensiveTestSuite } from './components/testing/ComprehensiveTestSuite';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import { StoreProvider } from './contexts/StoreContext';
import { NotificationProvider } from './contexts/NotificationContext';

function App() {
  useServiceWorker(); // Initialize service worker for PWA functionality
  
  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <StoreProvider>
            <CartProvider>
              <NotificationProvider>
                <div className="min-h-screen bg-gray-50">
                  <LayoutWrapper>
                    <AppShell>
                      <Routes>
                        {/* Public Routes - Landing as entry point */}
                        <Route path="/" element={<HomePage />} />
                        <Route path="/auth" element={<AuthPage />} />
                        <Route path="/store/:slug" element={<ProtectedStorePage />} />
                        <Route path="/store/:slug/product/:productId" element={<SharedProductPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        
                        {/* Protected Routes */}
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/onboarding" element={<OnboardingPage />} />
                        <Route path="/test" element={<ComprehensiveTestSuite />} />
                        
                        {/* Legacy routes */}
                        <Route path="/login" element={<Navigate to="/auth" replace />} />
                        <Route path="/register" element={<Navigate to="/auth" replace />} />
                      </Routes>
                    </AppShell>
                  </LayoutWrapper>
                  <Toaster
                    position="top-right"
                    toastOptions={{
                      duration: 500,
                      style: {
                        background: '#ffffff',
                        color: '#111827',
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        padding: '16px',
                      },
                    }}
                  />
                </div>
              </NotificationProvider>
            </CartProvider>
          </StoreProvider>
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;