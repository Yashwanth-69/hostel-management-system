import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Layout Components
import Header from './components/layout/Header';

// Page Components
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProtectedRoute from './components/auth/ProtectedRoute';
// Student Components
import StudentDashboard from './components/student/Dashboard';
import StudentProfile from './components/student/Profile';
// import StudentRoom from './components/student/Room';
// import StudentAnnouncements from './components/student/Announcements';
// import StudentComplaints from './components/student/Complaints';
import AddStudentComplaints from './components/student/addComplaint';
// import StudentPayments from './components/student/Payments';

// Warden Components
import WardenDashboard from './components/warden/Dashboard';
import StudentManagement from './components/warden/StudentManagement';
import WardenRooms from './components/warden/Rooms';
import AddAnnouncement from './components/warden/addAnnouncement';
import ResolveComplaints from './components/warden/ResolveComplaint';
// import FeeManagement from './components/warden/FeeManagement';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-300">
          <Header />
          <main>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              {/* <Route path="/initialize" element={<InitializePage />} /> */}
              
              {/* Warden Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['warden']} />}>
                <Route path="/warden/dashboard" element={<WardenDashboard />} />
                <Route path="/warden/students" element={<StudentManagement />} />
                <Route path="/warden/announcements" element={<AddAnnouncement/>} />
                <Route path="/warden/rooms" element={<WardenRooms />} />
                <Route path="/warden/complaints" element={<ResolveComplaints />} />
                {/* 
                <Route path="/warden/fees" element={<FeeManagement />} /> */}
              </Route>
              
              {/* Student Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<StudentProfile />} />
                <Route path="/student/complaints/new" element={<AddStudentComplaints />} />
                {/* <Route path="/student/room" element={<StudentRoom />} />
                <Route path="/student/complaints/new" element={<NewComplaint />} />
                <Route path="/student/payments" element={<StudentPayments />} /> */}
              </Route>
              
              {/* Common Protected Routes */}
              <Route element={<ProtectedRoute allowedRoles={['warden', 'student']} />}>
                <Route path="/profile" element={<StudentProfile />} />
              </Route>
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;