import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Loader2, RefreshCw } from 'lucide-react';
import { getMainPhoto } from '../utils/getPhotoUrl';

interface PhotoTestProps {
  destination: any;
}

interface TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'loading';
  message: string;
  details?: any;
}

export function PhotoTest({ destination }: PhotoTestProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runTests = async () => {
    setIsRunning(true);
    const newResults: TestResult[] = [];

    // Test 1: Check if destination has photo data
    newResults.push({
      testName: 'Photo Data Structure',
      status: 'loading',
      message: 'Checking destination photo data...'
    });

    if (destination.photos && Array.isArray(destination.photos)) {
      newResults[0] = {
        testName: 'Photo Data Structure',
        status: 'pass',
        message: `Found ${destination.photos.length} photos in array`,
        details: destination.photos
      };
    } else if (destination.photo_url) {
      newResults[0] = {
        testName: 'Photo Data Structure',
        status: 'pass',
        message: 'Found photo_url field',
        details: { photo_url: destination.photo_url }
      };
    } else {
      newResults[0] = {
        testName: 'Photo Data Structure',
        status: 'fail',
        message: 'No photo data found in destination'
      };
    }

    setResults([...newResults]);

    // Test 2: Test getMainPhoto function
    newResults.push({
      testName: 'getMainPhoto Function',
      status: 'loading',
      message: 'Testing getMainPhoto function...'
    });

    setResults([...newResults]);

    try {
      const mainPhotoUrl = getMainPhoto(destination);
      if (mainPhotoUrl) {
        newResults[1] = {
          testName: 'getMainPhoto Function',
          status: 'pass',
          message: 'getMainPhoto returned a URL',
          details: { url: mainPhotoUrl }
        };
      } else {
        newResults[1] = {
          testName: 'getMainPhoto Function',
          status: 'fail',
          message: 'getMainPhoto returned null'
        };
      }
    } catch (error) {
      newResults[1] = {
        testName: 'getMainPhoto Function',
        status: 'fail',
        message: `getMainPhoto threw an error: ${error}`
      };
    }

    setResults([...newResults]);

    // Test 3: Test photo proxy endpoint
    newResults.push({
      testName: 'Photo Proxy API',
      status: 'loading',
      message: 'Testing photo proxy endpoint...'
    });

    setResults([...newResults]);

    try {
      const testUrl = '/images/downtown-slc-fallback.jpg';
      const proxyUrl = `/api/photo-proxy?url=${encodeURIComponent(testUrl)}`;
      
      const response = await fetch(proxyUrl);
      if (response.ok) {
        newResults[2] = {
          testName: 'Photo Proxy API',
          status: 'pass',
          message: 'Photo proxy endpoint is working',
          details: { status: response.status, contentType: response.headers.get('content-type') }
        };
      } else {
        newResults[2] = {
          testName: 'Photo Proxy API',
          status: 'fail',
          message: `Photo proxy returned status ${response.status}`,
          details: { status: response.status, statusText: response.statusText }
        };
      }
    } catch (error) {
      newResults[2] = {
        testName: 'Photo Proxy API',
        status: 'fail',
        message: `Photo proxy request failed: ${error}`
      };
    }

    setResults([...newResults]);

    // Test 4: Test actual destination photo loading
    newResults.push({
      testName: 'Destination Photo Loading',
      status: 'loading',
      message: 'Testing actual destination photo...'
    });

    setResults([...newResults]);

    const mainPhotoUrl = getMainPhoto(destination);
    if (mainPhotoUrl) {
      try {
        const img = new Image();
        img.onload = () => {
          newResults[3] = {
            testName: 'Destination Photo Loading',
            status: 'pass',
            message: 'Destination photo loaded successfully',
            details: { width: img.width, height: img.height }
          };
          setResults([...newResults]);
          setIsRunning(false);
        };
        img.onerror = () => {
          newResults[3] = {
            testName: 'Destination Photo Loading',
            status: 'fail',
            message: 'Destination photo failed to load'
          };
          setResults([...newResults]);
          setIsRunning(false);
        };
        img.src = mainPhotoUrl;
      } catch (error) {
        newResults[3] = {
          testName: 'Destination Photo Loading',
          status: 'fail',
          message: `Photo loading error: ${error}`
        };
        setResults([...newResults]);
        setIsRunning(false);
      }
    } else {
      newResults[3] = {
        testName: 'Destination Photo Loading',
        status: 'fail',
        message: 'No photo URL available to test'
      };
      setResults([...newResults]);
      setIsRunning(false);
    }
  };

  useEffect(() => {
    runTests();
  }, [destination]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'loading':
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      default:
        return null;
    }
  };

  const passedTests = results.filter(r => r.status === 'pass').length;
  const totalTests = results.length;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Camera className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-800">Photo System Test</h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            {passedTests}/{totalTests} tests passed
          </span>
          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`h-3 w-3 ${isRunning ? 'animate-spin' : ''}`} />
            Retest
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {results.map((result, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
            {getStatusIcon(result.status)}
            <div className="flex-1">
              <div className="font-medium text-gray-900">{result.testName}</div>
              <div className="text-sm text-gray-600">{result.message}</div>
              {result.details && (
                <details className="mt-2">
                  <summary className="cursor-pointer text-xs text-gray-500">
                    View Details
                  </summary>
                  <pre className="mt-1 text-xs bg-white p-2 rounded border overflow-auto">
                    {JSON.stringify(result.details, null, 2)}
                  </pre>
                </details>
              )}
            </div>
          </div>
        ))}
      </div>

      {totalTests > 0 && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-900 mb-2">Summary</div>
          <div className="text-sm text-gray-600">
            {passedTests === totalTests ? (
              <span className="text-green-600">✅ All tests passed! Photo system is working correctly.</span>
            ) : (
              <span className="text-yellow-600">
                ⚠️ {totalTests - passedTests} test(s) failed. Check the details above for issues.
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
} 