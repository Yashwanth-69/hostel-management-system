import { db } from './config';
import { collection, doc, setDoc, getDocs, query, limit } from 'firebase/firestore';

export async function initializeDatabase() {
  try {
    // Check if database is already initialized


    // Initialize sample data
    const sampleData = {
      users: [
        {
          id: 'warden-001',
          data: {
            email: 'warden@vnrvjiet.in',
            displayName: 'Head Warden',
            role: 'warden',
            phone: '+91 9876543210',
            createdAt: new Date().toISOString()
          }
        }
      ],
      rooms: [
        {
          id: 'room-101',
          data: {
            roomNumber: '101',
            block: 'A',
            floor: '1',
            type: 'double',
            capacity: 2,
            status: 'vacant',
            facilities: ['Fan', 'Study Table', 'Wardrobe'],
            currentOccupants: 0,
            lastMaintenance: new Date().toISOString()
          }
        },
        {
          id: 'room-102',
          data: {
            roomNumber: '102',
            block: 'A',
            floor: '1',
            type: 'single',
            capacity: 1,
            status: 'vacant',
            facilities: ['Fan', 'Study Table', 'Wardrobe'],
            currentOccupants: 0,
            lastMaintenance: new Date().toISOString()
          }
        }
      ],
      announcements: [
        {
          id: 'announcement-001',
          data: {
            title: 'Welcome to New Semester',
            content: 'Welcome back students! The hostel facilities are ready for the new semester. Please ensure you complete your room registration process.',
            priority: 'high',
            createdBy: 'warden-001',
            createdAt: new Date().toISOString()
          }
        }
      ],
      complaints: [
        {
          id: 'complaint-001',
          data: {
            title: 'Sample Maintenance Request',
            description: 'This is a sample maintenance request to test the system.',
            category: 'maintenance',
            status: 'pending',
            priority: 'medium',
            createdAt: new Date().toISOString()
          }
        }
      ],
      payments: [
        {
          id: 'payment-001',
          data: {
            amount: 25000,
            description: 'First Semester Hostel Fee',
            type: 'hostel_fee',
            status: 'pending',
            dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
            createdAt: new Date().toISOString()
          }
        }
      ]
    };

    // Create collections and documents
    for (const [collection, documents] of Object.entries(sampleData)) {
      for (const { id, data } of documents) {
        await setDoc(doc(db, collection, id), {
          ...data,
          id // Include the ID in the document data
        });
      }
    }

    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error; // Propagate error to handle it in the component
  }
}