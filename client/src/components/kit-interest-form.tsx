import { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { useToast } from "../hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "../lib/queryClient";
import { Star, ArrowUp, ArrowDown, Mail, Clock } from "lucide-react";

const AVAILABLE_KITS = [
  {
    id: "hip-young-single",
    name: "Hip Young Single Kit",
    description: "Trendy spots, social venues, and Instagram-worthy locations for young singles",
    color: "purple"
  },
  {
    id: "family-fun",
    name: "Family Fun Kit", 
    description: "Kid-friendly activities, educational experiences, and family adventures",
    color: "emerald"
  },
  {
    id: "budget-travel",
    name: "Budget Travel Kit",
    description: "Free and low-cost attractions, money-saving tips, and affordable dining",
    color: "blue"
  },
  {
    id: "foodie-tour",
    name: "Foodie Tour Kit",
    description: "Best restaurants, food trucks, breweries, and culinary experiences",
    color: "amber"
  },
  {
    id: "outdoor-adventure",
    name: "Outdoor Adventure Kit",
    description: "Hiking trails, climbing spots, skiing locations, and outdoor gear",
    color: "green"
  },
  {
    id: "romantic-getaway",
    name: "Romantic Getaway Kit",
    description: "Intimate venues, scenic viewpoints, romantic dining, and couples activities",
    color: "pink"
  },
  {
    id: "local-insider",
    name: "Local Insider Kit",
    description: "Hidden gems, local favorites, and off-the-beaten-path discoveries",
    color: "slate"
  },
  {
    id: "wellness-spa",
    name: "Wellness & Spa Kit",
    description: "Spas, wellness centers, yoga studios, and rejuvenating experiences",
    color: "teal"
  },
  {
    id: "olympic-complete",
    name: "Olympic Complete Kit",
    description: "Exclusive 2034 Winter Olympics venues, schedules, and insider access",
    color: "yellow"
  }
];

interface KitInterestFormProps {
  triggerText?: string;
  triggerVariant?: "default" | "outline" | "secondary";
  isOlympic?: boolean;
}

export function KitInterestForm({ 
  triggerText = "Show Interest", 
  triggerVariant = "default",
  isOlympic = false 
}: KitInterestFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedKits, setSelectedKits] = useState<string[]>([]);
  const [additionalFeedback, setAdditionalFeedback] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const submitInterestMutation = useMutation({
    mutationFn: async (data: {
      email: string;
      rankedKits: string[];
      feedback?: string;
    }) => {
      const response = await apiRequest("POST", "/api/kit-interest", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/analytics"] });
      setIsOpen(false);
      setEmail("");
      setSelectedKits([]);
      setAdditionalFeedback("");
      
      toast({
        title: "Interest Recorded!",
        description: "Thank you! We'll notify you when the kits are ready and give early access based on demand.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record interest. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleKitToggle = (kitId: string) => {
    if (selectedKits.includes(kitId)) {
      setSelectedKits(selectedKits.filter(id => id !== kitId));
    } else if (selectedKits.length < 5) {
      setSelectedKits([...selectedKits, kitId]);
    }
  };

  const moveKit = (kitId: string, direction: 'up' | 'down') => {
    const currentIndex = selectedKits.indexOf(kitId);
    if (currentIndex === -1) return;
    
    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= selectedKits.length) return;
    
    const newOrder = [...selectedKits];
    [newOrder[currentIndex], newOrder[newIndex]] = [newOrder[newIndex], newOrder[currentIndex]];
    setSelectedKits(newOrder);
  };

  const handleSubmit = () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email to receive kit notifications.",
        variant: "destructive",
      });
      return;
    }

    if (selectedKits.length === 0) {
      toast({
        title: "Select Kits",
        description: "Please select at least one kit you're interested in.",
        variant: "destructive",
      });
      return;
    }

    submitInterestMutation.mutate({
      email,
      rankedKits: selectedKits,
      feedback: additionalFeedback,
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {isOlympic ? (
          <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-white px-8 py-3 text-lg font-bold rounded-lg">
            <Star className="w-5 h-5 mr-2" />
            Get Notified When Available
          </Button>
        ) : (
          <Button variant={triggerVariant} className="w-full">
            <Clock className="w-4 h-4 mr-2" />
            {triggerText}
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" />
            Help Us Prioritize Kit Development
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">Kits Coming Soon!</h3>
            <p className="text-blue-800 text-sm">
              We're finalizing our TripKits and want to release the most wanted ones first. 
              Rank your top choices to help us prioritize development and get early access when they're ready.
            </p>
          </div>

          <div>
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="mt-1"
            />
            <p className="text-xs text-slate-500 mt-1">
              We'll notify you when your top-ranked kits are available
            </p>
          </div>

          <div>
            <Label>Select Up to 5 Kits (in order of preference)</Label>
            <p className="text-sm text-slate-600 mb-3">
              Click to select, then use arrows to rank your choices
            </p>
            
            {/* Selected Kits - Ranked Order */}
            {selectedKits.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2">Your Ranked Choices:</h4>
                <div className="space-y-2">
                  {selectedKits.map((kitId, index) => {
                    const kit = AVAILABLE_KITS.find(k => k.id === kitId);
                    if (!kit) return null;
                    
                    return (
                      <div key={kitId} className="flex items-center gap-2 bg-slate-50 p-2 rounded">
                        <span className="font-bold text-lg w-6">{index + 1}.</span>
                        <span className="flex-1 font-medium">{kit.name}</span>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveKit(kitId, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => moveKit(kitId, 'down')}
                            disabled={index === selectedKits.length - 1}
                          >
                            <ArrowDown className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleKitToggle(kitId)}
                          >
                            Remove
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Available Kits */}
            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto">
              {AVAILABLE_KITS.map((kit) => {
                const isSelected = selectedKits.includes(kit.id);
                const canSelect = selectedKits.length < 5 || isSelected;
                
                return (
                  <div
                    key={kit.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected 
                        ? 'bg-cyan-50 border-cyan-300' 
                        : canSelect 
                          ? 'hover:bg-slate-50 border-slate-200' 
                          : 'bg-slate-100 border-slate-200 opacity-50 cursor-not-allowed'
                    }`}
                    onClick={() => canSelect && handleKitToggle(kit.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{kit.name}</h4>
                        <p className="text-sm text-slate-600">{kit.description}</p>
                      </div>
                      {isSelected && (
                        <div className="text-cyan-600 font-bold">
                          #{selectedKits.indexOf(kit.id) + 1}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {selectedKits.length >= 5 && (
              <p className="text-sm text-amber-600 mt-2">
                Maximum 5 kits selected. Remove one to select another.
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="feedback">Additional Feedback (Optional)</Label>
            <Textarea
              id="feedback"
              value={additionalFeedback}
              onChange={(e) => setAdditionalFeedback(e.target.value)}
              placeholder="Any specific features or destinations you'd like to see in these kits?"
              rows={3}
              className="mt-1"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={submitInterestMutation.isPending || !email.trim() || selectedKits.length === 0}
              className="flex-1"
            >
              <Mail className="w-4 h-4 mr-2" />
              {submitInterestMutation.isPending ? "Recording..." : "Submit Interest"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}