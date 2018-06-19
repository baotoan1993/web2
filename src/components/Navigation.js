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
		this.props.dispatch({type: 'LOGOUT'})
		setTimeout(() => {
			window.location.href = '/'
		}, 300)
	}

	render() {
		var canProduct = this.props.state == null ?
			''
		:
		<li className="nav-item">
			<NavLink className="nav-link" to="/products" activeClassName="active">
				<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;Sản Phẩm
			</NavLink>
		</li>

		var canLogin = this.props.state == null ?
			<li className="nav-item">
				<NavLink className="nav-link" to="/login" activeClassName="active">
					<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;Đăng Nhập
				</NavLink>
			</li>
			:
			<li className="nav-item">
				<NavLink className="nav-link" to="/logout" onClick={this.handleLogout} activeClassName="active">
					<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;{this.props.state.fullname}(Đăng xuât)
				</NavLink>
			</li>

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

								{ canProduct }

								{ canLogin }
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

export default connect(mapStateToProps)(Navigation);