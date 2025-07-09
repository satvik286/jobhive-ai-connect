
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Edit2, Save, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    bio: '',
    skills: [] as string[],
    experience: '',
    jobTitle: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const handleSkillsChange = (skillsText: string) => {
    const skills = skillsText.split(',').map(skill => skill.trim()).filter(skill => skill);
    setProfileData(prev => ({ ...prev, skills }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Mock API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
      
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Update Failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      location: '',
      bio: '',
      skills: [],
      experience: '',
      jobTitle: '',
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
              My Profile
            </h1>
            <p className="text-muted-foreground text-lg">Manage your account information and preferences</p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)} className="btn-primary">
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={loading} className="btn-primary">
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Saving...' : 'Save'}
                </Button>
                <Button onClick={handleCancel} variant="outline">
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card className="card-enhanced border-2">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder-avatar.png" />
                  <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
              </div>
              <CardTitle className="text-xl">{profileData.name || 'User Name'}</CardTitle>
              <CardDescription className="flex items-center justify-center gap-1">
                <Mail className="h-4 w-4" />
                {profileData.email}
              </CardDescription>
              <Badge variant={user?.role === 'employer' ? 'default' : 'secondary'} className="mt-2 w-fit mx-auto">
                {user?.role === 'employer' ? 'Employer' : 'Job Seeker'}
              </Badge>
            </CardHeader>
            {profileData.bio && (
              <CardContent>
                <Separator className="mb-4" />
                <p className="text-sm text-muted-foreground text-center italic">
                  "{profileData.bio}"
                </p>
              </CardContent>
            )}
          </Card>

          {/* Quick Stats */}
          <Card className="card-enhanced border-2 mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Member Since</p>
                  <p className="text-xs text-muted-foreground">January 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Briefcase className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">
                    {user?.role === 'employer' ? 'Jobs Posted' : 'Applications Sent'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'employer' ? '5 active' : '12 total'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="card-enhanced border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    disabled={!isEditing}
                    className="form-input"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your phone number"
                    className="form-input"
                  />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, State/Country"
                    className="form-input"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {user?.role === 'jobseeker' && (
            <Card className="card-enhanced border-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Professional Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="jobTitle">Current Job Title</Label>
                  <Input
                    id="jobTitle"
                    value={profileData.jobTitle}
                    onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g. Software Developer"
                    className="form-input"
                  />
                </div>
                
                <div>
                  <Label htmlFor="bio">Professional Bio</Label>
                  <textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground form-input resize-none"
                  />
                </div>
                
                <div>
                  <Label htmlFor="skills">Skills (comma-separated)</Label>
                  <Input
                    id="skills"
                    value={profileData.skills.join(', ')}
                    onChange={(e) => handleSkillsChange(e.target.value)}
                    disabled={!isEditing}
                    placeholder="React, TypeScript, Node.js"
                    className="form-input"
                  />
                  {profileData.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {profileData.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="experience">Years of Experience</Label>
                  <Input
                    id="experience"
                    value={profileData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    disabled={!isEditing}
                    placeholder="e.g. 3 years"
                    className="form-input"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
