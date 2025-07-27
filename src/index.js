import React from 'react';
import ReactDOM from 'react-dom/client'; // CORRECT // Import from 'react/client' for React 18+
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);