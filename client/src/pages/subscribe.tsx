import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Download, Users, Zap, Crown, Star } from "lucide-react";

export default function Subscribe() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Join the Utah Insider Community
          </h1>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Get exclusive curated collections, early access to Olympic updates, and insider discounts
          </p>
        </div>
      </div>

      {/* Curated Collections Library */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Curated Collections Library</h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Download professionally curated destination collections organized by travel time and theme
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* Downtown & Nearby - 30 MIN */}
          <Card className="relative overflow-hidden bg-primary text-white">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-teal-200 text-teal-800 font-bold">30 MIN</Badge>
                <span className="text-sm opacity-90">24 destinations</span>
              </div>
              <CardTitle className="text-2xl">Downtown & Nearby</CardTitle>
              <CardDescription className="text-teal-100">
                Temple Square, Museums, Urban Adventures
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-teal-700 hover:bg-teal-50 font-bold"
                onClick={() => window.open('https://gumroad.com/l/slc-downtown-nearby', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now - $12
              </Button>
            </CardContent>
          </Card>

          {/* Ski Country - 1 HOUR */}
          <Card className="relative overflow-hidden bg-orange-600 text-white">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-yellow-400 text-orange-800 font-bold">1 HOUR</Badge>
                <span className="text-sm opacity-90">48 destinations</span>
              </div>
              <CardTitle className="text-2xl">Ski Country</CardTitle>
              <CardDescription className="text-orange-100">
                Park City, Deer Valley, Olympic Venues
              </CardDescription>
              <Badge className="bg-yellow-500 text-black font-bold mt-2 w-fit">
                2034 OLYMPICS
              </Badge>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-orange-700 hover:bg-orange-50 font-bold"
                onClick={() => window.open('https://gumroad.com/l/slc-ski-country-olympics', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now - $19
              </Button>
            </CardContent>
          </Card>

          {/* Natural Wonders - 2 HOURS */}
          <Card className="relative overflow-hidden bg-green-600 text-white">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-green-200 text-green-800 font-bold">2 HOURS</Badge>
                <span className="text-sm opacity-90">89 destinations</span>
              </div>
              <CardTitle className="text-2xl">Natural Wonders</CardTitle>
              <CardDescription className="text-green-100">
                Antelope Island, Hot Springs, Canyons
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-green-700 hover:bg-green-50 font-bold"
                onClick={() => window.open('https://gumroad.com/l/slc-natural-wonders', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now - $16
              </Button>
            </CardContent>
          </Card>

          {/* National Parks - 3-5 HRS */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-amber-200 text-amber-800 font-bold">3-5 HRS</Badge>
                <span className="text-sm opacity-90">124 destinations</span>
              </div>
              <CardTitle className="text-2xl">National Parks</CardTitle>
              <CardDescription className="text-amber-100">
                Arches, Capitol Reef, Adventure Base
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-amber-700 hover:bg-amber-50 font-bold"
                onClick={() => window.open('https://gumroad.com/l/slc-national-parks', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now - $22
              </Button>
            </CardContent>
          </Card>

          {/* Epic Adventures - 6-8 HRS */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-purple-600 text-white">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-pink-200 text-pink-800 font-bold">6-8 HRS</Badge>
                <span className="text-sm opacity-90">67 destinations</span>
              </div>
              <CardTitle className="text-2xl">Epic Adventures</CardTitle>
              <CardDescription className="text-pink-100">
                Zion, Bryce Canyon, Southern Utah
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-pink-700 hover:bg-pink-50 font-bold"
                onClick={() => window.open('https://gumroad.com/l/slc-epic-adventures', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now - $25
              </Button>
            </CardContent>
          </Card>

          {/* Ultimate Escapes - 8-12 HRS */}
          <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700 text-white">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <Badge className="bg-indigo-200 text-indigo-800 font-bold">8-12 HRS</Badge>
                <span className="text-sm opacity-90">18 destinations</span>
              </div>
              <CardTitle className="text-2xl">Ultimate Escapes</CardTitle>
              <CardDescription className="text-indigo-100">
                Yellowstone, Grand Canyon, Road Trips
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                className="w-full bg-white text-indigo-700 hover:bg-indigo-50 font-bold"
                onClick={() => window.open('https://gumroad.com/l/slc-ultimate-escapes', '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download Now - $29
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Subscription Plans */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose Your Adventure Level</h2>
          <p className="text-lg text-slate-600">
            Unlock premium features, discounts, and exclusive content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Free Explorer */}
          <Card className="relative">
            <CardHeader>
              <CardTitle className="text-xl">Free Explorer</CardTitle>
              <CardDescription>Perfect for casual Utah visitors</CardDescription>
              <div className="text-3xl font-bold">$0<span className="text-lg font-normal text-slate-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Access to 498 (and counting) destinations</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Basic trip planning tools</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Olympic venue information</span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Utah Insider */}
          <Card className="relative border-2 border-teal-500 shadow-xl">
            <div className="absolute top-0 right-0 bg-teal-500 text-white px-3 py-1 text-sm font-bold">
              POPULAR
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-teal-700">Utah Insider</CardTitle>
              <CardDescription>For serious Utah adventurers</CardDescription>
              <div className="text-3xl font-bold">$9<span className="text-lg font-normal text-slate-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span>All Free Explorer features</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span>Download all curated collections</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span>20% discount on planning kits</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span>Monthly insider newsletter</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-teal-600" />
                  <span>Early access to Olympic updates</span>
                </div>
              </div>
              <Button className="w-full bg-teal-600 hover:bg-teal-700">
                <Users className="w-4 h-4 mr-2" />
                Become an Insider
              </Button>
            </CardContent>
          </Card>

          {/* Olympic VIP */}
          <Card className="relative bg-gradient-to-br from-orange-50 to-red-50 border-2 border-orange-500">
            <div className="absolute top-0 right-0 bg-orange-500 text-white px-3 py-1 text-sm font-bold">
              2034 SPECIAL
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-orange-700">Olympic VIP</CardTitle>
              <CardDescription>Ultimate 2034 Olympics experience</CardDescription>
              <div className="text-3xl font-bold">$29<span className="text-lg font-normal text-slate-500">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600" />
                  <span>All Utah Insider features</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600" />
                  <span>Exclusive Olympic venue access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600" />
                  <span>50% discount on all planning kits</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600" />
                  <span>VIP newsletter with insider tips</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600" />
                  <span>Priority Olympic ticket access</span>
                </div>
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-orange-600" />
                  <span>Affiliate partnership opportunities</span>
                </div>
              </div>
              <Button className="w-full bg-orange-600 hover:bg-orange-700">
                <Crown className="w-4 h-4 mr-2" />
                Go VIP for Olympics
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 bg-primary text-white rounded-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Ready to Become a Utah Insider?</h3>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of travelers who rely on our curated collections and insider knowledge
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-teal-700 hover:bg-teal-50 font-bold">
              <Star className="w-5 h-5 mr-2" />
              Start Utah Insider Trial
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-teal-700 font-bold">
              <Zap className="w-5 h-5 mr-2" />
              Upgrade to Olympic VIP
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}