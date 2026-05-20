import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage            from '../pages/auth/LoginPage';
import RegisterPage         from '../pages/auth/RegisterPage';
import ForgotPasswordPage   from '../pages/auth/ForgotPasswordPage';
import HomePage             from '../pages/home/HomePage';
import ServicesPage         from '../pages/services/ServicesPage';
import ProvidersPage        from '../pages/providers/ProvidersPage';
import BookingPage          from '../pages/bookings/BookingPage';
import MyBookingsPage       from '../pages/bookings/MyBookingsPage';
import NotificationsPage    from '../pages/notifications/NotificationsPage';
import ProfilePage          from '../pages/profile/ProfilePage';
import ProviderLoginPage    from '../pages/provider/ProviderLoginPage';
import ProviderDashboard    from '../pages/provider/ProviderDashboard';
import ProviderRegisterPage from '../pages/provider/ProviderRegisterPage';
import AdminDashboard       from '../pages/admin/AdminDashboard';
import AdminUsers           from '../pages/admin/AdminUsers';
import AdminProviders       from '../pages/admin/AdminProviders';
import AdminBookings        from '../pages/admin/AdminBookings';
import { CustomerRoute, ProviderRoute, AdminRoute } from '../components/ProtectedRoute';
import ProviderProfilePage from '../pages/providers/ProviderProfilePage';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login"             element={<LoginPage />} />
        <Route path="/register"          element={<RegisterPage />} />
        <Route path="/forgot-password"   element={<ForgotPasswordPage />} />
        <Route path="/provider/login"    element={<ProviderLoginPage />} />
        <Route path="/provider/register" element={<ProviderRegisterPage />} />

        {/* Customer protected */}
        <Route path="/"              element={<CustomerRoute><HomePage /></CustomerRoute>} />
        <Route path="/services"      element={<CustomerRoute><ServicesPage /></CustomerRoute>} />
        <Route path="/providers"     element={<CustomerRoute><ProvidersPage /></CustomerRoute>} />
        <Route path="/providers/:id" element={<CustomerRoute><ProviderProfilePage /></CustomerRoute>} />
        <Route path="/book"          element={<CustomerRoute><BookingPage /></CustomerRoute>} />
        <Route path="/my-bookings"   element={<CustomerRoute><MyBookingsPage /></CustomerRoute>} />
        <Route path="/notifications" element={<CustomerRoute><NotificationsPage /></CustomerRoute>} />
        <Route path="/profile"       element={<CustomerRoute><ProfilePage /></CustomerRoute>} />

        {/* Provider protected */}
        <Route path="/provider/dashboard" element={<ProviderRoute><ProviderDashboard /></ProviderRoute>} />

        {/* Admin protected */}
        <Route path="/admin"           element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/users"     element={<AdminRoute><AdminUsers /></AdminRoute>} />
        <Route path="/admin/providers" element={<AdminRoute><AdminProviders /></AdminRoute>} />
        <Route path="/admin/bookings"  element={<AdminRoute><AdminBookings /></AdminRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;