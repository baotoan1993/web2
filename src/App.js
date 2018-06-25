// import React, { Component } from 'react';
// import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'


// import Navigation from './components/Navigation';
// import AdminNavigation from './components/admin/Navigation'
// import Home from './components/Home';
// import Login from './components/Login';
// import Products from './components/Products';
// import Product_Detail from './components/Product_Detail';
// import Cart from './components/Cart';
// import Register from './components/Register';
// import Admin_products from './components/admin/Admin_products';
// import Admin_product_add from './components/admin/Admin_product_add';
// import Admin_product_detail from './components/admin/Admin_product_detail';

// const User_Com = (Com) => {
// 	return (
// 		(props) => (
// 			<React.Fragment>
// 				<Navigation />
// 				<Com {...props} />
// 			</React.Fragment>
// 		)
// 	)
// }


// class App extends Component {
// 	render() {
// 		return (
// 			<Router>
// 				<div>
// 					<Navigation />
// 					<Switch>
// 						<Route exact path='/' component={Home} />
// 						<Route path='/login' component={Login} />
// 						<Route path='/register' component={Register} />
// 						<Route path='/products' component={Products} />
// 						<Route path='/product-item/:item' component={Product_Detail} />
// 						<Route path='/cart' component={Cart} />
// 						<Route exact path='/admin' />

// 						<Route exact path="/admin/products" component={Admin_products} />
// 						<Route path="/admin/products/add" component={Admin_product_add} />
// 						<Route path="/admin/product/detail/:id" component={Admin_product_detail} />
// 					</Switch>
// 				</div>
// 			</Router>
// 		);
// 	}
// }

// export default App;




import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'


import Navigation from './components/client/Navigation';
import Home from './components/client/Home';
import Login from './components/client/Login';
import Products from './components/client/Products';
import Product_Detail from './components/client/Product_Detail';
import Cart from './components/client/Cart';
import Register from './components/client/Register';

import Admin_products from './components/admin/Admin_products';
import Admin_product_add from './components/admin/Admin_product_add';
import Admin_product_detail from './components/admin/Admin_product_detail';

import './Appp.css'

const User_Com = (Com) => {
	return (
		(props) => (
			<React.Fragment>
				<Navigation />
				<Com {...props} />
			</React.Fragment>
		)
	)
}



class App extends Component {

	handleLogin = (e) => {
		e.preventDefault()
		let username = this.refs.txtUsername.value
		let password = this.refs.txtPassword.value

		axios.post('http://localhost:4000/login', {
			username: username,
			password: password
		})
			.then(res => {
				// console.log(res.data)
				if (res.data.status == 1) {
					localStorage.setItem('user', JSON.stringify(res.data.user))
					localStorage.setItem('userkey', res.data.userkey)
					this.props.dispatch({ type: 'LOGIN', data: res.data.user })
					setTimeout(() => {
						this.setState({
							isLogged: true
						})

					}, 1000)
				} else {
					alert("Tên đăng nhập hoặc mật khẩu không đúng!")
				}

			})
	}

	handleRegister = (e) => {
		e.preventDefault()
		let username = this.refs.txtRegUsername.value
		let password = this.refs.txtRegPassword.value
		let confirm = this.refs.txtRegConfirm.value
		let fullname = this.refs.txtRegFullname.value

		if (confirm != password) {
			alert('Không khớp xác nhận mật khẩu!')
		} else {
			axios({
				url: 'http://localhost:4000/register',
				method: 'post',
				data: {
					username: username,
					password: password,
					fullname: fullname
				}
			}).then((res) => {
				if (res.data == '1')
					alert('đăng ký thành công!')
				else {
					alert('Tên tài khoản đang được sử dụng!!!')
				}
			})
		}
	}

	render() {
		if ((JSON.parse(localStorage.getItem('user'))) != null) {
			if (!(JSON.parse(localStorage.getItem('user'))).role) {
				return (
					<div>
						<Router>
							<Switch>
								<Route exact path='/' render={User_Com(Home)} />
								<Route path='/products' render={User_Com(Products)} />
								<Route path='/product-item/:item' render={User_Com(Product_Detail)} />
								<Route path='/cart' render={User_Com(Cart)} />
							</Switch>

						</Router>
					</div>
				)
			} else {
				return (
					<div>
						<Router>
							<Switch>
								<Route exact path="/" component={Admin_products} />
								<Route exact path="/admin/products" component={Admin_products} />
								<Route path="/admin/products/add" component={Admin_product_add} />
								<Route path="/admin/product/detail/:id" component={Admin_product_detail} />
							</Switch>

						</Router>
					</div>
				)
			}
		} else {
			return (
				<div className="login-wrap">
					<div className="login-html">
						<input id="tab-1" type="radio" name="tab" className="sign-in" defaultChecked />
						<label htmlFor="tab-1" className="tab">Đăng Nhập</label>
						<input id="tab-2" type="radio" name="tab" className="sign-up" />
						<label htmlFor="tab-2" className="tab">Đăng ký</label>
						<div className="login-form">
							<form onSubmit={this.handleLogin}>
								<div className="sign-in-htm">
									<div className="group">
										<label htmlFor="user" className="label">Tên đăng nhập</label>
										<input type="text" className="input" required ref="txtUsername" />
									</div>
									<div className="group">
										<label htmlFor="pass" className="label">Mật khẩu</label>
										<input type="password" className="input"
											data-type="password" required
											ref="txtPassword" />
									</div>
									<div className="group">
										<input type="submit" className="button" defaultValue="ĐĂNG NHẬP" />
									</div>
									<div className="hr" />
									<div className="foot-lnk">
										<h3>Chào mừng trở lại!!!</h3>
									</div>
								</div>
							</form>
							<div className="sign-up-htm">
								<form onSubmit={this.handleRegister}>
									<div className="group">
										<label htmlFor="user" className="label">Tên đăng nhập</label>
										<input type="text" className="input" required
											ref="txtRegUsername" />
									</div>
									<div className="group">
										<label htmlFor="pass" className="label">Mật khẩu</label>
										<input type="password" className="input"
											data-type="password" required
											ref="txtRegPassword" />
									</div>
									<div className="group">
										<label htmlFor="pass" className="label">Xác nhận mật khẩu</label>
										<input type="password" className="input"
											data-type="password" required
											ref="txtRegConfirm" />
									</div>
									<div className="group">
										<label htmlFor="pass" className="label">Họ tên</label>
										<input type="text" className="input" required
											ref="txtRegFullname" />
									</div>
									<div className="group">
										<input type="submit" className="button" defaultValue="ĐĂNG KÝ" />
									</div>
									<div className="hr" />
								</form>
							</div>
						</div>
					</div>
				</div>


			)
		}
	}
}

export default connect()(App);
