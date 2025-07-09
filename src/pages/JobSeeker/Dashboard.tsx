
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job } from '@/types';
import { Search, MapPin, DollarSign, Clock, Bookmark, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - replace with API calls
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'We are looking for a skilled Frontend Developer to join our team...',
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
    company: 'StartupXYZ',
    location: 'New York, NY',
    description: 'Join our dynamic team as a Product Manager...',
    requirements: 'MBA preferred, 5+ years PM experience',
    salaryRange: '$100k - $140k',
    jobType: 'full-time',
    employerId: 'emp2',
    createdAt: '2024-01-14',
    isActive: true,
  },
  {
    id: '3',
    title: 'UX Designer',
    company: 'Design Studio',
    location: 'Remote',
    description: 'Create amazing user experiences for our products...',
    requirements: 'Figma, Adobe Creative Suite, Portfolio required',
    salaryRange: '$70k - $90k',
    jobType: 'contract',
    employerId: 'emp3',
    createdAt: '2024-01-13',
    isActive: true,
  },
];

const JobSeekerDashboard: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>(mockJobs);
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    if (jobTypeFilter) {
      filtered = filtered.filter(job => job.jobType === jobTypeFilter);
    }

    setFilteredJobs(filtered);
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
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Dashboard</h1>
        <p className="text-gray-600">Discover opportunities that match your skills</p>
      </div>

      {/* Filters */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Search & Filter Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search jobs or companies"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Location"
                value={locationFilter}
                onChange={(e) => setLocationFilter(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Job Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="full-time">Full Time</SelectItem>
                <SelectItem value="part-time">Part Time</SelectItem>
                <SelectItem value="contract">Contract</SelectItem>
                <SelectItem value="freelance">Freelance</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={() => {
              setSearchTerm('');
              setLocationFilter('');
              setJobTypeFilter('');
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{filteredJobs.length}</p>
                <p className="text-gray-600">Available Jobs</p>
              </div>
              <Search className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">{savedJobs.length}</p>
                <p className="text-gray-600">Saved Jobs</p>
              </div>
              <Bookmark className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">0</p>
                <p className="text-gray-600">Applications</p>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Available Jobs</h2>
          <Link to="/saved-jobs">
            <Button variant="outline">View Saved Jobs</Button>
          </Link>
        </div>
        
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search criteria</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="job-card-hover">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
                      <p className="text-lg text-gray-700 mb-2">{job.company}</p>
                      <div className="flex items-center space-x-4 text-gray-600 mb-3">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salaryRange}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={getJobTypeColor(job.jobType)}>
                        {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleSaveJob(job.id)}
                        className={savedJobs.includes(job.id) ? 'text-red-600' : ''}
                      >
                        <Bookmark className="h-4 w-4" />
                      </Button>
                      <Link to={`/job/${job.id}`}>
                        <Button size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                  <p className="text-sm text-gray-500">
                    <strong>Requirements:</strong> {job.requirements}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobSeekerDashboard;
