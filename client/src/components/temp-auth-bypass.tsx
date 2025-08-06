import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, User } from "lucide-react";

interface TempAuthBypassProps {
  onContinue: () => void;
}

export function TempAuthBypass({ onContinue }: TempAuthBypassProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl font-bold text-slate-900">
            Welcome to SLC Trips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 flex items-start space-x-2">
            <AlertCircle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-orange-800">
              Authentication is temporarily being configured. You can continue exploring destinations without signing in.
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600 text-sm mb-4">
              Explore 700+ Utah destinations including Olympic venues, natural wonders, and hidden gems.
            </p>
          </div>

          <Button 
            onClick={onContinue}
            className="w-full"
            size="lg"
          >
            Continue to Platform
          </Button>
          
          <div className="text-center">
            <p className="text-xs text-slate-500">
              All destination data and features are available without login
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}