import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/config'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

export default function AddAnnouncement() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and Content are required.');
      setLoading(false);
      return;
    }

    try {
      await addDoc(collection(db, 'announcements'), {
        title,
        content,
        priority,
        createdAt: serverTimestamp(),
      });
      navigate('/student/announcements'); // redirect after success
    } catch (err) {
      console.error('Error adding announcement:', err);
      setError('Failed to add announcement. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-300 flex items-center justify-center py-8 px-4">
      <div className="max-w-lg w-full bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Add New Announcement</h1>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-1">Title</label>
            <input 
              type="text" 
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Content</label>
            <textarea 
              className="w-full border border-gray-300 rounded px-3 py-2"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>

          <div>
            <label className="block text-gray-700 mb-1">Priority</label>
            <select 
              className="w-full border border-gray-300 rounded px-3 py-2"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              disabled={loading}
            >
              <option value="normal">Normal</option>
              <option value="high">High</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded"
          >
            {loading ? 'Adding...' : 'Add Announcement'}
          </button>
        </form>
      </div>
    </div>
  );
}
