import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import ScrollToTop from './components/ScrollToTop'
import NotFound from './pages/NotFound'
import ProtectedRoute from './components/ProtectedRoute'

// Public Layout & Pages
import PublicLayout from './layouts/PublicLayout'
import Homepage from './pages/Homepage'
import About from './pages/About'
import Doctors from './pages/Doctors'
import DoctorDetails from './pages/DoctorDetails'
import Appointment from './pages/Appointment'
import Contact from './pages/Contact'
import Emergency from './pages/Emergency'
import Gallery from './pages/Gallery'

// Auth Pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import ForgotPassword from './pages/auth/ForgotPassword'
import VerifyOTP from './pages/auth/VerifyOTP'

// Dashboard Layouts
import PatientDashboardLayout from './layouts/PatientDashboardLayout'
import DoctorDashboardLayout from './layouts/DoctorDashboardLayout'

// Patient Pages
import PatientDashboard from './pages/patient/PatientDashboard'
import MyAppointments from './pages/patient/MyAppointments'
import MedicalRecords from './pages/patient/MedicalRecords'
import Prescriptions from './pages/patient/Prescriptions'
import MyReviews from './pages/patient/MyReviews'
import Profile from './pages/patient/Profile'
import Notifications from './pages/patient/Notifications'
import BookAppointment from './pages/patient/BookAppointment'
import AppointmentDetails from './pages/patient/AppointmentDetails'

// Doctor Pages
import DoctorDashboard from './pages/doctor/DoctorDashboard'
import DoctorAppointments from './pages/doctor/Appointments'
import Patients from './pages/doctor/Patients'
import WritePrescription from './pages/doctor/WritePrescription'
import MedicalHistory from './pages/doctor/MedicalHistory'
import DoctorReports from './pages/doctor/DoctorReports'
import DoctorPrescriptions from './pages/doctor/DoctorPrescriptions'
import Schedule from './pages/doctor/Schedule'
import DoctorProfile from './pages/doctor/DoctorProfile'
import DoctorNotifications from './pages/doctor/DoctorNotifications'
import DoctorAppointmentDetails from './pages/doctor/DoctorAppointmentDetails'

// Admin Layout & Pages
import AdminLayout from './layouts/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminDoctors from './pages/admin/Doctors'
import AddDoctor from './pages/admin/AddDoctor'
import EditDoctor from './pages/admin/EditDoctor'
import ViewDoctor from './pages/admin/ViewDoctor'
import AdminPatients from './pages/admin/Patients'
import ViewPatient from './pages/admin/ViewPatient'
import AdminAppointments from './pages/admin/Appointments'
import ViewAppointment from './pages/admin/ViewAppointment'
import AdminGallery from './pages/admin/Gallery'
import AdminReviews from './pages/admin/Reviews'
import AdminAnalytics from './pages/admin/Analytics'
import AdminSettings from './pages/admin/Settings'
import ScheduleRequests from './pages/admin/ScheduleRequests'
import { Toaster } from 'react-hot-toast'

function App() {
  return (
    <Provider store={store}>
      <Toaster position="top-right" />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Homepage - standalone route with its own header and footer */}
          <Route path="/" element={<Homepage />} />

          {/* Other Public Pages */}
          <Route element={<PublicLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/doctors" element={<Doctors />} />
            <Route path="/doctors/:id" element={<DoctorDetails />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/emergency" element={<Emergency />} />
            <Route path="/gallery" element={<Gallery />} />
          </Route>
          <Route path="/appointment" element={<Appointment />} />

          {/* Auth Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />

          {/* Patient Dashboard - Only accessible by patients */}
          <Route path="/patient" element={
            <ProtectedRoute allowedRoles={['patient']}>
              <PatientDashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<PatientDashboard />} />
            <Route path="appointments" element={<MyAppointments />} />
            <Route path="medical-records" element={<MedicalRecords />} />
            <Route path="prescriptions" element={<Prescriptions />} />
            <Route path="reviews" element={<MyReviews />} />
            <Route path="profile" element={<Profile />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="book-appointment" element={<BookAppointment />} />
            <Route path="appointments/:id" element={<AppointmentDetails />} />
            <Route path="*" element={<NotFound dashboardLink="/patient/dashboard" dashboardLabel="Go to Dashboard" />} />
          </Route>

          {/* Doctor Dashboard - Only accessible by doctors */}
          <Route path="/doctor" element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboardLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<DoctorDashboard />} />
            <Route path="appointments" element={<DoctorAppointments />} />
            <Route path="appointments/:id" element={<DoctorAppointmentDetails />} />
            <Route path="patients" element={<Patients />} />
            <Route path="prescriptions" element={<DoctorPrescriptions />} />
            <Route path="prescription" element={<WritePrescription />} />
            <Route path="prescription/:patientId" element={<WritePrescription />} />
            <Route path="medical-history" element={<MedicalHistory />} />
            <Route path="medical-history/:patientId" element={<MedicalHistory />} />
            <Route path="reports" element={<DoctorReports />} />
            <Route path="schedule" element={<Schedule />} />
            <Route path="profile" element={<DoctorProfile />} />
            <Route path="notifications" element={<DoctorNotifications />} />
            <Route path="*" element={<NotFound dashboardLink="/doctor/dashboard" dashboardLabel="Go to Dashboard" />} />
          </Route>

          {/* Admin Dashboard - Only accessible by admins */}
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="doctors" element={<AdminDoctors />} />
            <Route path="doctors/add" element={<AddDoctor />} />
            <Route path="doctors/edit/:id" element={<EditDoctor />} />
            <Route path="doctors/view/:id" element={<ViewDoctor />} />
            <Route path="patients" element={<AdminPatients />} />
            <Route path="patients/view/:id" element={<ViewPatient />} />
            <Route path="appointments" element={<AdminAppointments />} />
            <Route path="appointments/view/:id" element={<ViewAppointment />} />
            <Route path="schedule-requests" element={<ScheduleRequests />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="reviews" element={<AdminReviews />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
            {/* Catch-all for unknown routes - show 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  )
}

export default App