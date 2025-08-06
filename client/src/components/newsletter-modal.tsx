import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Mail, CheckCircle } from "lucide-react";

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NewsletterModal({ isOpen, onClose }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setIsSubmitted(true);
    setIsLoading(false);
    
    // Close modal after success message
    setTimeout(() => {
      onClose();
      setIsSubmitted(false);
      setEmail("");
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-blue-600" />
            Stay With Us As We Grow
          </DialogTitle>
        </DialogHeader>
        
        {!isSubmitted ? (
          <div className="space-y-4">
            <p className="text-slate-600">
              Join our newsletter and be part of the journey as we discover Utah's hidden gems together. Get insider tips, new destinations, and Olympic venue updates delivered to your inbox.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              
              <div className="flex gap-2">
                <Button 
                  type="submit" 
                  disabled={isLoading || !email}
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Joining..." : "Join Our Newsletter"}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={onClose}
                  className="px-4"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </form>
            
            <p className="text-xs text-slate-500">
              We'll only send you important updates about TripKit launches. No spam, unsubscribe anytime.
            </p>
          </div>
        ) : (
          <div className="text-center py-6">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              You're all set!
            </h3>
            <p className="text-slate-600">
              Thanks for signing up. We'll notify you when TripKits are ready.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}