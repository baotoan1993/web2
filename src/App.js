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


import Navigation from './components/Navigation';
import Home from './components/Home';
import Login from './components/Login';
import Products from './components/Products';
import Product_Detail from './components/Product_Detail';
import Cart from './components/Cart';
import Register from './components/Register';
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
					console.log(res.data)
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

		if (!username || !password || !confirm || !fullname) {
			alert('Chua dien thong tin')
		} else {
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
					if(res.data == '1')
						alert('đăng ký thành công!')
					else{
						alert('Tên tài khoản đang được sử dụng!!!')
					}
				})
			}
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
								<Route path='/login' render={User_Com(Login)} />
								<Route path='/register' render={User_Com(Register)} />
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
				<div>
					{/* Form*/}
					<div className="form">
						<div className="form-toggle" />
						<div className="form-panel one">
							<div className="form-header">
								<h1>ĐĂNG NHẬP TÀI KHOẢN</h1>
							</div>
							<div className="form-content">
								<form onSubmit={this.handleLogin}>
									<div className="form-group welcome">
										<label htmlFor="username">Tên đăng nhập</label>
										<input type="text" required ref="txtUsername" />
									</div>
									<div className="form-group welcome">
										<label htmlFor="password">Mật khẩu</label>
										<input type="password" required ref="txtPassword" />
									</div>
									<div className="form-group welcome">
										<button type="submit">Đăng nhập</button>
									</div>
								</form>
							</div>
						</div>
						<div className="form-panel two">
							<div className="form-header">
								<h1>ĐĂNG KÝ TÀI KHOẢN</h1>
							</div>
							<div className="form-content">
								<form>
									<div className="form-group welcome">
										<label htmlFor="username">Họ tên</label>
										<input type="text" required ref="txtRegFullname" />
									</div>
									<div className="form-group welcome">
										<label htmlFor="username">Tên đăng nhập</label>
										<input type="text" required ref="txtRegUsername" />
									</div>
									<div className="form-group welcome">
										<label htmlFor="password">Mật khẩu</label>
										<input type="password" required ref="txtRegPassword" />
									</div>
									<div className="form-group welcome">
										<label htmlFor="cpassword">Xác nhận mật khẩu</label>
										<input type="password" required ref="txtRegConfirm" />
									</div>
									<div className="form-group welcome">
										<button type="submit" onClick={this.handleRegister}>Đăng ký</button>
									</div>
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
