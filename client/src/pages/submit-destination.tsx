import { useState } from "react";
import { CleanNavigation } from "@/components/clean-navigation";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Send, CheckCircle, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitDestination() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    address: "",
    website: "",
    phone: "",
    email: "",
    description: "",
    highlights: "",
    hours: "",
    pricing: "",
    seasonality: "",
    contactName: "",
    businessRole: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/submit-destination', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setSubmitted(true);
        toast({
          title: "Submission Received!",
          description: "We'll review your destination and get back to you within 3-5 business days.",
        });
      } else {
        throw new Error('Submission failed');
      }
    } catch (_error) {
      toast({
        title: "Submission Error",
        description: "Please try again or email us directly at admin@wasatchwise.com",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50 flex items-center justify-center p-4">
        <Card className="max-w-lg w-full text-center">
          <CardContent className="pt-8">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Submission Received!</h2>
            <p className="text-slate-600 mb-6">
              Thank you for submitting your destination. Our team will review it and contact you within 3-5 business days.
            </p>
            <div className="space-y-2 text-sm text-slate-500">
              <p>📧 You'll receive confirmation at: {formData.email}</p>
              <p>📞 We may call: {formData.phone}</p>
            </div>
            <Button 
              className="mt-6" 
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-teal-50">
      <CleanNavigation />
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Submit Your Destination
          </h1>
          <p className="text-xl opacity-90 mb-4">
            Help us grow Utah's most comprehensive adventure guide
          </p>
          <p className="text-lg opacity-80 mb-6 max-w-2xl mx-auto">
            We prioritize uniquely Utah experiences and honor local business owners. 
            Please no franchise or chain restaurants - we celebrate what makes Utah special.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Badge className="bg-white/20 text-white">
              <MapPin className="w-4 h-4 mr-1" />
              Free Listing
            </Badge>
            <Badge className="bg-white/20 text-white">
              <Clock className="w-4 h-4 mr-1" />
              3-5 Day Review
            </Badge>
            <Badge className="bg-white/20 text-white">
              <Star className="w-4 h-4 mr-1" />
              Professional Curation
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Tell us about your destination or business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Business/Destination Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="e.g., Red Canyon Adventures"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select onValueChange={(value) => handleInputChange('category', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="outdoor">Outdoor Recreation</SelectItem>
                      <SelectItem value="cultural">Cultural Attraction</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="dining">Dining & Food</SelectItem>
                      <SelectItem value="lodging">Lodging</SelectItem>
                      <SelectItem value="shopping">Shopping</SelectItem>
                      <SelectItem value="family">Family Friendly</SelectItem>
                      <SelectItem value="adventure">Adventure Sports</SelectItem>
                      <SelectItem value="wellness">Wellness & Spa</SelectItem>
                      <SelectItem value="education">Educational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Full Address *</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  placeholder="123 Main St, Park City, UT 84060"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    name="website"
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://yourbusiness.com"
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="(801) 555-0123"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Destination Details */}
          <Card>
            <CardHeader>
              <CardTitle>Destination Details</CardTitle>
              <CardDescription>
                Help visitors understand what makes your destination special
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe your destination, what activities you offer, and what makes you unique..."
                  rows={4}
                  required
                />
              </div>

              <div>
                <Label htmlFor="highlights">Key Highlights</Label>
                <Textarea
                  id="highlights"
                  name="highlights"
                  value={formData.highlights}
                  onChange={(e) => handleInputChange('highlights', e.target.value)}
                  placeholder="List your top 3-5 highlights (one per line)"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="hours">Operating Hours</Label>
                  <Textarea
                    id="hours"
                    name="hours"
                    value={formData.hours}
                    onChange={(e) => handleInputChange('hours', e.target.value)}
                    placeholder="Mon-Fri: 9am-5pm&#10;Sat-Sun: 8am-6pm"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="pricing">Pricing Information</Label>
                  <Textarea
                    id="pricing"
                    name="pricing"
                    value={formData.pricing}
                    onChange={(e) => handleInputChange('pricing', e.target.value)}
                    placeholder="$25 adults, $15 children&#10;Free parking included"
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="seasonality">Seasonality & Best Time to Visit</Label>
                <Input
                  id="seasonality"
                  name="seasonality"
                  value={formData.seasonality}
                  onChange={(e) => handleInputChange('seasonality', e.target.value)}
                  placeholder="e.g., Year-round, Best in summer, Winter only"
                />
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>
                We'll use this to follow up about your submission
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contactName">Your Name *</Label>
                  <Input
                    id="contactName"
                    name="contactName"
                    value={formData.contactName}
                    onChange={(e) => handleInputChange('contactName', e.target.value)}
                    placeholder="John Smith"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="businessRole">Your Role *</Label>
                  <Select onValueChange={(value) => handleInputChange('businessRole', value)} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Business Owner</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="marketing">Marketing Director</SelectItem>
                      <SelectItem value="employee">Employee</SelectItem>
                      <SelectItem value="representative">Authorized Representative</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="john@yourbusiness.com"
                  required
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="text-center">
            <Button
              type="submit"
              size="lg"
              disabled={loading}
              className="bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white px-8 py-3"
            >
              {loading ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Destination
                </>
              )}
            </Button>
            <p className="text-sm text-slate-500 mt-3">
              Free submission • 3-5 day review process • Professional curation
            </p>
          </div>
        </form>
      </div>
      <Footer />
    </div>
  );
}