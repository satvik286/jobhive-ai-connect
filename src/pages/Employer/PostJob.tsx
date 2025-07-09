
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Sparkles, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { geminiService } from '@/services/geminiService';

const PostJob: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [generatingDescription, setGeneratingDescription] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    description: '',
    requirements: '',
    salaryRange: '',
    jobType: 'full-time' as 'full-time' | 'part-time' | 'contract' | 'freelance',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.title.trim()) errors.title = 'Job title is required';
    if (!formData.company.trim()) errors.company = 'Company name is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.description.trim()) errors.description = 'Job description is required';
    if (!formData.requirements.trim()) errors.requirements = 'Requirements are required';
    if (!formData.salaryRange.trim()) errors.salaryRange = 'Salary range is required';
    if (!formData.jobType) errors.jobType = 'Job type is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
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
    
    if (!validateForm()) {
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
      
      // Simulate API delay with progress
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock successful response
      const newJob = {
        id: Date.now().toString(),
        ...formData,
        employerId: 'current-user-id',
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      console.log('Job posted successfully:', newJob);
      
      toast({
        title: "Job Posted Successfully!",
        description: "Your job posting is now live and visible to candidates",
        duration: 5000,
      });
      
      // Reset form
      setFormData({
        title: '',
        company: '',
        location: '',
        description: '',
        requirements: '',
        salaryRange: '',
        jobType: 'full-time',
      });
      
      // Navigate after short delay to show success message
      setTimeout(() => {
        navigate('/employer');
      }, 1500);
      
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Header */}
      <div className="mb-8">
        <Link to="/employer">
          <Button variant="ghost" className="mb-4 hover:bg-primary/10 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
          Post a New Job
        </h1>
        <p className="text-muted-foreground text-lg">Fill in the details to create your job posting</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="card-enhanced border-2">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-50">
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Job Information
                </CardTitle>
                <CardDescription>Basic details about the position</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g. Senior Frontend Developer"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className={`form-input transition-all ${formErrors.title ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.title && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.title}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="company">Company Name *</Label>
                    <Input
                      id="company"
                      placeholder="Your company name"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className={`form-input transition-all ${formErrors.company ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.company && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.company}
                      </p>
                    )}
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
                      className={`form-input transition-all ${formErrors.location ? 'border-red-500' : ''}`}
                      required
                    />
                    {formErrors.location && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.location}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="jobType">Job Type *</Label>
                    <Select value={formData.jobType} onValueChange={(value) => handleInputChange('jobType', value)}>
                      <SelectTrigger className={`transition-all ${formErrors.jobType ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full-time">Full Time</SelectItem>
                        <SelectItem value="part-time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                      </SelectContent>
                    </Select>
                    {formErrors.jobType && (
                      <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        {formErrors.jobType}
                      </p>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="salaryRange">Salary Range *</Label>
                  <Input
                    id="salaryRange"
                    placeholder="e.g. $80k - $120k or Competitive"
                    value={formData.salaryRange}
                    onChange={(e) => handleInputChange('salaryRange', e.target.value)}
                    className={`form-input transition-all ${formErrors.salaryRange ? 'border-red-500' : ''}`}
                    required
                  />
                  {formErrors.salaryRange && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      {formErrors.salaryRange}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced border-2">
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
                    className="ai-generate-btn transition-all duration-300"
                  >
                    <Sparkles className={`h-4 w-4 mr-2 ${generatingDescription ? 'animate-spin' : ''}`} />
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
                  className={`form-input resize-none transition-all ${formErrors.description ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.description && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.description}
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="card-enhanced border-2">
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
                  className={`form-input resize-none transition-all ${formErrors.requirements ? 'border-red-500' : ''}`}
                  required
                />
                {formErrors.requirements && (
                  <p className="text-sm text-red-600 mt-2 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {formErrors.requirements}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="card-enhanced border-2">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-emerald-100">
                <CardTitle className="text-emerald-800">Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="text-sm text-muted-foreground">
                  <p className="mb-2 font-medium">Your job will be:</p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Visible to all job seekers
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Searchable by keywords
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Active for 30 days
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-emerald-600" />
                      Available for applications immediately
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="card-enhanced border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-blue-100">
                <CardTitle className="text-blue-800">Need Help?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pt-6">
                <p className="text-sm text-muted-foreground">
                  Use our AI assistant to help write compelling job descriptions and requirements.
                </p>
                <div className="text-xs text-muted-foreground">
                  <p className="mb-2 font-medium">Tips for better job posts:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Be specific about requirements</li>
                    <li>Highlight company culture</li>
                    <li>Include salary information</li>
                    <li>Mention growth opportunities</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20">
              <CardContent className="pt-6">
                <Button 
                  type="submit" 
                  className="w-full btn-primary text-white font-medium py-3 text-lg" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Posting Job...
                    </>
                  ) : (
                    'Post Job'
                  )}
                </Button>
                <p className="text-xs text-muted-foreground mt-3 text-center">
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
