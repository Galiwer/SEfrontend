import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Layout from '../components/Layout';
import PublicLayout from '../components/PublicLayout';
import ProtectedRoute from '../components/ProtectedRoute';
import LoginPage from '../pages/LoginPage';
import CustomerLoginPage from '../pages/CustomerLoginPage';
import HomePage from '../pages/HomePage';
import EmployeeHomePage from '../pages/EmployeesHomePage';
import EmployeeCreatePage from '../pages/EmployeeCreatePage';
import EmployeeEditPage from '../pages/EmployeeEditPage';
import FinanceHomePage from '../pages/FinanceHomePage';
import IncomeCreatePage from '../pages/IncomeCreatePage';
import ExpenseCreatePage from '../pages/ExpenseCreatePage';
import AddResources from '../pages/AddResources';
import Attendance from '../pages/Attendance';
import AdminCustomerPage from '../components/AdminCustomerPage';
import AdminFAQPage from '../components/AdminFAQPage';
import AdminHistoryPage from '../components/AdminHistoryPage';
import AdminGalleryPage from '../components/AdminGalleryPage';
import AdminAttractionsPage from '../components/AdminAttractionsPage';
import BungalowHistory from '../components/BungalowHistory';
import ContactPage from '../components/ContactPage';
import CustomerReservations from '../components/CustomerReservations';
import FAQPage from '../components/FAQPage';
import AttractionsPage from '../components/AttractionsPage';
import TestPage from '../components/TestPage';
import CustomerDashboard from '../pages/CustomerDashboard';
import CustomerRequest from '../components/CustomerRequest';
import AdminRequest from '../components/AdminRequest';
import MakeReservation from '../pages/MakeReservation';
import AdminReservations from '../components/AdminReservations';
import Gallery from '../pages/gallery';
import ReviewsPage from '../pages/ReviewsPage';
import AddReview from '../pages/AddReview';
import AdminReviews from '../components/AdminReviews';
import MyReviews from '../pages/MyReviews';
import AdminInvoiceCreatePage from '../pages/AdminInvoiceCreatePage';
import AdminInvoiceManagementPage from '../pages/AdminInvoiceManagementPage';
import CustomerInvoices from '../pages/CustomerInvoices';
import AdminRooms from '../components/AdminRooms';
import AdminSeasonalRates from '../components/AdminSeasonalRates';
import BookingManagement from '../components/BookingManagement';
import AdminCalendar from '../components/AdminCalendar'; 

const AppRoutes = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes with public layout */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<HomePage />} />
            <Route path="home" element={<HomePage />} />
            <Route path="history" element={<BungalowHistory />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FAQPage />} />
            <Route path="attractions" element={<AttractionsPage />} />
            <Route path="gallery" element={<Gallery />} />
            <Route path="reviews" element={<ReviewsPage />} />
          </Route>

          {/* Standalone public routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/customer-login" element={<CustomerLoginPage />} />
          <Route
            path="/reserve"
            element={
              <ProtectedRoute redirectTo="/customer-login">
                <MakeReservation />
              </ProtectedRoute>
            }
          />

          {/* Customer dashboard with sidebar */}
          <Route path="/dashboard" element={<CustomerDashboard />}>
            <Route path="reservations" element={<CustomerReservations />} />
            <Route path="request" element={<CustomerRequest />} />
            <Route path="add-review" element={<AddReview />} />
            <Route path="my-reviews" element={<MyReviews />} />
            <Route path="invoices" element={<CustomerInvoices />} />
            {/* Default page inside dashboard → redirect to reservations (or request if you prefer) */}
            <Route index element={<Navigate to="reservations" replace />} />
          </Route>

          {/* Protected admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/employees" replace />} />
            <Route path="request" element={<AdminRequest />} />

            {/* Employee pages */}
            <Route path="employees" element={<EmployeeHomePage />} />
            <Route path="employees/create" element={<EmployeeCreatePage />} />
            <Route path="employees/edit/:nic" element={<EmployeeEditPage />} />

            {/* Attendance */}
            <Route path="attendance" element={<Attendance />} />

            {/* Finance */}
            <Route path="finance" element={<FinanceHomePage />} />
            <Route path="finance/income/create" element={<IncomeCreatePage />} />
            <Route path="finance/expense/create" element={<ExpenseCreatePage />} />
            <Route path="finance/invoice/create" element={<AdminInvoiceCreatePage />} />

            {/* Invoice Management */}
            <Route path="invoices" element={
              <ProtectedRoute requireAdmin={true}>
                <AdminInvoiceManagementPage />
              </ProtectedRoute>
            } />

            {/* Resources */}
            <Route path="add-resources" element={<AddResources />} />

            {/* Admin management */}
            <Route
              path="customers"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCustomerPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="faqs"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminFAQPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="attractions"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminAttractionsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminHistoryPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="reviews"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminReviews />
                </ProtectedRoute>
              }
            />
            <Route
              path="gallery"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminGalleryPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="reservations"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminReservations />
                </ProtectedRoute>
              }
            />

            <Route
              path="booking-management"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <BookingManagement />
                </ProtectedRoute>
              }
            />

            <Route
              path="calendar"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminCalendar />
                </ProtectedRoute>
              }
            />

            <Route
              path="rooms"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminRooms />
                </ProtectedRoute>
              }
            />

            {/* Seasonal Rates */}
            <Route
              path="seasonal_rates"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminSeasonalRates />
                </ProtectedRoute>
              }
            />

            {/* Fallback */}
            <Route path="*" element={<div className="p-4">Page not found</div>} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default AppRoutes;
