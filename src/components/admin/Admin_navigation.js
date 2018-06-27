import React, { Component } from 'react';
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

class Admin_navigation extends Component {

	handleLogout = (e) => {
		e.preventDefault()
		this.props.dispatch({ type: 'LOGOUT' })
		axios({
			url: 'http://localhost:4000/logout',
			method: 'post',
			data: {
				userkey: localStorage.getItem('userkey')
			}
		})
		alert('Đăng xuất thành công!')

		localStorage.removeItem('user')
		localStorage.removeItem('userkey')
		setTimeout(() => {

			window.location.href = '/'
		}, 300)
	}

	render() {
		return (
			<header>
				<nav className="navbar navbar-expand-md navbar-light" style={{ background: '#F0F8FF' }}>
					{/* Brand */}
					<a className="navbar-brand" href="#" style={{ textAlign: 'center' }}>
						<img src="/images/Logo.png" alt="logo.png" style={{ width: '50%' }} />
					</a>
					{/* Toggler/collapsibe Button */}
					<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsibleNavbar">
						<span className="navbar-toggler-icon" />
					</button>
					{/* Navbar links */}
					<div className="collapse navbar-collapse justify-content-end" id="collapsibleNavbar">
						<ul className="navbar-nav">
							<li className="nav-item">
								<NavLink className="nav-link" to="/admin/products">
									<i className="fa fa-product-hunt" aria-hidden="true" />&nbsp;Sản Phẩm
          						</NavLink>
							</li>
							<li className="nav-item">
								<NavLink className="nav-link" to="/admin/invoice">
									<i className="fa fa-table" aria-hidden="true" />&nbsp;Hoá Đơn
          						</NavLink>
							</li>
							<li className="nav-item">
								<a className="nav-link" href="/" onClick={this.handleLogout}>
									<i className="fa fa-sign-out" aria-hidden="true" />&nbsp;Đăng xuất
         						 </a>
							</li>
						</ul>
					</div>
				</nav>
			</header>

		);
	}
}

export default connect(null, null, null, {pure: false})(Admin_navigation);