import { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaSearch, FaDownload } from 'react-icons/fa';

export default function StudentManagement() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    batch: '',
    roomNo: '',
    roomStatus: ''
  });

  useEffect(() => {
    async function fetchStudents() {
      try {
        const studentsQuery = query(
          collection(db, 'users'),
          where('role', '==', 'student'),
          orderBy('displayName')
        );
        
        const snapshot = await getDocs(studentsQuery);
        const studentsList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setStudents(studentsList);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchStudents();
  }, []);

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNo?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBatch = !filters.batch || student.batch === filters.batch;
    const matchesRoomStatus = !filters.roomStatus || 
      (filters.roomStatus === 'allocated' && student.roomNo) ||
      (filters.roomStatus === 'not_allocated' && !student.roomNo);

    const matchesRoomNo = !filters.roomNo || (student.roomNo && student.roomNo.toString() === filters.roomNo.toString());

    return matchesSearch && matchesBatch && matchesRoomStatus && matchesRoomNo;
  });

  const handleExport = () => {
    console.log('Exporting student data...');
    // Add export functionality here if needed
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Student Management</h1>
        <button
          onClick={handleExport}
          className="btn btn-outline flex items-center"
        >
          <FaDownload className="mr-2" /> Export Data
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-card p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search Bar */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-4 flex-wrap">
 

  {/* Filters (Batch, Room No, Room Status - each around 13% - flex-1) */}
  <div className="flex-1 min-w-[120px]">
    <select
      value={filters.batch}
      onChange={(e) => setFilters(prev => ({ ...prev, batch: e.target.value }))}
      className="form-input w-full"
    >
      <option value="">All Batches</option>
      <option value="2025">2025</option>
      <option value="2024">2024</option>
      <option value="2023">2023</option>
      <option value="2022">2022</option>
      <option value="2021">2021</option>
    </select>
  </div>

  <div className="flex-1 min-w-[120px]">
    <input
      type="text"
      placeholder="Room No."
      value={filters.roomNo}
      onChange={(e) => setFilters(prev => ({ ...prev, roomNo: e.target.value }))}
      className="form-input w-full"
    />
  </div>

  <div className="flex-1 min-w-[120px]">
    <select
      value={filters.roomStatus}
      onChange={(e) => setFilters(prev => ({ ...prev, roomStatus: e.target.value }))}
      className="form-input w-full"
    >
      <option value="">Room Status</option>
      <option value="allocated">Allocated</option>
      <option value="not_allocated">Not Allocated</option>
    </select>
  </div>
</div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-lg shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Roll No
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Room
                </th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map(student => (
                <tr key={student.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-black">
                    {student.rollNo || 'Not assigned'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.displayName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                    {student.batch || 'Not specified'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      student.roomNo 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {student.roomNo || 'Not allocated'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button className="text-accent-600 hover:text-accent-900">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
