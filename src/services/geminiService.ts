
import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyDTdd1_VWqVGJC96jtbgjqIgENXsBEu7mM';

class GeminiService {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    this.genAI = new GoogleGenerativeAI(API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 1024,
      }
    });
  }

  async generateJobRecommendations(userProfile: string, skills: string[]): Promise<string> {
    try {
      const prompt = `As a professional career advisor, analyze this user profile and skills to provide specific, actionable job recommendations.

User Profile: "${userProfile}"
Skills: ${skills.join(', ')}

Please provide:
1. 3-5 specific job titles that match their skills
2. Brief explanation (2-3 sentences) for each recommendation
3. Practical next steps they can take

Format your response in a clear, professional manner with bullet points and actionable advice.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I apologize, but I am unable to provide job recommendations at the moment. Please try again later or check your internet connection.';
    }
  }

  async generateJobDescription(jobTitle: string, company: string): Promise<string> {
    try {
      const prompt = `Create a comprehensive, professional job description for the position: "${jobTitle}" at "${company}".

Please include:
1. Company overview (2-3 sentences)
2. Job summary (3-4 sentences)
3. Key responsibilities (5-7 bullet points)
4. Required qualifications (education, experience, skills)
5. Preferred qualifications
6. Benefits overview

Make it engaging, specific, and professional. Use industry-standard language and formatting.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I apologize, but I am unable to generate a job description at the moment. Please try writing one manually or try again later.';
    }
  }

  async getChatResponse(message: string, userRole: 'jobseeker' | 'employer'): Promise<string> {
    try {
      const roleContext = userRole === 'jobseeker' 
        ? `You are a professional career advisor helping a job seeker. Provide specific, actionable advice about job searching, career development, interview preparation, resume improvement, and professional growth. Be encouraging but realistic.`
        : `You are a recruitment and HR consultant helping an employer. Provide specific, actionable advice about hiring processes, job posting optimization, candidate evaluation, team building, and talent management. Be professional and strategic.`;
      
      const prompt = `${roleContext}

User Question: "${message}"

Please provide a helpful, specific, and actionable response. Include practical tips where appropriate. Keep your response conversational but professional, and aim for 2-4 paragraphs.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'I apologize, but I am unable to respond at the moment. Please check your internet connection and try again. If the problem persists, please try rephrasing your question.';
    }
  }

  async generateInterviewQuestions(jobTitle: string, experience: string): Promise<string> {
    try {
      const prompt = `Generate 8-10 relevant interview questions for a "${jobTitle}" position with ${experience} experience level.

Include:
1. 2-3 behavioral questions (STAR method)
2. 3-4 technical/role-specific questions
3. 2-3 situational questions
4. 1-2 questions about career goals

Format each question clearly and provide brief notes on what to look for in answers.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I cannot generate interview questions right now. Please try again later.';
    }
  }

  async optimizeResume(resumeContent: string, targetJob: string): Promise<string> {
    try {
      const prompt = `As a professional resume coach, analyze this resume content and provide specific optimization suggestions for a "${targetJob}" position:

Resume Content: "${resumeContent}"

Please provide:
1. 3-5 specific improvements for content
2. Keyword suggestions for the target role
3. Formatting and structure recommendations
4. Action items to strengthen the application

Focus on making the resume more competitive and ATS-friendly.`;
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      return 'Sorry, I cannot analyze your resume right now. Please try again later.';
    }
  }
}

export const geminiService = new GeminiService();
