import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

class Admin_product_detail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			product: {},
			hour: 0,
			minute: 0,
			second: 0
		}
		this.handleChange = this.handleChange.bind(this)
	}
	

	componentWillMount() {
		let product_id = this.props.match.params.id
		axios({
			url: 'http://localhost:4000/admin/product/detail/' + product_id,
			method: 'get'
		}).then(val => {
			let timer = parseInt(val.data.timer)
			
			let hour = Math.round(timer/3600)
			let minute = Math.round((timer - (hour * 3600)) / 60)
			let second = Math.round(timer - ((minute * 60) + (hour * 3600)))
			// console.log(hour, minute, second)
			this.setState({
				product: val.data,
				hour: hour,
				minute: minute,
				second: second
			})
		})
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleClickLogout = e => {
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
			<div className="container-fluid">
				<div className="row content" style={{ height: 700 }}>
					{/*Phan container_menubar*/}
					<div className="col-sm-3 sidenav">
						<div className="onleft">
							<div className="list-group">
								<div className="list-group-item active">
									<b>DANH MỤC</b>
								</div>
								<Link to="/admin/products" className="list-group-item">Sản phẩm</Link>
							</div>
							<br />
							<div className="list-group">
								<div className="list-group-item active">
									<b>TÀI KHOẢN</b>
								</div>
								<a href="#" className="list-group-item" 
									onClick={this.handleClickLogout}>Đăng xuất
								</a>
							</div>
						</div>
					</div>
					{/*Ket thuc container_menubar*/}
					<div className="col-sm-9">
						<div className="list-group-item bg-info text-white" style={{ marginBottom: 10 }}>
							<b>
								<span>CẬP NHẬT</span>
							</b>
						</div>
						<div className="row">
							<div className="col-sm-4">
								<img src={"/images/" + this.state.product.image} alt="hinh chi tiet" style={{ width: '80%' }} />
								<button className="btn btn-warning" style={{ marginTop: 10 }}>Đổi ảnh</button>
							</div>
							<div className="col-sm-8">
								<form>
									<div className="form-row">
										<div className="form-group col-sm-9">
											<label htmlFor="txtTenSP">Tên Sản Phẩm:</label>
											<input type="text" 
													className="form-control" 
													placeholder="Tên Sản Phẩm" 
													defaultValue={this.state.product.product_name}/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-sm-9">
											<label htmlFor="txtTenSP">Loại Sản Phẩm:</label>
											<select className="form-control" value={this.state.product.category}>
												<option value="1">Công Nghệ</option>
												<option value="2">Mỹ phẩm</option>
												<option value="3">Thời Trang</option>
											</select>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-2">
											<label>Giờ</label>
											<input type="number" 
													className="form-control" 
													step={1}
													name="hour"
													onChange={this.handleChange}
													value={this.state.hour} min={0} 
													/>
										</div>
										<div className="form-group col-md-2">
											<label htmlFor="inputMinute">Phút</label>
											<input type="number" 
													className="form-control"
													step={1} 
													name="minute"
													onChange={this.handleChange}
													value={this.state.minute} min={0} max={59} />
										</div>
										<div className="form-group col-md-2">
											<label>Giây</label>
											<input type="number" 
													className="form-control" 
													step={1}
													name="second"
													onChange={this.handleChange}
													value={this.state.second} min={0} max={59} />
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-3">
											<label htmlFor="numMucGia">Định mức giá (VNĐ):</label>
											<input type="number" className="form-control"
													min={1} step={1} 
													defaultValue={this.state.product.product_price} />
										</div>
									</div>
									<button type="button" className="btn btn-primary">Cập nhật</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default connect()(Admin_product_detail);