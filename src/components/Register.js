import React, { Component } from 'react';
import axios from 'axios'

class Register extends Component {

	handleSubmit = (e) => {
		e.preventDefault()
		let username = this.refs.txtUsername.value
		let password = this.refs.txtPassword.value
		let confirmpass = this.refs.txtConfirmPassword.value
		let fullname = this.refs.txtFullname.value
		if(password != confirmpass){
			alert("Mật khẩu xác nhận không chính xác!")
		}else{
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

	render() {
		return (
			<div className="container-fluid">
				<form className="form-horizontal" role="form" onSubmit={this.handleSubmit}>
					<div className="row">
						<div className="col-md-3" />
						<div className="col-md-6">
							<h2>Đăng Ký Tài Khoản</h2>
							<hr />
						</div>
					</div>
					<div className="row">
						<div className="col-md-3" />
						<div className="col-md-6">
							<div className="form-group has-danger">
								<label className="sr-only" htmlFor="email">Your name</label>
								<div className="input-group mb-2 mr-sm-2 mb-sm-0">
									<div className="input-group-addon" style={{ width: '2.6rem' }}>
										<i className="fa fa-user" />
									</div>
									<input type="text"
										name="username"
										className="form-control"
										placeholder="Tên của bạn"
										ref="txtFullname"
										required autoFocus />
								</div>
							</div>
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
									<input type="text" name="email"
										className="form-control"
										placeholder="tên đăng nhập"
										ref="txtUsername"
										required autoFocus />
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
									<input type="password"
										name="password"
										className="form-control"
										ref="txtPassword"
										placeholder="Mật khẩu" required />
								</div>
							</div>
						</div>
					</div>
					<div className="row">
						<div className="col-md-3" />
						<div className="col-md-6">
							<div className="form-group">
								<label className="sr-only" htmlFor="password">Confirm</label>
								<div className="input-group mb-2 mr-sm-2 mb-sm-0">
									<div className="input-group-addon" style={{ width: '2.6rem' }}>
										<i className="fa fa-key" />
									</div>
									<input type="password"
										name="password"
										className="form-control"
										ref="txtConfirmPassword"
										placeholder="Nhập lại Mật khẩu" required />
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
								<i className="fa fa-check" /> Đăng Ký</button>
						</div>
					</div>
				</form>
			</div>

		);
	}
}

export default Register;