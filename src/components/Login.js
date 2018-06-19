import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import axios from 'axios'

class Login extends Component {

	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			isLogged: false
		}
	}
	

	handleChange = (event) => {
		let name = event.target.name
		let value = event.target.value
		this.setState({
			[name] : value
		})
	}

	handleSubmit = (event) => {
		event.preventDefault()
		axios.post('http://localhost:4000/login', {
			username: this.state.username,
			password: this.state.password
		})
		.then(res => {
			console.log(res.data)
			localStorage.setItem('user', JSON.stringify(res.data.user))
			this.props.dispatch({type: 'LOGIN', data: res.data.user})
			setTimeout(()=> {
				this.setState({
					isLogged: true
				})
				
			}, 1000)
		})
	}

	render() {
		if(this.state.isLogged){
			return(
				<Redirect to="products" />
			)
		}
		return (
			<div className="container-fluid">
				<form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
					<div className="row">
						<div className="col-md-3" />
						<div className="col-md-6">
							<h2>Đăng Nhập</h2>
							<hr />
						</div>
					</div>
					<div className="row">
						<div className="col-md-3" />
						<div className="col-md-6">
							<div className="form-group has-danger">
								<label className="sr-only" htmlFor="email">E-Mail Address</label>
								<div className="input-group mb-2 mr-sm-2 mb-sm-0">
									<div className="input-group-addon" style={{ width: '2.6rem' }}>
										<i className="fa fa-at" />
									</div>
									<input type="text" name="username" className="form-control" 
										placeholder="your username" required autoFocus 
										onChange={this.handleChange} />
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3" />
						<div className="col-md-6">
							<div className="form-group">
								<label className="sr-only" htmlFor="password">Password</label>
								<div className="input-group mb-2 mr-sm-2 mb-sm-0">
									<div className="input-group-addon" style={{ width: '2.6rem' }}>
										<i className="fa fa-key" />
									</div>
									<input type="password" name="password" className="form-control" 
										  placeholder="Mật Khẩu" required 
										  onChange={this.handleChange} />
								</div>
							</div>
						</div>
						<div className="col-md-3">
							<div className="form-control-feedback">
								<span className="text-danger align-middle">
									{/* Put password error message here */}
								</span>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3" />
					</div>
					<div className="row" style={{ paddingTop: '1rem' }}>
						<div className="col-md-3" />
						<div className="col-md-6 text-center">
							<button type="submit" className="btn btn-success">
								<i className="fa fa-sign-in" /> Đăng nhập</button>
						</div>
					</div>
				</form>
			</div>

		);
	}
}

export default connect()(Login);