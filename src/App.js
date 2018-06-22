import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'


import Navigation from './components/Navigation';
import AdminNavigation from './components/admin/Navigation'
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products';
import Product_Detail from './components/Product_Detail';
import Cart from './components/Cart';
import Register from './components/Register';
import Admin_products from './components/admin/Admin_products';

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

class App extends Component {
	render() {
		return (
			<Router>
				<Provider store={store}>
					<div>
						<Navigation />
						<Switch>
							<Route exact path='/' component={Home} />
							<Route path='/login' component={Login} />
							<Route path='/register' component={Register} />
							<Route path='/products' component={Products} />
							<Route path='/product-item/:item' component={Product_Detail} />
							<Route path='/cart' component={Cart} />
							<Route path='/admin'>
								<Route path="/admin/products" component={Admin_products}></Route>
							</Route>
						</Switch>
					</div>
				</Provider>
			</Router>
		);
	}
}

export default App;
