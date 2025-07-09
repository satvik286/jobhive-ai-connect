
import { supabase } from '@/integrations/supabase/client';
import { DatabaseUserProfile } from '@/types/supabase';

export class ProfileService {
  static async getProfile(userId: string): Promise<DatabaseUserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  }

  static async createOrUpdateProfile(profileData: Partial<DatabaseUserProfile>): Promise<DatabaseUserProfile> {
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', profileData.user_id)
      .single();

    if (existingProfile) {
      const { data, error } = await supabase
        .from('user_profiles')
        .update({ ...profileData, updated_at: new Date().toISOString() })
        .eq('user_id', profileData.user_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } else {
      const { data, error } = await supabase
        .from('user_profiles')
        .insert([profileData])
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  static async searchProfiles(skills?: string[], location?: string): Promise<DatabaseUserProfile[]> {
    let query = supabase
      .from('user_profiles')
      .select('*')
      .eq('is_public', true);

    if (skills && skills.length > 0) {
      query = query.overlaps('skills', skills);
    }

    if (location) {
      query = query.ilike('location', `%${location}%`);
    }

    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }
}
