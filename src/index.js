import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';

// optional cofiguration
const options = {
    position: 'bottom right',
    timeout: 3000,
    offset: '30px',
    transition: 'scale'
}

ReactDOM.render(
    <AlertProvider template={AlertTemplate} {...options}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </AlertProvider >
    , document.getElementById('root'));
