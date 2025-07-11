
-- Create notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('job_application_accepted', 'job_application_rejected')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  job_id UUID,
  application_id UUID,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create policy for users to view their own notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Create policy for system to insert notifications
CREATE POLICY "System can create notifications" 
  ON public.notifications 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy for users to update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to automatically create notifications when application status changes
CREATE OR REPLACE FUNCTION notify_applicant_on_status_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Only create notification if status changed to accepted or rejected
  IF NEW.status IN ('accepted', 'rejected') AND OLD.status = 'pending' THEN
    INSERT INTO public.notifications (
      user_id,
      type,
      title,
      message,
      job_id,
      application_id
    )
    SELECT 
      NEW.applicant_id,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'job_application_accepted'
        WHEN NEW.status = 'rejected' THEN 'job_application_rejected'
      END,
      CASE 
        WHEN NEW.status = 'accepted' THEN 'Application Accepted!'
        WHEN NEW.status = 'rejected' THEN 'Application Update'
      END,
      CASE 
        WHEN NEW.status = 'accepted' THEN 
          'Congratulations! Your application for "' || j.title || '" at ' || j.company || ' has been accepted.' ||
          CASE WHEN NEW.employer_message IS NOT NULL THEN ' Message from employer: ' || NEW.employer_message ELSE '' END
        WHEN NEW.status = 'rejected' THEN 
          'Your application for "' || j.title || '" at ' || j.company || ' was not selected.' ||
          CASE WHEN NEW.employer_message IS NOT NULL THEN ' Message from employer: ' || NEW.employer_message ELSE '' END
      END,
      NEW.job_id,
      NEW.id
    FROM jobs j
    WHERE j.id = NEW.job_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create notifications
CREATE TRIGGER trigger_notify_applicant_on_status_change
  AFTER UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_applicant_on_status_change();
