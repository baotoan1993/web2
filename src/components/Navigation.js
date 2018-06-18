import React, { Component } from 'react';
import {NavLink} from 'react-router-dom'

class Navigation extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isLogged: false
		}
	}
	

	render() {
		var menu = this.state.isLogged ? (
		<ul className="nav justify-content-center">
			<li className="nav-item">
				<NavLink className="nav-link" to="#">Công nghệ</NavLink>
			</li>
			<li className="nav-item">
				<NavLink className="nav-link" to="#">Mỹ phẩm</NavLink>
			</li>
			<li className="nav-item">
				<NavLink className="nav-link" to="#">Thời trang</NavLink>
			</li>
			<li className="nav-item">
				<NavLink className="nav-link" to="#">Nổi bật</NavLink>
			</li>
		</ul>) : ''
		return (
			<header>
				<div className="container-fluid" id="header">
					<nav className="navbar navbar-expand-md navbar-light" style={{ background: '#F0F8FF' }}>
						{/* Brand */}
						<NavLink className="navbar-brand" exact to="/" style={{ textAlign: 'center' }}>
							<img src="images/Logo.png" alt="logo.png" style={{ width: '50%' }} />
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
								<li className="nav-item">
									<NavLink className="nav-link" to="/login">
										<i className="fa fa-user-circle" aria-hidden="true" />&nbsp;Đăng Nhập
									</NavLink>
								</li>
								<li className="nav-item">
									<NavLink className="nav-link" to="/register">
										<i className="fa fa-user-plus" aria-hidden="true" />&nbsp;Đăng Ký
									</NavLink>
								</li>
							</ul>
						</div>
					</nav>
				</div>
				
				{menu}

			</header>
		);
	}
}

export default Navigation;