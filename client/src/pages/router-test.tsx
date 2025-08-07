import { Route, Switch, useLocation } from 'wouter';

function RouterTest() {
  const [location] = useLocation();
  
  return (
    <div className="p-8 bg-orange-100 min-h-screen">
      <h1 className="text-2xl font-bold text-orange-800 mb-4">🧭 Router Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold text-gray-800">Current Location</h2>
          <p className="text-gray-700">{location}</p>
        </div>

        <div className="p-4 bg-white rounded shadow">
          <h2 className="font-bold text-gray-800">Test Links</h2>
          <div className="space-y-2">
            <a href="/router-test/page1" className="block text-blue-600 hover:underline">
              → Go to Page 1
            </a>
            <a href="/router-test/page2" className="block text-blue-600 hover:underline">
              → Go to Page 2
            </a>
            <a href="/router-test/page3" className="block text-blue-600 hover:underline">
              → Go to Page 3
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function Page1() {
  return (
    <div className="p-8 bg-green-100 min-h-screen">
      <h1 className="text-2xl font-bold text-green-800">✅ Page 1</h1>
      <p className="text-green-700">Router is working!</p>
      <a href="/router-test" className="text-blue-600 hover:underline">← Back to Router Test</a>
    </div>
  );
}

function Page2() {
  return (
    <div className="p-8 bg-blue-100 min-h-screen">
      <h1 className="text-2xl font-bold text-blue-800">✅ Page 2</h1>
      <p className="text-blue-700">Router is working!</p>
      <a href="/router-test" className="text-blue-600 hover:underline">← Back to Router Test</a>
    </div>
  );
}

function Page3() {
  return (
    <div className="p-8 bg-purple-100 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-800">✅ Page 3</h1>
      <p className="text-purple-700">Router is working!</p>
      <a href="/router-test" className="text-blue-600 hover:underline">← Back to Router Test</a>
    </div>
  );
}

export default function RouterTestApp() {
  return (
    <Switch>
      <Route path="/router-test" component={RouterTest} />
      <Route path="/router-test/page1" component={Page1} />
      <Route path="/router-test/page2" component={Page2} />
      <Route path="/router-test/page3" component={Page3} />
    </Switch>
  );
}
