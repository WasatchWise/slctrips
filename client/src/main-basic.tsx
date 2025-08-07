console.log('🔍 Testing if JavaScript is executing...');

// Test if React is available
try {
  const React = require('react');
  console.log('✅ React is available');
} catch (error) {
  console.error('❌ React is not available:', error);
}

// Test if React DOM is available
try {
  const { createRoot } = require('react-dom/client');
  console.log('✅ React DOM is available');
} catch (error) {
  console.error('❌ React DOM is not available:', error);
}

// Simple DOM manipulation test
const root = document.getElementById("root");
if (root) {
  console.log('✅ Root element found');
  root.innerHTML = `
    <div style="padding: 2rem; background-color: #f0f8ff; min-height: 100vh;">
      <h1 style="color: #0066cc; font-size: 2rem; margin-bottom: 1rem;">
        🎯 Basic JavaScript Test
      </h1>
      <p style="color: #0066cc;">
        If you can see this, JavaScript is working!
      </p>
      <div style="background-color: #e6f3ff; padding: 1rem; border-radius: 8px; margin-top: 1rem;">
        <h2 style="color: #0066cc; margin-bottom: 0.5rem;">🔧 Console Logs</h2>
        <p style="color: #0066cc;">
          Check the browser console (F12) to see if React and React DOM are available.
        </p>
      </div>
    </div>
  `;
} else {
  console.error('❌ Root element not found');
}
