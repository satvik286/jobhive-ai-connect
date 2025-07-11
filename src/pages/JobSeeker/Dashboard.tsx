
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, Briefcase, Plus, Building } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { JobService } from '@/services/jobService';
import { DatabaseJob, DatabaseJobApplication } from '@/types/supabase';
import { useAuth } from '@/contexts/AuthContext';
import JobCard from '@/components/job/JobCard';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<DatabaseJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [applications, setApplications] = useState<DatabaseJobApplication[]>([]);

  // Redirect employers to their dashboard
  useEffect(() => {
    if (user?.role === 'employer') {
      navigate('/employer/dashboard');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user?.role === 'jobseeker') {
      loadJobs();
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const jobsData = await JobService.getActiveJobs();
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load jobs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (jobId: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return;
    }

    try {
      await JobService.applyToJob({
        job_id: jobId,
        applicant_id: user.id,
        status: 'pending',
        resume_url: null,
        cover_letter: null,
      });

      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully!",
      });
    } catch (error) {
      console.error('Error applying to job:', error);
      toast({
        title: "Error",
        description: "Failed to submit application",
        variant: "destructive",
      });
    }
  };

  const handleViewJob = (jobId: string) => {
    navigate(`/jobs/${jobId}`);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Don't render anything for employers - they will be redirected
  if (user?.role === 'employer') {
    return null;
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to access the dashboard</p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Job Seeker Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Find your next opportunity</p>
      </div>

      {/* Search Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search Jobs
          </CardTitle>
          <CardDescription>
            Find jobs that match your skills and interests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by job title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Button onClick={loadJobs} disabled={loading}>
              {loading ? "Searching..." : "Refresh Jobs"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available Jobs */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Available Jobs</CardTitle>
              <CardDescription className="text-base">
                {filteredJobs.length} job{filteredJobs.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold mb-3 text-muted-foreground">
                {searchTerm ? 'No jobs found' : 'No jobs available'}
              </h3>
              <p className="text-muted-foreground mb-6 text-lg">
                {searchTerm
                  ? 'Try adjusting your search criteria'
                  : 'Check back later for new opportunities'
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Clear Search
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onApply={handleApply}
                  onView={handleViewJob}
                  showApplyButton={true}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
