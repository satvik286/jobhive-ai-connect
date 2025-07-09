
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Job } from '@/types';
import { Search, MapPin, DollarSign, Clock, Bookmark, Eye, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - replace with API calls
const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Frontend Developer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    description: 'We are looking for a skilled Frontend Developer to join our team and build amazing user experiences...',
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
    description: 'Join our dynamic team as a Product Manager and drive product strategy and execution...',
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
    description: 'Create amazing user experiences for our products and collaborate with cross-functional teams...',
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
  const [jobTypeFilter, setJobTypeFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, locationFilter, jobTypeFilter, jobs]);

  const filterJobs = () => {
    setIsSearching(true);
    
    // Simulate search delay for animation
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
        filtered = filtered.filter(job => job.jobType === jobTypeFilter);
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

  const getJobTypeColor = (type: string) => {
    switch (type) {
      case 'full-time': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'part-time': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'contract': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'freelance': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

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

      {/* Enhanced Quick Stats */}
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
          <Link to="/saved-jobs">
            <Button variant="outline" className="hover:bg-primary hover:text-white transition-all">
              View Saved Jobs
            </Button>
          </Link>
        </div>
        
        {isSearching ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredJobs.length === 0 ? (
          <Card className="border-dashed border-2">
            <CardContent className="pt-12 pb-12 text-center">
              <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-gray-600">No jobs found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
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
                        <div className="flex items-center hover:text-emerald-600 transition-colors">
                          <DollarSign className="h-4 w-4 mr-1" />
                          {job.salaryRange}
                        </div>
                        <div className="flex items-center hover:text-blue-600 transition-colors">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <Badge className={`${getJobTypeColor(job.jobType)} border`}>
                        {job.jobType.charAt(0).toUpperCase() + job.jobType.slice(1)}
                      </Badge>
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
                      <Link to={`/job/${job.id}`}>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 transition-all duration-200">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </Link>
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
    </div>
  );
};

export default JobSeekerDashboard;
