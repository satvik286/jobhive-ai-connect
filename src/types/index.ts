
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'jobseeker' | 'employer';
  profileCompleted?: boolean;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salaryRange: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'freelance';
  employerId: string;
  createdAt: string;
  isActive: boolean;
}

export interface JobApplication {
  id: string;
  jobId: string;
  applicantId: string;
  applicantName: string;
  applicantEmail: string;
  resumeUrl: string;
  coverLetter: string;
  appliedAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, role: 'jobseeker' | 'employer') => Promise<void>;
  logout: () => void;
  signOut: () => void;
  loading: boolean;
}
