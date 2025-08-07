import React from "react";
import { createRoot } from "react-dom/client";

function SimpleApp() {
  return React.createElement('div', {
    style: {
      padding: '2rem',
      backgroundColor: '#f0f8ff',
      minHeight: '100vh'
    }
  }, [
    React.createElement('h1', {
      key: 'title',
      style: {
        color: '#0066cc',
        fontSize: '2rem',
        marginBottom: '1rem'
      }
    }, '🎯 Simple React Test'),
    React.createElement('p', {
      key: 'status',
      style: {
        color: '#0066cc'
      }
    }, 'If you can see this, React is working!')
  ]);
}

const root = document.getElementById("root");
if (root) {
  createRoot(root).render(React.createElement(SimpleApp));
} else {
  console.error("Root element not found");
}
