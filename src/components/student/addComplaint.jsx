import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, addDoc,doc,getDoc } from 'firebase/firestore';
import { FaExclamationCircle } from 'react-icons/fa';
import { auth } from '../../firebase/config';
import { getAuth } from 'firebase/auth';

export default function AddStudentComplaints() {
  const [title, setTitle] = useState('');
  const [complaint, setComplaint] = useState('');
  const [studentId, setStudentId] = useState(''); // Assuming you have the student ID dynamically (e.g., from authentication)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch student ID if using Firebase Authentication or another method
  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser; // Fetch the currently logged-in user
    if (user) {
      setStudentId(user.uid); // Set the user ID
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !complaint.trim()) {
      setError('Both Title and Complaint description are required!');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      // Adding complaint to Firestore
      const complaintsRef = collection(db, 'complaints');
      const userDoc = await getDoc(doc(db, 'users', studentId));
      const Name = userDoc.exists() ? userDoc.data().displayName : '';
      await addDoc(complaintsRef, {
        title, // Title field
        studentName:Name,
        complaintDescription: complaint,
        studentId, // Add student ID
        createdAt: new Date(),
        status: 'Pending', // Default status is 'Pending'
      });

      setSuccess('Your complaint has been submitted successfully!');
      setTitle(''); // Clear the title
      setComplaint(''); // Clear the complaint description
    } catch (error) {
      setError('Failed to submit the complaint. Please try again later.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white-800 mb-6">Submit a Complaint</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
          {/* Title Field */}
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 text-lg font-semibold mb-2">
              Complaint Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title of your complaint"
              className="input input-bordered w-full p-2 text-white"
            />
          </div>

          {/* Complaint Description Field */}
          <div className="mb-4">
            <label htmlFor="complaint" className="block text-gray-700 text-lg font-semibold mb-2">
              Complaint Description
            </label>
            <textarea
              id="complaint"
              value={complaint}
              onChange={(e) => setComplaint(e.target.value)}
              rows="5"
              placeholder="Describe your complaint here..."
              className="input input-bordered w-full p-2 text-white"
            />
          </div>

          {/* Display Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Display Success Message */}
          {success && <p className="text-green-500 text-sm mt-2">{success}</p>}

          <button
            type="submit"
            className="btn btn-primary w-full mt-4"
            disabled={loading}
          >
            {loading ? (
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white mx-auto"></div>
            ) : (
              'Submit Complaint'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
