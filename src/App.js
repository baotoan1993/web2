import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'


import logo from './logo.svg';
import './App.css';
import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';

class App extends Component {
	render() {
		return (
			<Router>
				<div>

					<Navigation />

					<Route exact path='/' component={Home} />
					<Route path='/login' component={Login} />
					{/* <Route path='/product' component={Product}/> */}
				</div>
			</Router>
		);
	}
}

export default App;
