import { useState, useEffect } from 'react';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/config';
import { FaDoorOpen, FaSearch, FaPlus } from 'react-icons/fa';

export default function WardenRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New room fields
  const [newRoom, setNewRoom] = useState({
    block: '',
    capacity: '',
    currentOccupants: '',
    floor: '',
    type: '',
    roomNumber: '',
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    setLoading(true);
    try {
      const roomsQuery = collection(db, 'rooms');
      const roomsSnapshot = await getDocs(roomsQuery);
      
      const roomData = roomsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setRooms(roomData);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleInputChange = (e) => {
    setNewRoom({ ...newRoom, [e.target.name]: e.target.value });
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'rooms'), {
        ...newRoom,
        capacity: Number(newRoom.capacity),
        currentOccupants: Number(newRoom.currentOccupants),
        floor: Number(newRoom.floor),
      });
      setIsModalOpen(false);
      setNewRoom({
        block: '',
        capacity: '',
        currentOccupants: '',
        floor: '',
        type: '',
        roomNumber: '',
      });
      fetchRooms(); // Refresh list
    } catch (error) {
      console.error('Error adding room:', error);
    }
  };

  const filteredRooms = rooms.filter(room => 
    room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-primary-600">Loading room details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Room Details</h1>
          <button 
            className="btn btn-primary flex items-center gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <FaPlus /> Create New Room
          </button>
        </div>

        {/* Search Bar */}
        <div className="mb-6 flex items-center space-x-4">
          <input 
            type="text" 
            placeholder="Search by Room Number" 
            className="input input-bordered w-full p-2" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FaSearch className="text-gray-600" />
        </div>

        {/* Room Cards/List */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredRooms.length > 0 ? (
            filteredRooms.map(room => (
              <div key={room.id} className="card p-4 border rounded-lg shadow-md hover:shadow-xl">
                <div className="flex justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{room.roomNumber}</h2>
                  <span className="text-sm text-gray-500">{room.type}</span>
                </div>
                <p className="text-gray-600">Capacity: {room.capacity} people</p>
                <p className="text-gray-600">Current Occupants: {room.currentOccupants}</p>
                <p className="text-gray-600">Block: {room.block}</p>
                <p className="text-gray-600">Floor: {room.floor}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500 py-6">No rooms available</p>
          )}
        </div>
      </div>

      {/* Modal for Adding Room */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Create New Room</h2>
            <form onSubmit={handleAddRoom} className="space-y-4">
              <input
                type="text"
                name="block"
                placeholder="Block"
                value={newRoom.block}
                onChange={handleInputChange}
                className="input input-bordered w-full p-2"
                required
              />
              <input
                type="number"
                name="capacity"
                placeholder="Capacity"
                value={newRoom.capacity}
                onChange={handleInputChange}
                className="input input-bordered w-full p-2"
                required
              />
              <input
                type="number"
                name="currentOccupants"
                placeholder="Current Occupants"
                value={newRoom.currentOccupants}
                onChange={handleInputChange}
                className="input input-bordered w-full p-2"
                required
              />
              <input
                type="number"
                name="floor"
                placeholder="Floor"
                value={newRoom.floor}
                onChange={handleInputChange}
                className="input input-bordered w-full p-2"
                required
              />
              <input
                type="text"
                name="type"
                placeholder="Room Type (e.g. Single / double/ triple / etc)"
                value={newRoom.type}
                onChange={handleInputChange}
                className="input input-bordered w-full p-2"
                required
              />
              <input
                type="text"
                name="roomNumber"
                placeholder="Room Number"
                value={newRoom.roomNumber}
                onChange={handleInputChange}
                className="input input-bordered w-full p-2"
                required
              />

              <div className="flex justify-end gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
