import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class Navigation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLogged: false
		}
	}

	handleLogout = (event) => {
		event.preventDefault()
		alert('Đăng xuất thành công!')
		localStorage.removeItem('user')
		this.props.dispatch({ type: 'LOGOUT' })
		setTimeout(() => {
			window.location.href = '/'
		}, 300)
	}

	render() {
		var canCart = this.props.state == null ?
			null
			:
			<li className="nav-item">
				<NavLink className="nav-link" to="/cart">
					<i className="fa fa-cart-arrow-down" aria-hidden="true" />&nbsp;Giỏ Hàng
				</NavLink>
			</li>

		var canProduct = this.props.state == null ?
			null
			:
			<li className="nav-item">
				<NavLink className="nav-link" to="/products">
					<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;Sản Phẩm
				</NavLink>
			</li>

		var canLogin = this.props.state == null ?
			<li className="nav-item">
				<NavLink className="nav-link" to="/login">
					<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;Đăng Nhập
				</NavLink>
			</li>
			:
			<li className="nav-item">
				<NavLink className="nav-link" to="/logout" onClick={this.handleLogout} activeClassName="active">
					<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;{this.props.state.fullname}(Đăng xuât)
				</NavLink>
			</li>

		var canRegis = this.props.state == null ?
			<li className="nav-item">
				<NavLink className="nav-link" to="/register">
				<i className="fa fa-address-card-o" aria-hidden="true" />&nbsp;Đăng Ký
				</NavLink>
			</li> : null

		return (
			<header>
				<div className="container-fluid" id="header">
					<nav className="navbar navbar-expand-md navbar-light" style={{ background: '#F0F8FF' }}>
						{/* Brand */}
						<NavLink className="navbar-brand" exact to="/" style={{ textAlign: 'center' }}>
							<img src="/images/Logo.png" alt="logo.png" style={{ width: '50%' }} />
						</NavLink>
						{/* Toggler/collapsibe Button */}
						<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
							<span className="navbar-toggler-icon" />
						</button>
						{/* Navbar links */}
						<div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
							<ul className="navbar-nav">
								<li className="nav-item">
									<NavLink className="nav-link" exact to="/">
										<i className="fa fa-home" aria-hidden="true" />&nbsp;Trang Chủ
									</NavLink>
								</li>
								{canCart}

								{canProduct}

								{canLogin}

								{canRegis}
							</ul>
						</div>
					</nav>
				</div>

			</header>
		);
	}
}

function mapStateToProps(state) {
	return { state: state }
}

export default connect(mapStateToProps, null, null, {pure: false})(Navigation);