
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { geminiService } from '@/services/geminiService';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salaryRange: '',
    jobType: '' as 'full-time' | 'part-time' | 'contract' | 'freelance' | '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateJobDescription = async () => {
    if (!formData.title || !formData.company) {
      toast({
        title: "Missing Information",
        description: "Please enter job title and company name first",
        variant: "destructive",
      });
      return;
    }

    setGeneratingDescription(true);
    
    try {
      const description = await geminiService.generateJobDescription(formData.title, formData.company);
      setFormData(prev => ({ ...prev, description }));
      toast({
        title: "Description Generated",
        description: "AI has generated a job description for you",
      });
    } catch (error) {
      console.error('Error generating description:', error);
      toast({
        title: "Generation Failed",
        description: "Could not generate job description. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGeneratingDescription(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title || !formData.company || !formData.location || 
        !formData.description || !formData.requirements || !formData.salaryRange || !formData.jobType) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Mock API call - replace with real API
      console.log('Posting job:', formData);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Job Posted Successfully",
        description: "Your job posting is now live and visible to candidates",
      });
      
      navigate('/employer');
    } catch (error) {
      console.error('Error posting job:', error);
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link to="/employer">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-600">Fill in the details to create your job posting</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>Basic details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g. San Francisco, CA or Remote"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="salaryRange">Salary Range *</Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g. $80k - $120k or Competitive"
                    value={formData.salaryRange}
                    onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Job Description</CardTitle>
                    <CardDescription>Detailed description of the role and responsibilities</CardDescription>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generateJobDescription}
                    disabled={generatingDescription || !formData.title || !formData.company}
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    {generatingDescription ? 'Generating...' : 'AI Generate'}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Describe the role, responsibilities, and what makes this opportunity unique..."
                  rows={8}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
                <CardDescription>Skills, experience, and qualifications needed</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="List the required skills, experience level, education, and any other qualifications..."
                  rows={6}
                  value={formData.requirements}
                  onChange={(e) => handleInputChange('requirements', e.target.value)}
                  required
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Your job will be:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Visible to all job seekers</li>
                    <li>Searchable by keywords</li>
                    <li>Active for 30 days</li>
                    <li>Available for applications immediately</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">
                  Use our AI assistant to help write compelling job descriptions and requirements.
                </p>
                <div className="text-xs text-gray-500">
                  <p className="mb-2">Tips for better job posts:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Be specific about requirements</li>
                    <li>Highlight company culture</li>
                    <li>Include salary information</li>
                    <li>Mention growth opportunities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Posting Job...' : 'Post Job'}
                </Button>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  By posting, you agree to our terms of service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PostJob;
