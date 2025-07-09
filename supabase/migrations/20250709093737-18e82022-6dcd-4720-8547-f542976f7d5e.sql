
-- Create job applications table
CREATE TABLE public.job_applications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID NOT NULL,
  applicant_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  resume_url TEXT,
  cover_letter TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  applied_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  reviewed_at TIMESTAMP WITH TIME ZONE,
  employer_message TEXT
);

-- Create friendships table for social features
CREATE TABLE public.friendships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  requester_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  addressee_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(requester_id, addressee_id)
);

-- Create messages table for user communications
CREATE TABLE public.messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type TEXT DEFAULT 'casual' CHECK (message_type IN ('casual', 'referral', 'job_related')),
  job_id UUID,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user profiles table for extended profile information
CREATE TABLE public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  name TEXT,
  email TEXT,
  phone TEXT,
  location TEXT,
  bio TEXT,
  skills TEXT[],
  experience TEXT,
  job_title TEXT,
  resume_url TEXT,
  avatar_url TEXT,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create jobs table with enhanced fields
CREATE TABLE public.jobs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT NOT NULL,
  requirements TEXT NOT NULL,
  salary_range TEXT,
  job_type TEXT DEFAULT 'full-time' CHECK (job_type IN ('full-time', 'part-time', 'contract', 'freelance')),
  required_skills TEXT[],
  experience_level TEXT,
  employer_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for job_applications
CREATE POLICY "Users can view applications for their jobs or their own applications" 
  ON public.job_applications FOR SELECT 
  USING (
    applicant_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
  );

CREATE POLICY "Job seekers can create applications" 
  ON public.job_applications FOR INSERT 
  WITH CHECK (applicant_id = auth.uid());

CREATE POLICY "Employers can update application status" 
  ON public.job_applications FOR UPDATE 
  USING (
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = job_applications.job_id AND jobs.employer_id = auth.uid())
  );

-- RLS Policies for friendships
CREATE POLICY "Users can view their own friendships" 
  ON public.friendships FOR SELECT 
  USING (requester_id = auth.uid() OR addressee_id = auth.uid());

CREATE POLICY "Users can create friend requests" 
  ON public.friendships FOR INSERT 
  WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update friendship status" 
  ON public.friendships FOR UPDATE 
  USING (addressee_id = auth.uid());

-- RLS Policies for messages
CREATE POLICY "Users can view their own messages" 
  ON public.messages FOR SELECT 
  USING (sender_id = auth.uid() OR receiver_id = auth.uid());

CREATE POLICY "Users can send messages" 
  ON public.messages FOR INSERT 
  WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can update their received messages" 
  ON public.messages FOR UPDATE 
  USING (receiver_id = auth.uid());

-- RLS Policies for user_profiles
CREATE POLICY "Users can view public profiles or their own" 
  ON public.user_profiles FOR SELECT 
  USING (is_public = true OR user_id = auth.uid());

CREATE POLICY "Users can manage their own profile" 
  ON public.user_profiles FOR ALL 
  USING (user_id = auth.uid());

-- RLS Policies for jobs
CREATE POLICY "Everyone can view active jobs" 
  ON public.jobs FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Employers can manage their own jobs" 
  ON public.jobs FOR ALL 
  USING (employer_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_job_applications_job_id ON public.job_applications(job_id);
CREATE INDEX idx_job_applications_applicant_id ON public.job_applications(applicant_id);
CREATE INDEX idx_friendships_users ON public.friendships(requester_id, addressee_id);
CREATE INDEX idx_messages_users ON public.messages(sender_id, receiver_id);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_jobs_employer_id ON public.jobs(employer_id);
CREATE INDEX idx_jobs_skills ON public.jobs USING GIN(required_skills);
