export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'pastor' | 'leader' | 'member' | 'visitor';
  isActive: boolean;
  memberProfile?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemberProfile {
  id: string;
  user: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  address?: string;
  profilePicture?: string;
  membershipStatus: 'active' | 'inactive' | 'visitor';
  department?: string;
  ministries?: string[];
  dateJoined: Date;
  emergencyContact?: string;
  skills?: string[];
  isProfilePublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Department {
  id: string;
  name: string;
  description: string;
  leaders: string[];
  members: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Sermon {
  id: string;
  title: string;
  speaker: string;
  date: Date;
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
  createdAt: Date;
  updatedAt: Date;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: string;
  banner?: string;
  organizer: string;
  category: string;
  registrationRequired: boolean;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EventRegistration {
  id: string;
  event: string;
  name: string;
  email?: string;
  phone: string;
  numberOfAttendees: number;
  createdAt: Date;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  image?: string;
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
  author: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PrayerRequest {
  id: string;
  subject: string;
  request: string;
  category: string;
  isAnonymous: boolean;
  preferredFollowUp: string;
  status: 'new' | 'being_prayed_for' | 'follow_up_required' | 'resolved';
  submittedBy: string;
  handledBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Testimony {
  id: string;
  title: string;
  testimony: string;
  submittedBy: string;
  isAnonymous: boolean;
  permissionToPublish: boolean;
  status: 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceSession {
  id: string;
  name: string;
  date: Date;
  eventType: string;
  createdBy: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AttendanceRecord {
  id: string;
  session: string;
  member: string;
  status: 'present' | 'absent' | 'visitor' | 'first_timer' | 'child';
  createdAt: Date;
  updatedAt: Date;
}

export interface Donation {
  id: string;
  member: string;
  category: string;
  amount: number;
  paymentMethod: string;
  paymentReference: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  recipient: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GalleryItem {
  id: string;
  album: string;
  type: 'image' | 'video';
  url: string;
  caption?: string;
  createdAt: Date;
}

export interface Leader {
  id: string;
  user: string;
  position: string;
  bio: string;
  photo?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditLog {
  id: string;
  user: string;
  action: string;
  target: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: Date;
}

export interface ChurchSettings {
  id: string;
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
  updatedAt: Date;
}
