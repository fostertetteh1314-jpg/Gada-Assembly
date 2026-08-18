export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'pastor' | 'leader' | 'member' | 'visitor';
  isActive: boolean;
  memberProfile?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MemberProfile {
  _id: string;
  user: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  profilePicture?: string;
  membershipStatus: 'active' | 'inactive' | 'visitor';
  department?: string;
  ministries?: string[];
  dateJoined: string;
  emergencyContact?: string;
  skills?: string[];
  isProfilePublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Department {
  _id: string;
  name: string;
  description: string;
  leaders: string[];
  members: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Sermon {
  _id: string;
  title: string;
  speaker: string;
  date: string;
  scripture: string;
  description: string;
  category: string;
  thumbnail?: string;
  audioUrl?: string;
  videoUrl?: string;
  duration?: number;
  tags: string[];
  isPublished: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  _id: string;
  name: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  location: string;
  banner?: string;
  organizer: string;
  category: string;
  registrationRequired: boolean;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  image?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: string;
  author: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PrayerRequest {
  _id: string;
  subject: string;
  request: string;
  category: string;
  isAnonymous: boolean;
  preferredFollowUp?: string;
  status: 'new' | 'being_prayed_for' | 'follow_up_required' | 'resolved';
  submittedBy: string;
  handledBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Testimony {
  _id: string;
  title: string;
  testimony: string;
  submittedBy: string;
  isAnonymous: boolean;
  permissionToPublish: boolean;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceSession {
  _id: string;
  name: string;
  date: string;
  eventType: string;
  createdBy: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  _id: string;
  session: string;
  member: string;
  status: 'present' | 'absent' | 'visitor' | 'first_timer' | 'child';
  createdAt: string;
  updatedAt: string;
}

export interface Donation {
  _id: string;
  member: string;
  category: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface GalleryAlbum {
  _id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface GalleryItem {
  _id: string;
  album: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  createdAt: string;
}

export interface Leader {
  _id: string;
  user: string;
  position: string;
  bio: string;
  photo?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ChurchSettings {
  churchName: string;
  district: string;
  assemblyName: string;
  description: string;
  logo?: string;
  phone: string;
  email: string;
  address: string;
  serviceTimes: Record<string, string>;
  socialLinks: Record<string, string>;
  givingInstructions: string;
  defaultScripture: { text: string; reference: string };
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  accessToken?: string;
  message?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}
