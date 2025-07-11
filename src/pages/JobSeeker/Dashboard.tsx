
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DatabaseJob } from '@/types/supabase';
import { Search, MapPin, DollarSign, Clock, Bookmark, Eye, Filter, Send, FileText } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { JobService } from '@/services/jobService';
import { useAuth } from '@/contexts/AuthContext';

const JobSeekerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<DatabaseJob[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<DatabaseJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<DatabaseJob | null>(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [applicationData, setApplicationData] = useState({
    coverLetter: '',
    resumeUrl: '',
  });
  const [applying, setApplying] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    loadJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      console.log('Loading active jobs...');
      const jobsData = await JobService.getActiveJobs();
      console.log('Loaded jobs:', jobsData);
      setJobs(jobsData);
    } catch (error) {
      console.error('Error loading jobs:', error);
      toast({
        title: "Error",
        description: "Failed to load job listings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    setIsSearching(true);
    
    setTimeout(() => {
      let filtered = jobs;

      if (searchTerm.trim()) {
        filtered = filtered.filter(
          job =>
            job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            job.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      if (locationFilter.trim()) {
        filtered = filtered.filter(job =>
          job.location.toLowerCase().includes(locationFilter.toLowerCase())
        );
      }

      if (jobTypeFilter && jobTypeFilter !== 'all') {
        filtered = filtered.filter(job => job.job_type === jobTypeFilter);
      }

      setFilteredJobs(filtered);
      setIsSearching(false);
    }, 300);
  };

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs(prev => {
      const newSavedJobs = prev.includes(jobId)
        ? prev.filter(id => id !== jobId)
        : [...prev, jobId];
      
      toast({
        title: prev.includes(jobId) ? "Job Removed" : "Job Saved",
        description: prev.includes(jobId) 
          ? "Job removed from your saved list" 
          : "Job saved to your list",
      });
      
      return newSavedJobs;
    });
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocationFilter('');
    setJobTypeFilter('all');
  };

  const handleApplyClick = (job: DatabaseJob) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to apply for jobs",
        variant: "destructive",
      });
      return;
    }
    setSelectedJob(job);
    setShowApplicationModal(true);
  };

  const handleSubmitApplication = async () => {
    if (!selectedJob || !user) return;

    if (!applicationData.coverLetter.trim()) {
      toast({
        title: "Cover Letter Required",
        description: "Please write a cover letter for your application",
        variant: "destructive",
      });
      return;
    }

    setApplying(true);
    
    try {
      console.log('Submitting application:', {
        jobId: selectedJob.id,
        applicantId: user.id,
        coverLetter: applicationData.coverLetter,
        resumeUrl: applicationData.resumeUrl || null,
      });

      await JobService.applyToJob({
        job_id: selectedJob.id,
        applicant_id: user.id,
        cover_letter: applicationData.coverLetter,
        resume_url: applicationData.resumeUrl || null,
        status: 'pending',
      });

      toast({
        title: "🎉 Application Submitted!",
        description: `Your application for ${selectedJob.title} has been sent to the employer`,
      });

      setShowApplicationModal(false);
      setApplicationData({ coverLetter: '', resumeUrl: '' });
      setSelectedJob(null);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast({
        title: "Application Failed",
        description: "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'part-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'freelance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
        <p className="text-muted-foreground mb-6">You need to be logged in to view job opportunities</p>
        <Link to="/login">
          <Button>Log In</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Job Dashboard
        </h1>
        <p className="text-muted-foreground text-lg">Discover opportunities that match your skills</p>
      </div>

      {/* Enhanced Filters */}
      <Card className="mb-8 border-2 shadow-lg hover:shadow-xl transition-all duration-300">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-primary" />
            Search & Filter Jobs
          </CardTitle>
          <CardDescription>Find your perfect job match</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className={`absolute left-3 top-3 h-4 w-4 transition-colors ${isSearching ? 'text-primary animate-pulse' : 'text-gray-400'}`} />
              <Input
                placeholder="Search jobs or companies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-2 focus:border-primary transition-colors"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10 border-2 focus:border-primary transition-colors"
              />
            </div>
            
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger className="border-2 focus:border-primary transition-colors">
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={clearFilters} variant="outline" className="border-2 hover:bg-primary hover:text-white transition-all">
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="transform hover:scale-105 transition-all duration-300 border-l-4 border-l-primary">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">{filteredJobs.length}</p>
                <p className="text-muted-foreground">Available Jobs</p>
              </div>
              <div className="bg-primary/10 p-3 rounded-full">
                <Search className="h-8 w-8 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-105 transition-all duration-300 border-l-4 border-l-emerald-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-emerald-600">{savedJobs.length}</p>
                <p className="text-muted-foreground">Saved Jobs</p>
              </div>
              <div className="bg-emerald-100 p-3 rounded-full">
                <Bookmark className="h-8 w-8 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="transform hover:scale-105 transition-all duration-300 border-l-4 border-l-amber-500">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-amber-600">0</p>
                <p className="text-muted-foreground">Applications</p>
              </div>
              <div className="bg-amber-100 p-3 rounded-full">
                <Clock className="h-8 w-8 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Available Jobs</h2>
          <Button onClick={loadJobs} variant="outline" className="hover:bg-primary hover:text-white transition-all">
            Refresh Jobs
          </Button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-600">No jobs found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria or check back later</p>
              <Button onClick={clearFilters} variant="outline">
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job, index) => (
              <Card 
                key={job.id} 
                className="job-card-hover border-2 hover:border-primary/20 hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2 text-gray-900 hover:text-primary transition-colors">
                        {job.title}
                      </h3>
                      <p className="text-lg text-gray-700 mb-2 font-medium">{job.company}</p>
                      <div className="flex items-center space-x-4 text-muted-foreground mb-3">
                        <div className="flex items-center hover:text-primary transition-colors">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        {job.salary_range && (
                          <div className="flex items-center hover:text-emerald-600 transition-colors">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary_range}
                          </div>
                        )}
                        <div className="flex items-center hover:text-blue-600 transition-colors">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(job.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={`${getJobTypeColor(job.job_type)} border mb-3`}>
                        {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace('-', ' ')}
                      </Badge>
                      
                      {job.required_skills && job.required_skills.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {job.required_skills.slice(0, 4).map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                          {job.required_skills.length > 4 && (
                            <Badge variant="outline" className="text-xs bg-gray-100">
                              +{job.required_skills.length - 4} more
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className={`transition-all duration-200 ${
                          savedJobs.includes(job.id) 
                            ? 'text-red-600 border-red-300 bg-red-50 hover:bg-red-100' 
                            : 'hover:text-primary hover:border-primary'
                        }`}
                      >
                        <Bookmark className={`h-4 w-4 ${savedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                      </Button>
                      <Button 
                        size="sm" 
                        className="bg-primary hover:bg-primary/90 transition-all duration-200"
                        onClick={() => handleApplyClick(job)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3 line-clamp-2">{job.description}</p>
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-gray-900">Requirements:</strong> {job.requirements}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Job Application Modal */}
      <Dialog open={showApplicationModal} onOpenChange={setShowApplicationModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Apply for {selectedJob?.title}</DialogTitle>
            <DialogDescription>
              Complete your application for this position at {selectedJob?.company}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Cover Letter *</label>
              <Textarea
                placeholder="Write a compelling cover letter explaining why you're the perfect fit for this role..."
                rows={8}
                value={applicationData.coverLetter}
                onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                className="resize-none"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Resume URL (optional)</label>
              <Input
                placeholder="https://your-resume-link.com or leave empty"
                value={applicationData.resumeUrl}
                onChange={(e) => setApplicationData(prev => ({ ...prev, resumeUrl: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground mt-1">
                Provide a link to your online resume or portfolio
              </p>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowApplicationModal(false)}
              disabled={applying}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitApplication}
              disabled={applying || !applicationData.coverLetter.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {applying ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Submitting...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Submit Application
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default JobSeekerDashboard;
