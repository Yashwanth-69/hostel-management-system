import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaUserShield, FaUserGraduate } from 'react-icons/fa';

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
    roomNo: '',
    batch: '',
    branch: '',
    rollNo: ''  // Add Roll No field here
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Form validation
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password should be at least 6 characters');
    }
    
    if (!formData.role) {
      return setError('Please select a role');
    }
    
    try {
      setError('');
      setLoading(true);
      
      // Signup with new data including roomNo, batch, branch, and rollNo
      await signup(
        formData.email, 
        formData.password, 
        formData.fullName, 
        formData.role,
        formData.roomNo,
        formData.batch,
        formData.branch,
        formData.rollNo  // Include Roll No
      );
      
      navigate('/');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError('Email is already in use');
      } else {
        setError('Failed to create an account. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-card">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Create an Account</h2>
          <p className="mt-2 text-sm text-gray-600">
            Register for VNRVJIET Hostel Management System
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex items-center">
              <FaExclamationCircle className="text-red-500 mr-2" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          </div>
        )}
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="sr-only">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="Full Name"
                />
              </div>
            </div>
            
            {/* Email */}
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="Email address"
                />
              </div>
            </div>
            
            {/* Password */}
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="Password (min. 6 characters)"
                />
              </div>
            </div>
            
            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input pl-10"
                  placeholder="Confirm Password"
                />
              </div>
            </div>

            {/* Roll Number */}
            <div>
              <label htmlFor="rollNo" className="sr-only">Roll Number</label>
              <div className="relative">
                <input
                  id="rollNo"
                  name="rollNo"
                  type="text"
                  required
                  value={formData.rollNo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Roll Number"
                />
              </div>
            </div>

            {/* Room Number */}
            <div>
              <label htmlFor="roomNo" className="sr-only">Room Number</label>
              <div className="relative">
                <input
                  id="roomNo"
                  name="roomNo"
                  type="text"
                  required
                  value={formData.roomNo}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Room Number"
                />
              </div>
            </div>

            {/* Batch */}
            <div>
              <label htmlFor="batch" className="sr-only">Batch</label>
              <div className="relative">
                <input
                  id="batch"
                  name="batch"
                  type="text"
                  required
                  value={formData.batch}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Batch"
                />
              </div>
            </div>

            {/* Branch */}
            <div>
              <label htmlFor="branch" className="sr-only">Branch</label>
              <div className="relative">
                <input
                  id="branch"
                  name="branch"
                  type="text"
                  required
                  value={formData.branch}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Branch"
                />
              </div>
            </div>

            {/* Role Selection */}
            <div className="flex gap-4 mt-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'student' })}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  formData.role === 'student'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <FaUserGraduate className="text-lg" />
                Student
              </button>
              
              <button
                type="button"
                onClick={() => setFormData({ ...formData, role: 'warden' })}
                className={`flex-1 py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition ${
                  formData.role === 'warden'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
              >
                <FaUserShield className="text-lg" />
                Warden
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary w-full flex justify-center py-3"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-accent-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
