import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


import Navigation from './components/Navigation';
import AdminNavigation from './components/admin/Navigation'
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products';
import Product_Detail from './components/Product_Detail';
import Cart from './components/Cart';
import Register from './components/Register';
import Admin_products from './components/admin/Admin_products';
import Admin_product_add from './components/admin/Admin_product_add';


class App extends Component {
	render() {
		return (
			<Router>
				<div>
					<Navigation />
					<Switch>
						<Route exact path='/' component={Home} />
						<Route path='/login' component={Login} />
						<Route path='/register' component={Register} />
						<Route path='/products' component={Products} />
						<Route path='/product-item/:item' component={Product_Detail} />
						<Route path='/cart' component={Cart} />
						<Route exact path='/admin' />

						<Route exact path="/admin/products" component={Admin_products} />
						<Route path="/admin/products/add" component={Admin_product_add} />
					</Switch>
				</div>
			</Router>
		);
	}
}

export default App;
