import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { MessageCircle, Send, X, MapPin, Clock } from "lucide-react";
import { Badge } from "./ui/badge";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";

interface ChatMessage {
  id: string;
  role: 'user' | 'dan';
  content: string;
  timestamp: Date;
  suggestions?: string[];
  destinations?: Array<{
    id: number;
    name: string;
    category: string;
    driveTime: string;
    distance: string;
  }>;
}

export default function DanChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'dan',
      content: "Hey there! I'm Dan, your Utah adventure guide! 🏔️ I can help you discover amazing destinations, plan your trips, find the perfect Olympic venues, and answer any questions about Utah's incredible outdoor scene. What adventure are you looking for today?",
      timestamp: new Date(),
      suggestions: [
        "Show me Olympic venues",
        "Find destinations under 30 minutes away",
        "What's good for families?",
        "Best winter activities"
      ]
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const chatMutation = useMutation({
    mutationFn: async (userMessage: string) => {
      return await apiRequest("/api/chat/dan", {
        method: "POST",
        body: JSON.stringify({ message: userMessage }),
        headers: { "Content-Type": "application/json" }
      });
    },
    onSuccess: (response: { message?: string; suggestions?: string[]; destinations?: Array<{ id: number; name: string; category: string; driveTime: string; distance: string }> }) => {
      const danMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'dan',
        content: response.message || "I'm here to help you explore Utah's amazing destinations!",
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        destinations: response.destinations || []
      };
      setMessages(prev => [...prev, danMessage]);
      setIsTyping(false);
    },
    onError: (error) => {
      // Log error for debugging
      // // console.error('Chat error:', error);
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'dan',
        content: "Sorry, I'm having trouble connecting right now. Try asking me about Olympic venues, drive times, or family-friendly destinations!",
        timestamp: new Date(),
        suggestions: [
          "Show me Olympic venues",
          "Find nearby destinations",
          "What's good for families?"
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    }
  });

  const handleSendMessage = () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    
    chatMutation.mutate(input);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    handleSendMessage();
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 bg-blue-600 hover:bg-blue-700 shadow-lg"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
        <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
          Dan
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)]">
      <Card className="shadow-2xl border-2">
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-lg">Dan</CardTitle>
                <p className="text-blue-100 text-sm">Your Utah Adventure Guide</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea ref={scrollAreaRef} className="h-96 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] ${
                    message.role === 'user' 
                      ? 'bg-blue-600 text-white rounded-l-lg rounded-tr-lg' 
                      : 'bg-slate-100 text-slate-900 rounded-r-lg rounded-tl-lg'
                  } p-3`}>
                    <p className="text-sm">{message.content}</p>
                    
                    {message.destinations && message.destinations.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {message.destinations.map((dest) => (
                          <div key={dest.id} className="bg-white/10 rounded p-2 text-xs">
                            <div className="font-semibold">{dest.name}</div>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {dest.category}
                              </Badge>
                              <span className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {dest.driveTime}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {message.suggestions && (
                      <div className="mt-3 flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, idx) => (
                          <Button
                            key={idx}
                            variant="outline"
                            size="sm"
                            onClick={() => handleSuggestionClick(suggestion)}
                            className="text-xs h-6 px-2"
                          >
                            {suggestion}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 text-slate-900 rounded-r-lg rounded-tl-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Dan about Utah adventures..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={chatMutation.isPending}
              />
              <Button 
                onClick={handleSendMessage} 
                disabled={!input.trim() || chatMutation.isPending}
                size="sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}