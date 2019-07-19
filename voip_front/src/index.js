import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import firebase from 'firebase/app';
const firebaseConfig = {
    apiKey: "AIzaSyB7fz9X8h3qxT8ianOAxZq-XXbxGDnXWNQ",
    authDomain: "voipweb-aunea.firebaseapp.com",
    databaseURL: "https://voipweb-aunea.firebaseio.com",
    projectId: "voipweb-aunea",
    storageBucket: "",
    messagingSenderId: "457837724296",
    appId: "1:457837724296:web:c1aceae25e8f0359"
};
firebase.initializeApp(firebaseConfig);

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
