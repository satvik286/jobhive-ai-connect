
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Clock, Building, DollarSign } from 'lucide-react';
import { DatabaseJob } from '@/types/supabase';

interface JobCardProps {
  job: DatabaseJob;
  onApply?: (jobId: string) => void;
  onView?: (jobId: string) => void;
  showApplyButton?: boolean;
}

const JobCard: React.FC<JobCardProps> = ({ job, onApply, onView, showApplyButton = true }) => {
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
    <Card className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl font-bold text-gray-900 mb-1">{job.title}</CardTitle>
            <div className="flex items-center text-gray-600 mb-2">
              <Building className="h-4 w-4 mr-1" />
              <span className="font-medium">{job.company}</span>
            </div>
          </div>
          <Badge className={`${getJobTypeColor(job.job_type)} px-3 py-1 font-medium`}>
            {job.job_type.charAt(0).toUpperCase() + job.job_type.slice(1).replace('-', ' ')}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center text-muted-foreground">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{job.location}</span>
        </div>
        
        {job.salary_range && (
          <div className="flex items-center text-muted-foreground">
            <DollarSign className="h-4 w-4 mr-2" />
            <span>{job.salary_range}</span>
          </div>
        )}
        
        <p className="text-gray-600 line-clamp-3 leading-relaxed">{job.description}</p>
        
        {job.required_skills && job.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-2">
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
        
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>Posted {new Date(job.created_at).toLocaleDateString()}</span>
          </div>
          
          <div className="flex gap-2">
            {onView && (
              <Button variant="outline" size="sm" onClick={() => onView(job.id)}>
                View Details
              </Button>
            )}
            {showApplyButton && onApply && (
              <Button size="sm" onClick={() => onApply(job.id)} className="bg-primary hover:bg-primary/90">
                Apply Now
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
