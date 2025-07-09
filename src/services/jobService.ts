
import { supabase } from '@/integrations/supabase/client';
import { DatabaseJob, DatabaseJobApplication } from '@/types/supabase';
import { Job, JobApplication } from '@/types';

export class JobService {
  static async createJob(jobData: Omit<DatabaseJob, 'id' | 'created_at' | 'updated_at'>): Promise<DatabaseJob> {
    const { data, error } = await supabase
      .from('jobs')
      .insert([jobData])
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseJob;
  }

  static async getActiveJobs(): Promise<DatabaseJob[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DatabaseJob[];
  }

  static async getEmployerJobs(employerId: string): Promise<DatabaseJob[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('employer_id', employerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DatabaseJob[];
  }

  static async searchJobs(skills: string[], location?: string): Promise<DatabaseJob[]> {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('is_active', true);

    if (skills.length > 0) {
      query = query.overlaps('required_skills', skills);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DatabaseJob[];
  }

  static async getJobApplications(jobId: string): Promise<DatabaseJobApplication[]> {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });

    if (error) throw error;
    return (data || []) as DatabaseJobApplication[];
  }

  static async applyToJob(applicationData: Omit<DatabaseJobApplication, 'id' | 'applied_at' | 'reviewed_at'>): Promise<DatabaseJobApplication> {
    const { data, error } = await supabase
      .from('job_applications')
      .insert([applicationData])
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseJobApplication;
  }

  static async updateApplicationStatus(
    applicationId: string, 
    status: 'pending' | 'accepted' | 'rejected',
    employerMessage?: string
  ): Promise<DatabaseJobApplication> {
    const updateData: any = { 
      status, 
      reviewed_at: new Date().toISOString() 
    };
    
    if (employerMessage) {
      updateData.employer_message = employerMessage;
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update(updateData)
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data as DatabaseJobApplication;
  }

  static async deleteJob(jobId: string): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', jobId);

    if (error) throw error;
  }

  static async toggleJobStatus(jobId: string, isActive: boolean): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ is_active: isActive })
      .eq('id', jobId);

    if (error) throw error;
  }
}
