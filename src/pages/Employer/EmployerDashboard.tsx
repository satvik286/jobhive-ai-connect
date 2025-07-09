
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Job, JobApplication } from '@/types';
import { Plus, Eye, Edit, Trash2, Users, Briefcase, TrendingUp } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockJobs: Job[] = [
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
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [applications, setApplications] = useState<JobApplication[]>(mockApplications);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showApplications, setShowApplications] = useState(false);

  const handleDeleteJob = (jobId: string) => {
    setJobs(prev => prev.filter(job => job.id !== jobId));
    setApplications(prev => prev.filter(app => app.jobId !== jobId));
    toast({
      title: "Job Deleted",
      description: "The job posting has been removed",
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

  const getJobApplications = (jobId: string) => {
    return applications.filter(app => app.jobId === jobId);
  };

  const viewApplications = (job: Job) => {
    setSelectedJob(job);
    setShowApplications(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-green-100 text-green-800';
      case 'part-time': return 'bg-blue-100 text-blue-800';
      case 'contract': return 'bg-orange-100 text-orange-800';
      case 'freelance': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Employer Dashboard</h1>
          <p className="text-gray-600">Manage your job postings and applications</p>
        </div>
        <Link to="/employer/post-job">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Post New Job
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{jobs.length}</p>
                <p className="text-gray-600">Total Jobs</p>
              </div>
              <Briefcase className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{jobs.filter(j => j.isActive).length}</p>
                <p className="text-gray-600">Active Jobs</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{applications.length}</p>
                <p className="text-gray-600">Total Applications</p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{applications.filter(a => a.status === 'pending').length}</p>
                <p className="text-gray-600">Pending Reviews</p>
              </div>
              <Eye className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Your Job Postings</CardTitle>
              <CardDescription>Manage and track your job listings</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {jobs.length === 0 ? (
            <div className="text-center py-8">
              <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No job postings yet</h3>
              <p className="text-gray-600 mb-4">Start by creating your first job posting</p>
              <Link to="/employer/post-job">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Job
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-xl font-semibold">{job.title}</h3>
                        <Badge className={getJobTypeColor(job.jobType)}>
                          {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                        </Badge>
                        <Badge variant={job.isActive ? "default" : "secondary"}>
                          {job.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{job.location} • {job.salaryRange}</p>
                      <p className="text-gray-500 text-sm">
                        Posted {new Date(job.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">
                        {getJobApplications(job.id).length} applications
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => viewApplications(job)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Link to={`/employer/edit-job/${job.id}`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleJobStatus(job.id)}
                      >
                        {job.isActive ? "Deactivate" : "Activate"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteJob(job.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 line-clamp-2">{job.description}</p>
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
            <DialogTitle>Applications for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Review and manage applications for this position
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedJob && getJobApplications(selectedJob.id).length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-gray-600">Applications will appear here once candidates apply</p>
              </div>
            ) : (
              selectedJob && getJobApplications(selectedJob.id).map((application) => (
                <Card key={application.id}>
                  <CardContent className="pt-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-semibold">{application.applicantName}</h4>
                        <p className="text-gray-600">{application.applicantEmail}</p>
                        <p className="text-sm text-gray-500">
                          Applied on {new Date(application.appliedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className={getStatusColor(application.status)}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium mb-1">Cover Letter:</h5>
                        <p className="text-gray-600 text-sm">{application.coverLetter}</p>
                      </div>
                      
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline" asChild>
                          <a href={application.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View Resume
                          </a>
                        </Button>
                        <Button size="sm" variant="outline">
                          Contact Applicant
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApplications(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployerDashboard;
