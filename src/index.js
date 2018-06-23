import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import { createStore } from 'redux'
import { Provider, connect } from 'react-redux'

var initialState = JSON.parse(localStorage.getItem('user'))
var store = createStore((state = initialState, action) => {
	switch (action.type) {
		case 'LOGIN':
			state = { ...action.data }
			break
		case 'LOGOUT':
			state = null
			break
	}
	return state
})

ReactDOM.render(<Provider store={store}><App /></Provider>, document.getElementById('root'));
registerServiceWorker();
