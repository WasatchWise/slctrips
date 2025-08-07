import React from "react";

export default function AppMinimal() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <h1 style={{ color: '#0066cc', fontSize: '2rem', marginBottom: '1rem' }}>
        🎯 Minimal React Test
      </h1>
      
      <div style={{ backgroundColor: '#e6f3ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>✅ Status</h2>
        <p style={{ color: '#0066cc' }}>
          If you can see this, React is working without any external dependencies!
        </p>
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px' }}>
        <h2 style={{ color: '#856404', marginBottom: '0.5rem' }}>🔧 Next Steps</h2>
        <p style={{ color: '#856404' }}>
          If this works, the issue is with routing, API calls, or other dependencies.
        </p>
      </div>
    </div>
  );
}
