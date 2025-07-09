
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DatabaseJob, DatabaseJobApplication } from '@/types/supabase';
import { Plus, Eye, Edit, Trash2, Users, Briefcase, TrendingUp, RefreshCw, MessageCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { JobService } from '@/services/jobService';
import { ProfileService } from '@/services/profileService';
import { supabase } from '@/integrations/supabase/client';

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<DatabaseJob[]>([]);
  const [applications, setApplications] = useState<DatabaseJobApplication[]>([]);
  const [selectedJob, setSelectedJob] = useState<DatabaseJob | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initializeData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadEmployerJobs(user.id);
      }
    };

    initializeData();
  }, []);

  const loadEmployerJobs = async (employerId: string) => {
    try {
      const jobsData = await JobService.getEmployerJobs(employerId);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load your job postings",
        variant: "destructive",
      });
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    try {
      await JobService.deleteJob(jobId);
      setJobs(prev => prev.filter(job => job.id !== jobId));
      toast({
        title: "Job Deleted",
        description: "The job posting has been removed successfully.",
      });
    } catch (error) {
      console.error('Error deleting job:', error);
      toast({
        title: "Error",
        description: "Failed to delete job posting",
        variant: "destructive",
      });
    }
  };

  const toggleJobStatus = async (jobId: string, currentStatus: boolean) => {
    try {
      await JobService.toggleJobStatus(jobId, !currentStatus);
      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, is_active: !currentStatus } : job
      ));
      
      toast({
        title: currentStatus ? "Job Deactivated" : "Job Activated",
        description: currentStatus ? "Job is now hidden from applicants" : "Job is now visible to applicants",
      });
    } catch (error) {
      console.error('Error toggling job status:', error);
      toast({
        title: "Error",
        description: "Failed to update job status",
        variant: "destructive",
      });
    }
  };

  const refreshDashboard = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      await loadEmployerJobs(user.id);
      toast({
        title: "Dashboard Refreshed",
        description: "Latest data has been loaded.",
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to refresh dashboard",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const viewApplications = async (job: DatabaseJob) => {
    try {
      const applicationsData = await JobService.getJobApplications(job.id);
      setApplications(applicationsData);
      setSelectedJob(job);
      setShowApplications(true);
    } catch (error) {
      console.error('Error loading applications:', error);
      toast({
        title: "Error",
        description: "Failed to load job applications",
        variant: "destructive",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted': return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800 border-green-200';
      case 'part-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'freelance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const totalApplications = jobs.reduce((sum, job) => {
    // This would need to be calculated from actual application data
    return sum;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
            Employer Dashboard
          </h1>
          <p className="text-muted-foreground text-lg">Manage your job postings and applications</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={refreshDashboard}
            disabled={loading}
            className="hover:bg-primary/10 transition-colors"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Link to="/employer/post-job">
            <Button className="btn-primary transition-all hover:scale-105">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="card-enhanced border-2 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">{jobs.length}</p>
                <p className="text-muted-foreground font-medium">Total Jobs</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <Briefcase className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced border-2 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600">{jobs.filter(j => j.is_active).length}</p>
                <p className="text-muted-foreground font-medium">Active Jobs</p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <TrendingUp className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced border-2 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-orange-600">{totalApplications}</p>
                <p className="text-muted-foreground font-medium">Total Applications</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="card-enhanced border-2 hover:shadow-lg transition-all duration-300">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-purple-600">0</p>
                <p className="text-muted-foreground font-medium">Pending Reviews</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Eye className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <Card className="card-enhanced border-2">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Your Job Postings</CardTitle>
              <CardDescription className="text-base">Manage and track your job listings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
              <h3 className="text-2xl font-semibold mb-3 text-muted-foreground">No job postings yet</h3>
              <p className="text-muted-foreground mb-6 text-lg">Start by creating your first job posting to attract top talent</p>
              <Link to="/employer/post-job">
                <Button size="lg" className="btn-primary px-8 py-3">
                  <Plus className="h-5 w-5 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div key={job.id} className="job-card-hover border-2 rounded-xl p-6 bg-gradient-to-r from-white to-gray-50 transition-all duration-300">
                  <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-2xl font-bold text-gray-900 truncate">{job.title}</h3>
                        <Badge className={`${getJobTypeColor(job.job_type)} px-3 py-1 font-medium`}>
                          {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace('-', ' ')}
                        </Badge>
                        <Badge variant={job.is_active ? "default" : "secondary"} className="px-3 py-1">
                          {job.is_active ? "🟢 Active" : "⚪ Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-lg text-muted-foreground font-medium">📍 {job.location} • 💰 {job.salary_range || 'Competitive'}</p>
                        <p className="text-sm text-muted-foreground">
                          📅 Posted {new Date(job.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">{job.description}</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 ml-auto">
                      <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                        👥 0 applications
                      </span>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewApplications(job)}
                          className="hover:bg-primary/10 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJobStatus(job.id, job.is_active)}
                          className="hover:bg-orange/10 transition-colors"
                        >
                          {job.is_active ? "Pause" : "Activate"}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red/10 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Applications Modal */}
      <Dialog open={showApplications} onOpenChange={setShowApplications}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">Applications for {selectedJob?.title}</DialogTitle>
            <DialogDescription className="text-base">
              Review and manage applications for this position
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {applications.length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold mb-3">No applications yet</h3>
                <p className="text-muted-foreground">Applications will appear here once candidates apply to this position</p>
              </div>
            ) : (
              applications.map((application) => (
                <Card key={application.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold">Applicant {application.applicant_id.slice(0, 8)}</h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          📅 Applied on {new Date(application.applied_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long', 
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <Badge className={`${getStatusColor(application.status)} px-3 py-1 font-medium`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {application.cover_letter && (
                        <div>
                          <h5 className="font-semibold mb-2 text-base">Cover Letter:</h5>
                          <p className="text-muted-foreground text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                            {application.cover_letter}
                          </p>
                        </div>
                      )}
                      
                      <div className="flex flex-wrap gap-3">
                        {application.resume_url && (
                          <Button size="sm" variant="outline" asChild className="hover:bg-primary/10">
                            <a href={application.resume_url} target="_blank" rel="noopener noreferrer">
                              📄 View Resume
                            </a>
                          </Button>
                        )}
                        <Button size="sm" variant="outline" className="hover:bg-blue/10">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Contact Applicant
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-green/10">
                          ✅ Accept Application
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-red/10">
                          ❌ Reject Application
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplications(false)} size="lg">
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerDashboard;
