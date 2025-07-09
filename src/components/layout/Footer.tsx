
import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Briefcase className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">JobPortal</span>
            </div>
            <p className="text-gray-300 mb-4">
              Connect talented professionals with amazing opportunities. 
              Your dream job or perfect candidate is just a click away.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@jobportal.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Job Seekers</h3>
            <ul className="space-y-2">
              <li><Link to="/jobs" className="text-gray-300 hover:text-white transition-colors">Browse Jobs</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Create Account</Link></li>
              <li><Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">My Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">For Employers</h3>
            <ul className="space-y-2">
              <li><Link to="/employer/post-job" className="text-gray-300 hover:text-white transition-colors">Post a Job</Link></li>
              <li><Link to="/employer" className="text-gray-300 hover:text-white transition-colors">Employer Dashboard</Link></li>
              <li><Link to="/register" className="text-gray-300 hover:text-white transition-colors">Start Hiring</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400">&copy; 2024 JobPortal. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
