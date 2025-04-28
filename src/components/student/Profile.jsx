import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const branchOptions = ['IT', 'CSE', 'MECH', 'AE', 'EIE', 'ECE', 'EEE', 'AIML', 'IoT'];

export default function Profile() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState('');
  const [currentValue, setCurrentValue] = useState('');

  useEffect(() => {
    async function fetchProfile() {
      try {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setProfile(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    
    fetchProfile();
  }, [currentUser]);

  const openModal = (field, value) => {
    setCurrentField(field);
    setCurrentValue(value || '');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setCurrentField('');
    setCurrentValue('');
  };

  const handleSave = async () => {
    if (!currentField) return;

    if (currentField === 'branch' && currentValue === '') {
      toast.error('Please select a valid branch');
      return;
    }

    const updateObj = { [currentField]: currentValue };

    try {
      const docRef = doc(db, 'users', currentUser.uid);
      await updateDoc(docRef, updateObj);

      setProfile(prev => ({
        ...prev,
        ...updateObj
      }));

      toast.success('Profile updated successfully');
      closeModal();
    } catch (error) {
      console.error('Error updating field:', error);
      toast.error('Failed to update profile');
    }
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
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Profile</h1>

        <div className="bg-white rounded-lg shadow-card p-6 space-y-4 text-black border border-black">
          {/* Profile Fields */}
          <ProfileField label="Full Name" value={profile?.displayName} icon={<FaUser />} onEdit={() => openModal('displayName', profile?.displayName)} />
          <ProfileField label="Email" value={currentUser.email} icon={<FaEnvelope />} editable={false} />
          <ProfileField label="Phone Number" value={profile?.phone} icon={<FaPhone />} onEdit={() => openModal('phone', profile?.phone)} />
          <ProfileField label="Batch" value={profile?.batch} icon={<FaCalendarAlt />} onEdit={() => openModal('batch', profile?.batch)} />
          <ProfileField label="Branch" value={profile?.branch} icon={<FaGraduationCap />} onEdit={() => openModal('branch', profile?.branch)} />
          <ProfileField label="Room Number" value={profile?.roomNo} icon={<FaMapMarkerAlt />} onEdit={() => openModal('roomNo', profile?.roomNo)} />
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h2 className="text-xl font-bold mb-4">Edit {fieldLabel(currentField)}</h2>

            {currentField === 'branch' ? (
              <select
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full form-select mb-4"
              >
                <option value="">Select Branch</option>
                {branchOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={currentValue}
                onChange={(e) => setCurrentValue(e.target.value)}
                className="w-full form-input mb-4"
              />
            )}

            <div className="flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="btn btn-primary"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProfileField({ label, value, icon, onEdit, editable = true }) {
  return (
    <div className="flex items-center p-3 bg-gray-200 rounded justify-between border border-black mb-4 hover:bg-gray-300 transition duration-200">
      <div className="flex items-center">
        {icon && <div className="text-gray-600 mr-3">{icon}</div>}
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="font-medium">{value || 'Not provided'}</p>
        </div>
      </div>
      {editable && (
        <button onClick={onEdit} className="btn btn-outline btn-sm">
          Edit
        </button>
      )}
    </div>
  );
}

// Helper to prettify field labels
function fieldLabel(field) {
  const map = {
    displayName: 'Full Name',
    phone: 'Phone Number',
    batch: 'Batch',
    branch: 'Branch',
    roomNo: 'Room Number'
  };
  return map[field] || field;
}
