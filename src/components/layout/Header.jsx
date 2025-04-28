import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaBars, FaTimes, FaUserCircle, FaSignOutAlt } from 'react-icons/fa';

// VNRVJIET logo URL (replace with actual logo URL)
const LOGO_URL = 'https://s.yimg.com/zb/imgv1/74ec12dc-f590-3071-97bd-862c3a87d584/t_1024x1024';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { currentUser, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <header className="bg-gradient-primary shadow-nav sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo and title */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img 
                src={LOGO_URL} 
                alt="VNRVJIET Logo" 
                className="h-10 w-auto mr-3"
              />
              <div>
                <h1 className="text-white font-bold text-xl">VNRVJIET</h1>
                <p className="text-blue-200 text-xs">Hostel Management System</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link to="/" className="text-white hover:text-blue-200 transition-colors">
              Home
            </Link>
            {currentUser && userRole === 'warden' && (
              <Link to="/warden/dashboard" className="text-white hover:text-blue-200 transition-colors">
                Dashboard
              </Link>
            )}
            {currentUser && userRole === 'student' && (
              <Link to="/student/dashboard" className="text-white hover:text-blue-200 transition-colors">
                Dashboard
              </Link>
            )}
          </nav>

          {/* User profile or login/signup */}
          <div className="hidden md:block">
            {currentUser ? (
              <div className="relative">
                <button 
                  onClick={toggleProfile}
                  className="flex items-center text-white hover:text-blue-200 focus:outline-none"
                >
                  <FaUserCircle className="mr-2 text-xl" />
                  <span className="mr-1">{currentUser.displayName || currentUser.email}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-fade-in">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <p className="font-semibold">{currentUser.displayName}</p>
                      <p className="text-xs text-gray-500">{currentUser.email}</p>
                      <p className="text-xs font-medium text-primary-600 mt-1 capitalize">{userRole}</p>
                    </div>
                    <Link 
                      to="/profile" 
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      Profile Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                      <FaSignOutAlt className="mr-2" /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-x-4">
                <Link to="/login" className="text-white hover:text-blue-200">
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-accent-500 hover:bg-accent-400 text-white px-4 py-2 rounded-md transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMenu}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-in">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              {currentUser && userRole === 'warden' && (
                <Link 
                  to="/warden/dashboard" 
                  className="text-white hover:text-blue-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              {currentUser && userRole === 'student' && (
                <Link 
                  to="/student/dashboard" 
                  className="text-white hover:text-blue-200 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              )}
              <Link 
                to="/about" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              
              {currentUser ? (
                <>
                  <Link 
                    to="/profile" 
                    className="text-white hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile Settings
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center text-white hover:text-red-300 transition-colors"
                  >
                    <FaSignOutAlt className="mr-2" /> Sign Out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link 
                    to="/login" 
                    className="text-white hover:text-blue-200 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="bg-accent-500 hover:bg-accent-400 text-white px-4 py-2 rounded-md transition inline-block text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}