import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaSignInAlt, FaUserPlus, FaBuilding, FaUsers, FaBullhorn } from 'react-icons/fa';
// import { initializeDatabase } from '../firebase/initializeDatabase';
import { toast } from 'react-toastify';

export default function Home() {
  const { currentUser, userRole } = useAuth();
  const navigate = useNavigate();

  const handleDashboardClick = async (e) => {
    e.preventDefault();
    if (userRole === 'warden') {
        navigate('/warden/dashboard');
    } else if (userRole === 'student') {
      navigate('/student/dashboard');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-primary py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            VNRVJIET Hostel Management System
          </h1>
          <p className="text-xl text-blue-200 max-w-2xl mx-auto mb-10">
            A comprehensive platform for managing hostel accommodations, 
            and communications for students and wardens.
          </p>
          
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/login" 
                className="btn bg-white text-primary-900 hover:bg-gray-100 flex items-center justify-center"
              >
                <FaSignInAlt className="mr-2" /> Login
              </Link>
              <Link 
                to="/register" 
                className="btn bg-accent text-white hover:bg-accent-400 flex items-center justify-center"
              >
                <FaUserPlus className="mr-2" /> Register
              </Link>
            </div>
          ) : (
            <button 
              onClick={handleDashboardClick}
              className="btn bg-accent text-white hover:bg-accent-400"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaBuilding className="text-primary-900 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Room Management</h3>
              <p className="text-gray-600">
                Efficient allocation and management of hostel rooms with real-time status updates.
              </p>
            </div>
            
            <div className="card text-center transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaUsers className="text-primary-900 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Student Management</h3>
              <p className="text-gray-600">
                Complete student information management system with search and filter capabilities.
              </p>
            </div>
            
            <div className="card text-center transition-all duration-300 hover:shadow-lg">
              <div className="rounded-full bg-blue-100 w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <FaBullhorn className="text-primary-900 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Announcements</h3>
              <p className="text-gray-600">
                Important notices and announcements for effective communication between wardens and students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            Join our hostel management system to streamline your hostel experience. Whether you're a student or a warden, we've got you covered.
          </p>
          
          {!currentUser ? (
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/register" 
                className="btn btn-primary flex items-center justify-center"
              >
                Register Now
              </Link>
              <Link 
                to="/login" 
                className="btn btn-outline flex items-center justify-center"
              >
                Login
              </Link>
            </div>
          ) : (
            <button 
              onClick={handleDashboardClick}
              className="btn btn-primary"
            >
              Go to Dashboard
            </button>
          )}
        </div>
      </section>
    </div>
  );
}