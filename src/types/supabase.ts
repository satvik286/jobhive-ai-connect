
export interface DatabaseJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  salary_range: string | null;
  job_type: 'full-time' | 'part-time' | 'contract' | 'freelance';
  required_skills: string[] | null;
  experience_level: string | null;
  employer_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseJobApplication {
  id: string;
  job_id: string;
  applicant_id: string;
  resume_url: string | null;
  cover_letter: string | null;
  status: 'pending' | 'accepted' | 'rejected';
  applied_at: string;
  reviewed_at: string | null;
  employer_message: string | null;
}

export interface DatabaseUserProfile {
  id: string;
  user_id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  experience: string | null;
  job_title: string | null;
  resume_url: string | null;
  avatar_url: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
}

export interface DatabaseMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  message_type: 'casual' | 'referral' | 'job_related';
  job_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface DatabaseFriendship {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}
