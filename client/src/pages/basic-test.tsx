export default function BasicTest() {
  return (
    <div style={{ padding: '2rem', backgroundColor: '#f0f8ff', minHeight: '100vh' }}>
      <h1 style={{ color: '#0066cc', fontSize: '2rem', marginBottom: '1rem' }}>
        🎯 Basic React Test
      </h1>
      
      <div style={{ backgroundColor: '#e6f3ff', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2 style={{ color: '#0066cc', marginBottom: '0.5rem' }}>✅ Status</h2>
        <p style={{ color: '#0066cc' }}>
          If you can see this blue box, React is working!
        </p>
      </div>

      <div style={{ backgroundColor: '#fff3cd', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
        <h2 style={{ color: '#856404', marginBottom: '0.5rem' }}>🔧 Next Steps</h2>
        <p style={{ color: '#856404' }}>
          If React is working, the issue is with routing or API calls.
        </p>
      </div>

      <div style={{ backgroundColor: '#d4edda', padding: '1rem', borderRadius: '8px' }}>
        <h2 style={{ color: '#155724', marginBottom: '0.5rem' }}>🧪 Test Links</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <a href="/" style={{ color: '#0066cc', textDecoration: 'underline' }}>
            → Home
          </a>
          <a href="/destinations" style={{ color: '#0066cc', textDecoration: 'underline' }}>
            → Destinations
          </a>
        </div>
      </div>
    </div>
  );
}
