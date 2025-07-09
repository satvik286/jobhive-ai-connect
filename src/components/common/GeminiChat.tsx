
import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import { geminiService } from '@/services/geminiService';
import { useAuth } from '@/contexts/AuthContext';
import AILoadingIndicator from './AILoadingIndicator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

const GeminiChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hi! I\'m your AI career assistant. I can help you with job searching, resume tips, interview preparation, and career advice. What would you like to know?',
      isUser: false,
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await geminiService.getChatResponse(inputMessage, user?.role || 'jobseeker');
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error while processing your request. Please check your internet connection and try again. If the problem persists, please rephrase your question.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickPrompts = [
    "Help me improve my resume",
    "Interview tips for tech jobs",
    "How to negotiate salary?",
    "Best job search strategies"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInputMessage(prompt);
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full h-16 w-16 shadow-2xl btn-primary animate-pulse-glow hover:scale-110 transition-all duration-300"
          size="lg"
        >
          {isOpen ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}
        </Button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 animate-slide-in-right">
          <Card className="shadow-2xl border-2 border-primary/20 bg-white/95 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-primary/10 to-blue-50">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/20 rounded-full">
                  <Bot className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg">AI Career Assistant</CardTitle>
                  <p className="text-xs text-muted-foreground">
                    {user?.role === 'employer' ? 'Hiring & Recruitment Help' : 'Job Search & Career Advice'}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="hover:bg-primary/10"
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              {/* Messages */}
              <div className="h-80 overflow-y-auto space-y-3 pr-2">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  >
                    <div className={`flex items-start gap-2 max-w-[85%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      <div className={`p-1.5 rounded-full ${message.isUser ? 'bg-primary/20' : 'bg-gray-200'}`}>
                        {message.isUser ? <User className="h-3 w-3 text-primary" /> : <Bot className="h-3 w-3 text-gray-600" />}
                      </div>
                      <div
                        className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                          message.isUser
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                        }`}
                      >
                        <div className="whitespace-pre-wrap">{message.text}</div>
                        <div className={`text-xs mt-2 ${message.isUser ? 'text-primary-foreground/70' : 'text-gray-500'}`}>
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex justify-start animate-fade-in">
                    <AILoadingIndicator message="AI is thinking..." size="sm" />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompts */}
              {messages.length <= 1 && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium">Quick suggestions:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {quickPrompts.map((prompt, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleQuickPrompt(prompt)}
                        className="text-xs h-8 justify-start hover:bg-primary/10 transition-colors"
                      >
                        {prompt}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Ask me anything about ${user?.role === 'employer' ? 'hiring...' : 'job searching...'}`}
                  disabled={isLoading}
                  className="form-input text-sm"
                />
                <Button 
                  onClick={sendMessage} 
                  disabled={isLoading || !inputMessage.trim()}
                  className="btn-primary px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default GeminiChat;
