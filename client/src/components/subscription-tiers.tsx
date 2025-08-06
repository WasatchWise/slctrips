import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function SubscriptionTiers() {
  const { user, isAuthenticated } = useAuth();

  const handleUpgrade = (tier: string) => {
    // In a real app, this would open a payment modal or redirect to payment page
    // console.log(`Upgrading to ${tier}`);
  };

  const tiers = [
    {
      id: 'free',
      name: 'Explorer',
      price: 'Free',
      description: 'Perfect for casual adventurers',
      features: [
        '52 featured destinations (like a deck of cards!)',
        'Seasonal rotating picks',
        'Basic trip planning',
        'Drive time filtering',
        'Google Places reviews',
        'Photo galleries'
      ],
      current: user?.subscriptionTier === 'free'
    },
    {
      id: 'premium',
      name: 'Adventurer',
      price: '$29',
      period: '/year',
      description: 'For serious Utah explorers',
      popular: true,
      features: [
        'All 370+ destinations',
        'Detailed insider tips',
        'Exclusive hiking guides',
        'Premium photography spots',
        'Monthly newsletter'
      ],
      current: user?.subscriptionTier === 'premium'
    },
    {
      id: 'olympic',
      name: '2034 Insider',
      price: '$99',
      period: ' one-time',
      description: 'Ultimate Olympic experience',
      special: true,
      features: [
        'Everything in Adventurer',
        'Olympic venue access guides',
        'VIP event recommendations',
        'Concierge trip planning',
        'Early 2034 booking alerts'
      ],
      current: user?.subscriptionTier === 'olympic'
    }
  ];

  return (
    <section className="py-16 bg-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 mb-4">
            Choose Your Adventure Level
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Get the most out of your Utah adventures with insider access and exclusive content
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative ${
                tier.popular 
                  ? 'border-2 border-teal-500 shadow-lg' 
                  : tier.special 
                    ? 'bg-gradient-to-br from-orange-50 to-teal-50 border-2 border-orange-300' 
                    : 'shadow-lg'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-teal-500 text-white px-4 py-1 text-sm font-semibold">
                    Most Popular
                  </Badge>
                </div>
              )}
              {tier.special && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-orange-500 to-teal-500 text-white px-4 py-1 text-sm font-semibold">
                    Olympic Special
                  </Badge>
                </div>
              )}
              
              <CardHeader>
                <div className="text-center">
                  <CardTitle className="text-xl text-slate-900 mb-2">{tier.name}</CardTitle>
                  <div className="text-3xl font-bold text-slate-900 mb-1">
                    {tier.price}
                    {tier.period && <span className="text-lg font-normal text-slate-600">{tier.period}</span>}
                  </div>
                  <p className="text-slate-600">{tier.description}</p>
                </div>
              </CardHeader>
              
              <CardContent>
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <Check className={`w-5 h-5 mr-3 ${
                        tier.special ? 'text-orange-500' : 'text-green-500'
                      }`} />
                      <span className="text-slate-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                {tier.current ? (
                  <Button className="w-full" disabled>
                    Current Plan
                  </Button>
                ) : !isAuthenticated ? (
                  <Button 
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    onClick={() => window.location.href = "/api/login"}
                  >
                    Sign In to Upgrade
                  </Button>
                ) : tier.id === 'free' ? (
                  <Button className="w-full" variant="outline" disabled>
                    Downgrade
                  </Button>
                ) : (
                  <Button 
                    className={`w-full ${
                      tier.special 
                        ? 'bg-gradient-to-r from-orange-600 to-teal-600 hover:from-orange-700 hover:to-teal-700 text-white'
                        : 'bg-teal-600 hover:bg-teal-700 text-white'
                    }`}
                    onClick={() => handleUpgrade(tier.id)}
                  >
                    {tier.id === 'premium' ? 'Upgrade to Adventurer' : 'Get Olympic Access'}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
