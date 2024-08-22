import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './tailwind.css'; // Import Tailwind CSS


// Create a root.
const root = ReactDOM.createRoot(document.getElementById('root'));

// Render your React app
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
