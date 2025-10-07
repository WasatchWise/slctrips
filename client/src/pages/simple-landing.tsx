import React from "react";

export default function SimpleLanding() {
  const categories = [
    { name: "Outdoor Adventures", color: "#10b981", count: "200+ trails" },
    { name: "Winter Sports", color: "#3b82f6", count: "15+ resorts" },
    { name: "Scenic Views", color: "#8b5cf6", count: "100+ viewpoints" },
    { name: "Local Dining", color: "#f59e0b", count: "300+ restaurants" },
    { name: "Cafes & Brews", color: "#f97316", count: "50+ spots" },
    { name: "Road Trips", color: "#6366f1", count: "25+ routes" }
  ];

  const stats = [
    { number: "1000+", label: "Destinations" },
    { number: "15", label: "National Parks" },
    { number: "2034", label: "Olympics Ready" },
    { number: "24/7", label: "Adventure Time" }
  ];

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Hero Section */}
      <section style={{ 
        background: 'linear-gradient(135deg, #f7f0e8 0%, #dbeafe 100%)',
        padding: '3rem 1rem',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 5vw, 4rem)', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            color: '#1f2937'
          }}>
            <span style={{ color: '#0087c8' }}>1 Airport * 1000+ Destinations.</span>{' '}
            <span style={{ color: '#0d2a40' }}>1 Airport.</span><br />
            <span style={{ color: '#f4b441' }}>Endless Adventures.</span>
          </h1>
          <p style={{ 
            fontSize: '1.25rem', 
            color: '#4b5563', 
            maxWidth: '600px', 
            margin: '0 auto 2rem',
            lineHeight: '1.6'
          }}>
            Discover hidden gems, epic views, and things to do.<br />
            Just minutes from Salt Lake City International.
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem', 
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button style={{
              backgroundColor: '#3b82f6',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s'
            }}>
              Explore Destinations →
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: '#3b82f6',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '2px solid #3b82f6',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}>
              Search Places
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        padding: '3rem 1rem',
        background: 'linear-gradient(135deg, #f8fafc 0%, #dbeafe 100%)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '2rem'
          }}>
            {stats.map((stat, index) => (
              <div key={index} style={{ textAlign: 'center' }}>
                <div style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: 'bold', 
                  color: '#1f2937',
                  marginBottom: '0.5rem'
                }}>
                  {stat.number}
                </div>
                <div style={{ 
                  fontSize: '0.875rem', 
                  color: '#6b7280',
                  fontWeight: '500'
                }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section style={{ padding: '4rem 1rem', backgroundColor: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937',
              marginBottom: '1rem'
            }}>
              Discover Utah by Category
            </h2>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#6b7280',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              From mountain peaks to city streets, find your perfect adventure
            </p>
          </div>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '1rem'
          }}>
            {categories.map((category, index) => (
              <div key={index} style={{
                background: `linear-gradient(135deg, ${category.color} 0%, ${category.color}dd 100%)`,
                padding: '1.5rem',
                borderRadius: '0.75rem',
                textAlign: 'center',
                color: 'white',
                cursor: 'pointer',
                transition: 'transform 0.3s, box-shadow 0.3s',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
              }}>
                <h3 style={{ 
                  fontWeight: '600', 
                  fontSize: '0.875rem',
                  marginBottom: '0.25rem'
                }}>
                  {category.name}
                </h3>
                <p style={{ 
                  fontSize: '0.75rem', 
                  opacity: '0.9'
                }}>
                  {category.count}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ 
        padding: '5rem 1rem',
        background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
        color: 'white',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: 'bold',
            marginBottom: '1.5rem'
          }}>
            Ready for Your Utah Adventure?
          </h2>
          <p style={{ 
            fontSize: '1.25rem',
            marginBottom: '2rem',
            opacity: '0.9'
          }}>
            Explore over 1000 destinations within driving distance of Salt Lake City
          </p>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            gap: '1rem',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <button style={{
              backgroundColor: 'white',
              color: '#3b82f6',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'background-color 0.3s'
            }}>
              Explore Destinations →
            </button>
            <button style={{
              backgroundColor: 'transparent',
              color: 'white',
              padding: '0.75rem 2rem',
              borderRadius: '0.5rem',
              fontWeight: '600',
              border: '2px solid white',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s'
            }}>
              Search Places
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ 
        backgroundColor: '#1f2937', 
        color: 'white', 
        padding: '3rem 1rem'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                SLC Trips
              </h3>
              <p style={{ color: '#9ca3af' }}>
                Your ultimate guide to Utah adventures, from Salt Lake City to everywhere.
              </p>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, color: '#9ca3af' }}>
                <li style={{ marginBottom: '0.5rem' }}>Destinations</li>
                <li style={{ marginBottom: '0.5rem' }}>Search</li>
                <li style={{ marginBottom: '0.5rem' }}>Analytics</li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontWeight: '600', marginBottom: '1rem' }}>Connect</h4>
              <p style={{ color: '#9ca3af' }}>
                Ready for the 2024 Winter Olympics? Start exploring Utah today.
              </p>
            </div>
          </div>
          <div style={{ 
            borderTop: '1px solid #374151', 
            marginTop: '2rem', 
            paddingTop: '2rem',
            textAlign: 'center',
            color: '#9ca3af'
          }}>
            <p>&copy; 2024 SLC Trips. Made with ❤️ for Utah adventures.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}