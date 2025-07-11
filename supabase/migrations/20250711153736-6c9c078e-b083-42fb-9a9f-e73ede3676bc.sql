
-- Update notifications table to include the new_job_application type
ALTER TABLE public.notifications DROP CONSTRAINT IF EXISTS notifications_type_check;
ALTER TABLE public.notifications ADD CONSTRAINT notifications_type_check 
  CHECK (type IN ('job_application_accepted', 'job_application_rejected', 'new_job_application'));

-- Ensure the trigger function exists and works correctly
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

-- Ensure the trigger exists
DROP TRIGGER IF EXISTS trigger_notify_applicant_on_status_change ON public.job_applications;
CREATE TRIGGER trigger_notify_applicant_on_status_change
  AFTER UPDATE ON public.job_applications
  FOR EACH ROW
  EXECUTE FUNCTION notify_applicant_on_status_change();
