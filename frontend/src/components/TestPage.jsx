import React from 'react';

export default function TestPage() {
  return (
    <div style={{ padding: '20px', backgroundColor: '#f0f0f0', minHeight: '100vh' }}>
      <h1>Test Page - Frontend is Working!</h1>
      <p>If you can see this, the React app is loading correctly.</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

