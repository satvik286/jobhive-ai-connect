
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ArrowLeft, MapPin, DollarSign, Clock, Building, Bookmark, Send } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock job data - replace with API call
const mockJob = {
  id: '1',
  title: 'Senior Frontend Developer',
  company: 'Tech Corp',
  location: 'San Francisco, CA',
  description: `We are looking for a skilled Senior Frontend Developer to join our dynamic team. You will be responsible for developing user-facing web applications using modern JavaScript frameworks and ensuring excellent user experience.

Key Responsibilities:
• Develop responsive web applications using React and TypeScript
• Collaborate with designers to implement pixel-perfect UI/UX designs
• Work closely with backend developers to integrate APIs
• Optimize applications for maximum speed and scalability
• Participate in code reviews and maintain high code quality standards
• Stay up-to-date with the latest frontend technologies and best practices

What We Offer:
• Competitive salary and equity package
• Comprehensive health, dental, and vision insurance
• Flexible working hours and remote work options
• Professional development opportunities
• Modern office in downtown San Francisco
• Catered meals and snacks`,
  requirements: `Required Qualifications:
• Bachelor's degree in Computer Science or related field
• 3+ years of experience in frontend development
• Strong proficiency in React, TypeScript, and modern JavaScript
• Experience with CSS preprocessors (Sass, Less) and CSS-in-JS libraries
• Familiarity with state management libraries (Redux, Zustand)
• Knowledge of build tools (Webpack, Vite) and version control (Git)

Preferred Qualifications:
• Experience with Next.js or other React frameworks
• Knowledge of testing frameworks (Jest, React Testing Library)
• Understanding of accessibility standards (WCAG)
• Experience with design systems and component libraries
• Previous experience in a startup environment`,
  salaryRange: '$80k - $120k',
  jobType: 'full-time',
  employerId: 'emp1',
  createdAt: '2024-01-15',
  isActive: true,
};

const JobDetails: React.FC = () => {
  const { id } = useParams();
  const [isApplicationOpen, setIsApplicationOpen] = useState(false);
  const [applicationData, setApplicationData] = useState({
    resumeUrl: '',
    coverLetter: '',
  });

  const handleApply = () => {
    if (!applicationData.resumeUrl || !applicationData.coverLetter) {
      toast({
        title: "Application Incomplete",
        description: "Please provide both resume URL and cover letter",
        variant: "destructive",
      });
      return;
    }

    // Mock application submission
    toast({
      title: "Application Submitted",
      description: "Your application has been sent to the employer",
    });
    
    setIsApplicationOpen(false);
    setApplicationData({ resumeUrl: '', coverLetter: '' });
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <div className="mb-6">
        <Link to="/dashboard">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      {/* Job Header */}
      <Card className="mb-8">
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-3">{mockJob.title}</h1>
              <div className="flex items-center space-x-4 text-gray-600 mb-4">
                <div className="flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  <span className="text-lg">{mockJob.company}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{mockJob.location}</span>
                </div>
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" />
                  <span>{mockJob.salaryRange}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  <span>Posted {new Date(mockJob.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Badge className={getJobTypeColor(mockJob.jobType)}>
                {mockJob.jobType.charAt(0).toUpperCase() + mockJob.jobType.slice(1)}
              </Badge>
            </div>
            
            <div className="flex space-x-3">
              <Button variant="outline">
                <Bookmark className="h-4 w-4 mr-2" />
                Save Job
              </Button>
              
              <Dialog open={isApplicationOpen} onOpenChange={setIsApplicationOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Send className="h-4 w-4 mr-2" />
                    Apply Now
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Apply for {mockJob.title}</DialogTitle>
                    <DialogDescription>
                      Complete your application for this position
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="resume">Resume URL</Label>
                      <Input
                        id="resume"
                        placeholder="https://your-resume-link.com"
                        value={applicationData.resumeUrl}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, resumeUrl: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="cover-letter">Cover Letter</Label>
                      <Textarea
                        id="cover-letter"
                        placeholder="Write a brief cover letter explaining why you're interested in this position..."
                        rows={4}
                        value={applicationData.coverLetter}
                        onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsApplicationOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleApply}>
                      Submit Application
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Job Description</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {mockJob.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Requirements</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                {mockJob.requirements.split('\n').map((requirement, index) => (
                  <p key={index} className="mb-4 whitespace-pre-line">
                    {requirement}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Company Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Company Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tech Corp</h4>
                  <p className="text-gray-600 text-sm">
                    A leading technology company focused on building innovative solutions
                    for the modern world.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Company Size</h4>
                  <p className="text-gray-600 text-sm">500-1000 employees</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Industry</h4>
                  <p className="text-gray-600 text-sm">Technology, Software Development</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Founded</h4>
                  <p className="text-gray-600 text-sm">2015</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" onClick={() => setIsApplicationOpen(true)}>
                <Send className="h-4 w-4 mr-2" />
                Apply Now
              </Button>
              <Button variant="outline" className="w-full">
                <Bookmark className="h-4 w-4 mr-2" />
                Save for Later
              </Button>
              <Button variant="outline" className="w-full">
                Share Job
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
