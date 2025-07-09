
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Job, JobApplication } from '@/types';
import { Plus, Eye, Edit, Trash2, Users, Briefcase, TrendingUp, RefreshCw } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - this should be replaced with real data from your backend
const initialMockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Your Company',
    location: 'San Francisco, CA',
    description: 'Looking for an experienced frontend developer...',
    requirements: 'React, TypeScript, 3+ years experience',
    salaryRange: '$80k - $120k',
    jobType: 'full-time',
    employerId: 'emp1',
    createdAt: '2024-01-15',
    isActive: true,
  },
  {
    id: '2',
    title: 'Product Manager',
    company: 'Your Company',
    location: 'New York, NY',
    description: 'Join our product team...',
    requirements: 'MBA preferred, 5+ years PM experience',
    salaryRange: '$100k - $140k',
    jobType: 'full-time',
    employerId: 'emp1',
    createdAt: '2024-01-14',
    isActive: true,
  },
];

const mockApplications: JobApplication[] = [
  {
    id: '1',
    jobId: '1',
    applicantId: 'user1',
    applicantName: 'John Doe',
    applicantEmail: 'john@example.com',
    resumeUrl: 'https://example.com/resume.pdf',
    coverLetter: 'I am very interested in this position...',
    appliedAt: '2024-01-16',
    status: 'pending',
  },
  {
    id: '2',
    jobId: '1',
    applicantId: 'user2',
    applicantName: 'Jane Smith',
    applicantEmail: 'jane@example.com',
    resumeUrl: 'https://example.com/resume2.pdf',
    coverLetter: 'I believe I would be a great fit...',
    appliedAt: '2024-01-17',
    status: 'reviewed',
  },
];

const EmployerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(initialMockJobs);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplications, setShowApplications] = useState(false);
  const [loading, setLoading] = useState(false);

  // Check for newly posted jobs in localStorage and add them to the list
  useEffect(() => {
    const checkForNewJobs = () => {
      const newJobsData = localStorage.getItem('newlyPostedJobs');
      if (newJobsData) {
        try {
          const newJobs = JSON.parse(newJobsData);
          if (Array.isArray(newJobs) && newJobs.length > 0) {
            setJobs(prevJobs => {
              const existingIds = prevJobs.map(job => job.id);
              const uniqueNewJobs = newJobs.filter(job => !existingIds.includes(job.id));
              if (uniqueNewJobs.length > 0) {
                toast({
                  title: "Jobs Updated",
                  description: `${uniqueNewJobs.length} new job(s) have been added to your dashboard.`,
                });
                return [...prevJobs, ...uniqueNewJobs];
              }
              return prevJobs;
            });
            // Clear the temporary storage
            localStorage.removeItem('newlyPostedJobs');
          }
        } catch (error) {
          console.error('Error parsing newly posted jobs:', error);
        }
      }
    };

    // Check immediately
    checkForNewJobs();

    // Set up periodic checking
    const interval = setInterval(checkForNewJobs, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
    toast({
      title: "Job Deleted",
      description: "The job posting has been removed successfully.",
    });
  };

  const toggleJobStatus = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, isActive: !job.isActive } : job
    ));
    
    const job = jobs.find(j => j.id === jobId);
    toast({
      title: job?.isActive ? "Job Deactivated" : "Job Activated",
      description: job?.isActive ? "Job is now hidden from applicants" : "Job is now visible to applicants",
    });
  };

  const refreshDashboard = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Dashboard Refreshed",
      description: "Latest data has been loaded.",
    });
    setLoading(false);
  };

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const viewApplications = (job: Job) => {
    setSelectedJob(job);
    setShowApplications(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'reviewed': return 'bg-blue-100 text-blue-800 border-blue-200';
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
                <p className="text-3xl font-bold text-emerald-600">{jobs.filter(j => j.isActive).length}</p>
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
                <p className="text-3xl font-bold text-orange-600">{applications.length}</p>
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
                <p className="text-3xl font-bold text-purple-600">{applications.filter(a => a.status === 'pending').length}</p>
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
                        <Badge className={`${getJobTypeColor(job.jobType)} px-3 py-1 font-medium`}>
                          {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1).replace('-', ' ')}
                        </Badge>
                        <Badge variant={job.isActive ? "default" : "secondary"} className="px-3 py-1">
                          {job.isActive ? "🟢 Active" : "⚪ Inactive"}
                        </Badge>
                      </div>
                      <div className="space-y-2 mb-4">
                        <p className="text-lg text-muted-foreground font-medium">📍 {job.location} • 💰 {job.salaryRange}</p>
                        <p className="text-sm text-muted-foreground">
                          📅 Posted {new Date(job.createdAt).toLocaleDateString('en-US', { 
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
                        👥 {getJobApplications(job.id).length} applications
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
                        <Link to={`/employer/edit-job/${job.id}`}>
                          <Button variant="outline" size="sm" className="hover:bg-blue/10 transition-colors">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleJobStatus(job.id)}
                          className="hover:bg-orange/10 transition-colors"
                        >
                          {job.isActive ? "Pause" : "Activate"}
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
            {selectedJob && getJobApplications(selectedJob.id).length === 0 ? (
              <div className="text-center py-12">
                <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-50" />
                <h3 className="text-xl font-semibold mb-3">No applications yet</h3>
                <p className="text-muted-foreground">Applications will appear here once candidates apply to this position</p>
              </div>
            ) : (
              selectedJob && getJobApplications(selectedJob.id).map((application) => (
                <Card key={application.id} className="border-2 hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-xl font-bold">{application.applicantName}</h4>
                        <p className="text-muted-foreground text-base">{application.applicantEmail}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          📅 Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
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
                      <div>
                        <h5 className="font-semibold mb-2 text-base">Cover Letter:</h5>
                        <p className="text-muted-foreground text-sm leading-relaxed bg-gray-50 p-4 rounded-lg">
                          {application.coverLetter}
                        </p>
                      </div>
                      
                      <div className="flex flex-wrap gap-3">
                        <Button size="sm" variant="outline" asChild className="hover:bg-primary/10">
                          <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                            📄 View Resume
                          </a>
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-blue/10">
                          📧 Contact Applicant
                        </Button>
                        <Button size="sm" variant="outline" className="hover:bg-green/10">
                          ✅ Schedule Interview
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
