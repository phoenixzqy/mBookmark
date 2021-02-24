import React from 'react';
import ReactDOM from 'react-dom';
import GAnalytics from 'ganalytics';
import App from '@components/App';
import './index.css';

ReactDOM.render(<App />, document.getElementById('app'));

// disable service worker for No Cache.
// if (process.env.NODE_ENV === 'production') {
//   window.ga = new GAnalytics('UA-XXXXXXXX-X');
// 
//   // Service Worker registration
//   if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('/pwanything/sw.js', {scope: '/pwanything/'});
//   }
// }
