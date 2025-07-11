
// User and Authentication types
export interface User {
  id: string;
  email: string;
  name?: string;
  role: 'jobseeker' | 'employer';
  avatar?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'jobseeker' | 'employer') => Promise<void>;
  logout: () => void;
  signOut: () => void;
  loading: boolean;
}

// Job types
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange?: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  employerId: string;
  createdAt: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  resumeUrl?: string;
  coverLetter?: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedAt: string;
  reviewedAt?: string;
  employerMessage?: string;
}

// Profile types
export interface UserProfile {
  id: string;
  userId: string;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  bio?: string;
  skills?: string[];
  experience?: string;
  jobTitle?: string;
  resumeUrl?: string;
  avatarUrl?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

// Message types
export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  messageType: 'casual' | 'referral' | 'job_related';
  jobId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Friendship {
  id: string;
  requesterId: string;
  addresseeId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
}
