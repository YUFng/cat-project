import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css'; // Import the CSS file
import App from './App.js';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);