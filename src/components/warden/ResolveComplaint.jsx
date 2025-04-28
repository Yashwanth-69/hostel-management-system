import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';

export default function ResolveComplaints() {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    async function fetchComplaints() {
      const complaintsQuery = query(
        collection(db, 'complaints'),
        where('status', '!=', 'resolved')  // Fetch only unresolved complaints
      );
      const snapshot = await getDocs(complaintsQuery);
      const complaintsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setComplaints(complaintsList);
    }
    fetchComplaints();
  }, []);

  async function handleResolve(complaintId) {
    const complaintRef = doc(db, 'complaints', complaintId);
    await updateDoc(complaintRef, { status: 'resolved' });
    // Remove the complaint from the UI after resolving
    setComplaints(prev => prev.filter(c => c.id !== complaintId));
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Resolve Complaints</h1>
        {complaints.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-4 border rounded-lg shadow bg-white">
                <h3 className="text-xl font-semibold mb-2 text-black">{complaint.title}</h3>
                <p className="text-gray-600 mb-4">{complaint.description}</p>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id={`resolve-${complaint.id}`} 
                    onChange={() => handleResolve(complaint.id)} 
                    className="mr-2"
                  />
                  <label htmlFor={`resolve-${complaint.id}`} className="text-gray-700">
                    Mark as Resolved
                  </label>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No pending complaints to resolve.</p>
        )}
      </div>
    </div>
  );
}
