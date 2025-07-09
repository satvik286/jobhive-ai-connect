
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, X, MapPin } from 'lucide-react';

interface JobSearchBarProps {
  onSearch: (skills: string[], location: string) => void;
  className?: string;
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({ onSearch, className = '' }) => {
  const [skillInput, setSkillInput] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);

  const addSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills([...skills, trimmedSkill]);
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    }
  };

  const handleSearch = () => {
    onSearch(skills, location);
  };

  return (
    <div className={`bg-white rounded-xl shadow-lg border-2 p-6 space-y-4 ${className}`}>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Skills (press Enter or comma to add)
          </label>
          <Input
            placeholder="e.g. React, Python, Marketing..."
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyPress={handleSkillKeyPress}
            onBlur={() => skillInput && addSkill(skillInput)}
            className="transition-all duration-200 focus:ring-2 focus:ring-primary/20"
          />
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer transition-colors"
                  onClick={() => removeSkill(skill)}
                >
                  {skill}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="e.g. San Francisco, Remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-center">
        <Button 
          onClick={handleSearch}
          className="px-8 py-2 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-600/90 transition-all duration-300 hover:scale-105"
        >
          <Search className="h-4 w-4 mr-2" />
          Search Jobs
        </Button>
      </div>
    </div>
  );
};

export default JobSearchBar;
