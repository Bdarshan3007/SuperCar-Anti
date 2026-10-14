/* ==========================================================================
   REACT MAIN ENTRY POINT
   Imports global design system styles and mounts to root DOM node
   ========================================================================== */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/animations.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
