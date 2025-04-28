import { collection } from 'firebase/firestore';
import { db } from './config';

// Collection references
export const usersRef = collection(db, 'users');
export const roomsRef = collection(db, 'rooms');
export const roomAllocationsRef = collection(db, 'roomAllocations');
export const announcementsRef = collection(db, 'announcements');
export const complaintsRef = collection(db, 'complaints');
export const paymentsRef = collection(db, 'payments');

// Collection schemas (for reference)
export const schemas = {
  users: {
    email: 'string',
    displayName: 'string',
    role: 'string', // 'warden' | 'student'
    studentId: 'string?', // Only for students
    phone: 'string?',
    course: 'string?', // Only for students
    batch: 'string?', // Only for students
    createdAt: 'timestamp'
  },
  
  rooms: {
    roomNumber: 'string',
    block: 'string',
    floor: 'string',
    type: 'string', // 'single' | 'double' | 'triple'
    capacity: 'number',
    status: 'string', // 'vacant' | 'occupied' | 'maintenance'
    facilities: 'array', // ['AC', 'Attached Bathroom', etc.]
    currentOccupants: 'number',
    lastMaintenance: 'timestamp?'
  },
  
  roomAllocations: {
    roomId: 'string',
    studentId: 'string',
    allocatedFrom: 'timestamp',
    allocatedUntil: 'timestamp?',
    active: 'boolean',
    createdBy: 'string', // Warden's ID
    createdAt: 'timestamp'
  },
  
  announcements: {
    title: 'string',
    content: 'string',
    priority: 'string', // 'low' | 'medium' | 'high'
    createdBy: 'string', // Warden's ID
    createdAt: 'timestamp',
    updatedAt: 'timestamp?'
  },
  
  complaints: {
    studentId: 'string',
    studentName: 'string',
    title: 'string',
    description: 'string',
    category: 'string', // 'maintenance' | 'facility' | 'other'
    status: 'string', // 'pending' | 'in-progress' | 'resolved'
    priority: 'string', // 'low' | 'medium' | 'high'
    assignedTo: 'string?', // Warden's ID
    resolution: 'string?',
    createdAt: 'timestamp',
    updatedAt: 'timestamp?',
    resolvedAt: 'timestamp?'
  },
  
  payments: {
    studentId: 'string',
    studentName: 'string',
    amount: 'number',
    description: 'string',
    type: 'string', // 'hostel_fee' | 'mess_fee' | 'other'
    status: 'string', // 'pending' | 'paid' | 'overdue'
    dueDate: 'timestamp',
    paidAt: 'timestamp?',
    transactionId: 'string?',
    createdBy: 'string', // Warden's ID
    createdAt: 'timestamp'
  }
};