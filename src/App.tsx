
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import ProtectedRoute from "@/components/ui/ProtectedRoute";
import GeminiChat from "@/components/common/GeminiChat";

// Pages
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Profile from "./pages/Profile";
import JobSeekerDashboard from "./pages/JobSeeker/Dashboard";
import JobDetails from "./pages/JobSeeker/JobDetails";
import EmployerDashboard from "./pages/Employer/EmployerDashboard";
import PostJob from "./pages/Employer/PostJob";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Layout>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected Profile Route */}
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              
              {/* Job Seeker Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute requireRole="jobseeker">
                  <JobSeekerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/job/:id" element={
                <ProtectedRoute requireRole="jobseeker">
                  <JobDetails />
                </ProtectedRoute>
              } />
              <Route path="/jobs" element={<JobSeekerDashboard />} />
              
              {/* Employer Routes */}
              <Route path="/employer" element={
                <ProtectedRoute requireRole="employer">
                  <EmployerDashboard />
                </ProtectedRoute>
              } />
              <Route path="/employer/post-job" element={
                <ProtectedRoute requireRole="employer">
                  <PostJob />
                </ProtectedRoute>
              } />
              
              {/* Catch all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <GeminiChat />
          </Layout>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
