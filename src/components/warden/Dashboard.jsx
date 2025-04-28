import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where, limit, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { 
  FaUserGraduate, 
  FaDoorOpen, 
  FaBullhorn, 
  FaExclamationTriangle, 
  FaMoneyBillWave, 
  FaLongArrowAltRight 
} from 'react-icons/fa';

export default function WardenDashboard() {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalRooms: 0,
    vacantRooms: 0,
    pendingComplaints: 0,
    pendingPayments: 0,
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        // Fetch student count
        const studentsSnapshot = await getDocs(collection(db, 'users'));
        const studentCount = studentsSnapshot.docs.filter(doc => doc.data().role === 'student').length;
        
        // Fetch room data
        const roomsSnapshot = await getDocs(collection(db, 'rooms'));
        const roomCount = roomsSnapshot.size;
        const vacantCount = roomsSnapshot.docs.filter(doc => doc.data().status === 'vacant').length;
        
        // Fetch pending complaints
        const complaintsQuery = query(
          collection(db, 'complaints'),
          where('status', '==', 'Pending'),
        );
        const complaintsSnapshot = await getDocs(complaintsQuery);
        
        // Fetch pending payments
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('status', '==', 'pending'),
        );
        const paymentsSnapshot = await getDocs(paymentsQuery);
        
        // Fetch recent announcements
        const announcementsQuery = query(
          collection(db, 'announcements'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const announcementsSnapshot = await getDocs(announcementsQuery);
        const announcements = announcementsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        
        // Fetch recent complaints
        const recentComplaintsQuery = query(
          collection(db, 'complaints'),
          orderBy('createdAt', 'desc'),
          limit(5)
        );
        const recentComplaintsSnapshot = await getDocs(recentComplaintsQuery);
        const complaints = recentComplaintsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() || new Date()
        }));
        
        setStats({
          totalStudents: studentCount,
          totalRooms: roomCount,
          vacantRooms: vacantCount,
          pendingComplaints: complaintsSnapshot.size,
          pendingPayments: paymentsSnapshot.size,
        });
        
        setRecentAnnouncements(announcements);
        setRecentComplaints(complaints);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-primary-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-500 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Warden Dashboard</h1>
        
        {/* Stats cards */}
        <div className="flex flex-wrap justify-around gap-2 mb-8 ">
          <div className="card flex items-center p-4 border-l-4 border-blue-500">
            <div className="p-3 rounded-full bg-blue-100 mr-4">
              <FaUserGraduate className="text-blue-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalStudents}</p>
            </div>
          </div>
          
          <div className="card flex items-center p-4 border-l-4 border-green-500">
            <div className="p-3 rounded-full bg-green-100 mr-4">
              <FaDoorOpen className="text-green-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Rooms</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
            </div>
          </div>
          
          <div className="card flex items-center p-4 border-l-4 border-purple-500">
            <div className="p-3 rounded-full bg-purple-100 mr-4">
              <FaDoorOpen className="text-purple-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Vacant Rooms</p>
              <p className="text-2xl font-bold text-gray-800">{stats.vacantRooms}</p>
            </div>
          </div>
          
          <div className="card flex items-center p-4 border-l-4 border-amber-500">
            <div className="p-3 rounded-full bg-amber-100 mr-4">
              <FaExclamationTriangle className="text-amber-500 text-xl" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Complaints</p>
              <p className="text-2xl font-bold text-gray-800">{stats.pendingComplaints}</p>
            </div>
          </div>
          
        </div>
        
        {/* Quick access cards */}
        <div className="flex flex-wrap justify-center gap-6 mb-8">
          <Link to="/warden/students" className="card p-6 text-center hover:shadow-lg transition-shadow bg-blue-200">
            <div className="rounded-full bg-blue-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FaUserGraduate className="text-blue-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Student Management</h3>
            <p className="text-sm text-gray-500 mb-4">Manage student profiles and allocations</p>
            <span className="text-blue-500 flex items-center justify-center">
              Access <FaLongArrowAltRight className="ml-1" />
            </span>
          </Link>
          
          <Link to="/warden/rooms" className="card p-6 text-center hover:shadow-lg transition-shadow bg-green-100">
            <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FaDoorOpen className="text-green-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Room Management</h3>
            <p className="text-sm text-gray-500 mb-4">Allocate and manage hostel rooms</p>
            <span className="text-green-500 flex items-center justify-center">
              Access <FaLongArrowAltRight className="ml-1" />
            </span>
          </Link>
          
          <Link to="/warden/announcements" className="card p-6 text-center hover:shadow-lg transition-shadow bg-purple-200">
            <div className="rounded-full bg-indigo-100 w-12 h-12 flex items-center justify-center mx-auto mb-4">
              <FaBullhorn className="text-indigo-500 text-xl" />
            </div>
            <h3 className="font-semibold text-gray-800 mb-1">Announcements</h3>
            <p className="text-sm text-black mb-4">Post and manage announcements</p>
            <span className="text-indigo-500 flex items-center justify-center">
              Access <FaLongArrowAltRight className="ml-1" />
            </span>
          </Link>
          
         
          
         
        </div>
        
        {/* Recent content sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent announcements */}
          <div className="card overflow-hidden">
            <div className="p-4 bg-gradient-primary">
              <h2 className="text-xl font-semibold text-white flex items-center">
                <FaBullhorn className="mr-2" /> Recent Announcements
              </h2>
            </div>
            <div className="p-4">
              {recentAnnouncements.length > 0 ? (
                <ul className="divide-y">
                  {recentAnnouncements.map(announcement => (
                    <li key={announcement.id} className="py-3">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-800">{announcement.title}</h3>
                        <span className="text-xs text-gray-500">
                          {new Date(announcement.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{announcement.content}</p>
                      {announcement.priority === 'high' && (
                        <span className="inline-block px-2 py-1 text-xs bg-red-100 text-red-800 rounded mt-2">
                          High Priority
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 py-4 text-center">No recent announcements</p>
              )}
             <div className="mt-4 text-center">
  <Link 
    to="/warden/announcements" 
    className="btn btn-primary w-full mt-4"
  >
    ADD ANNOUNCEMENT
  </Link>
</div>
            </div>
          </div>
          
          {/* Recent complaints */}
<div className="card overflow-hidden">
  <div className="p-4 bg-gradient-primary flex justify-between items-center">
    <h2 className="text-xl font-semibold text-white flex items-center">
      <FaExclamationTriangle className="mr-2" /> Recent Complaints
    </h2>
    <Link to="/warden/complaints" className="btn btn-primary bg-dark-800 text-white ml-4">
      Resolve Issues
    </Link>
  </div>
  <div className="p-4">
    {recentComplaints.filter(complaint => complaint.status.toLowerCase() === 'pending').length > 0 ? (
      <ul className="divide-y">
        {recentComplaints
          .filter(complaint => complaint.status.toLowerCase() === 'pending')
          .map(complaint => (
            <li key={complaint.id} className="py-3">
              <div className="flex justify-between">
                <h3 className="font-medium text-gray-800">{complaint.title}</h3>
                <span className="text-xs px-2 py-1 rounded bg-amber-100 text-amber-800">
                  Pending
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                From: {complaint.studentName}
              </p>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {complaint.description}
              </p>
            </li>
          ))}
      </ul>
    ) : (
      <p className="text-gray-500 py-4 text-center">No pending complaints</p>
    )}
    <div className="mt-4 text-center">
      <Link 
        to="/warden/complaints" 
        className="text-accent-600 hover:underline text-sm"
      >
        View all complaints
      </Link>
    </div>
  </div>
</div>
        </div>
      </div>
    </div>
  );
}