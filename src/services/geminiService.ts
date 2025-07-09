
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDTdd1_VWqVGJC96jtbgjqIgENXsBEu7mM';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async generateJobRecommendations(userProfile: string, skills: string[]): Promise<string> {
    try {
      const prompt = `Based on this user profile: "${userProfile}" and skills: ${skills.join(', ')}, 
      recommend 3-5 relevant job titles and briefly explain why they would be a good fit. 
      Keep the response concise and professional.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I am unable to provide recommendations at the moment. Please try again later.';
    }
  }

  async generateJobDescription(jobTitle: string, company: string): Promise<string> {
    try {
      const prompt = `Generate a professional job description for the position: "${jobTitle}" at "${company}". 
      Include responsibilities, requirements, and qualifications. Keep it concise but comprehensive.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I am unable to generate job descriptions at the moment. Please try again later.';
    }
  }

  async getChatResponse(message: string, userRole: 'jobseeker' | 'employer'): Promise<string> {
    try {
      const roleContext = userRole === 'jobseeker' 
        ? "You are helping a job seeker find employment opportunities and career advice."
        : "You are helping an employer with hiring, job posting, and recruitment strategies.";
      
      const prompt = `${roleContext} User message: "${message}". Provide helpful, professional advice.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I am unable to respond at the moment. Please try again later.';
    }
  }
}

export const geminiService = new GeminiService();
