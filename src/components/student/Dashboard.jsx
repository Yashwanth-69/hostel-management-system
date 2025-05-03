import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaHome, 
  FaBullhorn, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaUserAlt, 
  FaDoorOpen,
  FaCalendarAlt
} from 'react-icons/fa';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [studentInfo, setStudentInfo] = useState(null);
  const [roomInfo, setRoomInfo] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [payments, setPayments] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStudentData() {
      if (!currentUser) return;

      try {
        // Fetch student profile
        const studentDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (studentDoc.exists()) {
          setStudentInfo(studentDoc.data());
        }
        
        // Fetch student's room
        const roomsQuery = query(
          collection(db, 'roomAllocations'),
          where('studentId', '==', currentUser.uid),
          where('active', '==', true),
          limit(1)
        );
        const roomSnapshot = await getDocs(roomsQuery);
        
        if (!roomSnapshot.empty) {
          const allocation = roomSnapshot.docs[0].data();
          const roomDoc = await getDoc(doc(db, 'rooms', allocation.roomId));
          
          if (roomDoc.exists()) {
            setRoomInfo({
              ...roomDoc.data(),
              id: roomDoc.id,
              allocatedFrom: allocation.allocatedFrom?.toDate?.() || allocation.allocatedFrom
            });
          }
        }
        
        // Fetch announcements
        const announcementsQuery = query(
          collection(db, 'announcements'),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const announcementsSnapshot = await getDocs(announcementsQuery);
        setAnnouncements(
          announcementsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          }))
        );
        
        // Fetch pending payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('studentId', '==', currentUser.uid),
          orderBy('dueDate', 'asc')
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        setPayments(
          paymentsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            dueDate: doc.data().dueDate?.toDate?.() || new Date()
          }))
        );
        
        // Fetch recent complaints
        const complaintsQuery = query(
          collection(db, 'complaints'),
          where('studentId', '==', currentUser.uid),
          orderBy('createdAt', 'desc'),
          limit(3)
        );
        const complaintsSnapshot = await getDocs(complaintsQuery);
        setComplaints(
          complaintsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate?.() || new Date()
          }))
        );
      } catch (error) {
        console.error("Error fetching student data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStudentData();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-primary-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const pendingPayments = payments.filter(payment => payment.status === 'pending');

  return (
    <div className="min-h-screen bg-gray-300 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-black mb-2">Student Dashboard</h1>
        <p className="text-gray-600 mb-8">Welcome back, {studentInfo?.displayName || currentUser.displayName}!</p>
        
        {/* Main cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          {/* Student Info */}
          <div className="card md:col-span-1">
            <div className="p-4 bg-gradient-primary rounded-t-lg border-solid border-black">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaUserAlt className="mr-2" /> Student Information
              </h2>
            </div>
            <div className="p-6">
              <div className="flex flex-col items-center mb-4">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 mb-3">
                  {studentInfo?.photoURL ? (
                    <img 
                      src={studentInfo.photoURL} 
                      alt="Profile" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    <FaUserAlt className="text-4xl" />
                  )}
                </div>
                <h3 className="text-xl font-sbold text-black">{studentInfo?.displayName || currentUser.displayName}</h3>
                <p className="text-gray-500">{studentInfo?.rollNo || "ID not assigned"}</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-2 border-b  text-black">
                  <span className="text-gray-600">Email:  </span>
                  <span className="font-medium text-black">{currentUser.email}</span>
                </div>
                {studentInfo?.phone && (
                  <div className="flex items-center justify-between pb-2 border-b  text-black">
                    <span className="text-gray-600">Phone:</span>
                    <span className="font-medium">{studentInfo.phone}</span>
                  </div>
                )}
                {studentInfo?.course && (
                  <div className="flex items-center justify-between pb-2 border-b  text-black">
                    <span className="text-gray-600">Course:</span>
                    <span className="font-medium">{studentInfo.course}</span>
                  </div>
                )}
                {studentInfo?.batch && (
                  <div className="flex items-center justify-between pb-2 border-b text-black">
                    <span className="text-gray-600">Batch:</span>
                    <span className="font-medium">{studentInfo.batch}</span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <Link 
                  to="/student/profile" 
                  className="btn btn-outline w-full"
                >
                  Edit Profile
                </Link>
              </div>
            </div>
          </div>
        
        </div>
        
        {/* Announcements */}
        <div className="card mb-8">
          <div className="p-4 bg-gradient-primary rounded-t-lg">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaBullhorn className="mr-2" /> Announcements
            </h2>
          </div>
          <div className="p-4">
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map(announcement => (
                  <div 
                    key={announcement.id} 
                    className={`p-4 rounded-lg border ${
                      announcement.priority === 'high' 
                        ? 'border-red-200 bg-red-50' 
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-lg text-black">{announcement.title}</h3>
                      <div className="flex items-center">
                        {announcement.priority === 'high' && (
                          <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded mr-2">
                            High Priority
                          </span>
                        )}
                        <span className="text-sm text-gray-500">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600">{announcement.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-6">No announcements available</p>
            )}
            
            <div className="mt-4 text-center">
              <Link 
                to="/student/announcements" 
                className="text-accent-600 hover:underline"
              >
                View all announcements
              </Link>
            </div>
          </div>
        </div>
        
        {/* Recent Complaints */}
        <div className="card">
          <div className="p-4 bg-gradient-primary rounded-t-lg">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaExclamationTriangle className="mr-2" /> Recent Complaints
            </h2>
          </div>
          <div className="p-">
            {complaints.length > 0 ? (
              <div className="space-y-4">
                {complaints.map(complaint => (
                  <div key={complaint.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-semibold text-black">{complaint.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded ${
                        complaint.status === 'Pending' 
                          ? 'bg-amber-100 text-amber-800' 
                          : complaint.status === 'in-progress' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-green-100 text-green-800'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{complaint.complaintDescription}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Submitted on: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                      {complaint.updatedAt && (
                        <span>Last updated: {new Date(complaint.updatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-4">You haven't submitted any complaints yet</p>
                <Link 
                  to="/student/complaints/new" 
                  className="btn btn-primary"
                >
                  Submit a Complaint
                </Link>
              </div>
            )}
            
            {complaints.length > 0 && (
              <div className="mt-6 flex justify-center space-x-4">
                <Link 
                  to="/student/complaints/new" 
                  className="btn btn-primary"
                >
                  Submit New
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}