import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import ForgotPasswordPage from "../pages/auth/ForgotPasswordPage";
import HomePage from "../pages/home/HomePage";
import ServicesPage from "../pages/services/ServicesPage";
import ProvidersPage from "../pages/providers/ProvidersPage";
import ProviderDetailPage from "../pages/providers/ProviderDetailPage";
import BookingPage from "../pages/bookings/BookingPage";
import MyBookingsPage from "../pages/bookings/MyBookingsPage";
import NotificationsPage from "../pages/notifications/NotificationsPage";
import ProfilePage from "../pages/profile/ProfilePage";
import ProviderLoginPage from "../pages/provider/ProviderLoginPage";
import ProviderDashboard from "../pages/provider/ProviderDashboard";
import ProtectedRoute from "../components/ProtectedRoute";

const Protected = ({ children }: { children: React.ReactNode }) => (
  <ProtectedRoute>{children}</ProtectedRoute>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/provider/login" element={<ProviderLoginPage />} />
        <Route path="/provider/dashboard" element={<ProviderDashboard />} />

        {/* Protected */}
        <Route
          path="/"
          element={
            <Protected>
              <HomePage />
            </Protected>
          }
        />
        <Route
          path="/services"
          element={
            <Protected>
              <ServicesPage />
            </Protected>
          }
        />
        <Route
          path="/providers"
          element={
            <Protected>
              <ProvidersPage />
            </Protected>
          }
        />
        <Route
          path="/providers/:id"
          element={
            <Protected>
              <ProviderDetailPage />
            </Protected>
          }
        />
        <Route
          path="/book"
          element={
            <Protected>
              <BookingPage />
            </Protected>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <Protected>
              <MyBookingsPage />
            </Protected>
          }
        />
        <Route
          path="/notifications"
          element={
            <Protected>
              <NotificationsPage />
            </Protected>
          }
        />
        <Route
          path="/profile"
          element={
            <Protected>
              <ProfilePage />
            </Protected>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
