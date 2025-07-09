
import React from 'react';
import { Sparkles, Brain } from 'lucide-react';

interface AILoadingIndicatorProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const AILoadingIndicator: React.FC<AILoadingIndicatorProps> = ({ 
  message = "AI is thinking...", 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/5 to-blue-50 rounded-lg border border-primary/20">
      <div className="relative">
        <Brain className={`${sizeClasses[size]} text-primary animate-pulse`} />
        <Sparkles className="h-3 w-3 text-blue-500 absolute -top-1 -right-1 animate-bounce" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-primary">{message}</p>
        <div className="flex gap-1 mt-1">
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default AILoadingIndicator;
