import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
var fs = require('fs')

class Admin_product_detail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			product: {},
			hour: 0,
			minute: 0,
			second: 0,
			category: 0
		}
		this.handleChange = this.handleChange.bind(this)
	}
	

	componentWillMount() {
		let product_id = this.props.match.params.id
		axios({
			url: 'http://localhost:4000/admin/product/detail/' + product_id,
			method: 'get'
		}).then(val => {
			let timer = parseInt(val.data.timer, 10)
			
			let hour = Math.floor(timer/3600)
			let minute = Math.floor((timer - (hour * 3600)) / 60)
			let second = timer - ((minute * 60) + (hour * 3600))
			// console.log(hour, minute, second)
			this.setState({
				product: val.data,
				hour: hour,
				minute: minute,
				second: second,
				category: val.data.category
			})
		})
	}

	handleChange = (e) => {
		this.setState({
			[e.target.name]: e.target.value
		})
	}

	handleSubmit = e =>{
		e.preventDefault()
		let product_name = this.refs.txtProductName.value
		let category = this.state.category
		let product_price = this.refs.txtProductPrice.value
		let timer = this.state.hour * 3600 + this.state.minute * 60 + this.state.second
		axios({
			url: 'http://localhost:4000/admin/products/change',
			method: 'post',
			data: {
				product_id: this.state.product.id,
				product_name: product_name,
				category: category,
				product_price: product_price,
				timer: timer
			},
			headers: {
				Authorization: localStorage.getItem('userkey')
			}
		})

		setTimeout(() => {
			window.location.href = "/admin/products"
		}, 150)

	}

	// handleChangeImage = (pic) => {
	// 	this.setState({
	// 		image: pic.target.files[0]
	// 	})
	// 	var reader = new FileReader()

	// 	reader.onload = (e) => {
	// 		(this.refs.imgShow).setAttribute('src', e.target.result)
	// 	}
	// 	reader.readAsDataURL(pic.target.files[0])
	// }

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
								<img src={"/images/" + this.state.product.image} 
									alt="hinh chi tiet" style={{ width: '80%' }} 
									ref="imgShow"/>
								{/* <input type="file" style={{marginTop: 10}} 
										onChange={this.handleChangeImage}
										accept="image/x-png,image/jpg,image/jpeg,image/gif"/> */}
							</div>
							<div className="col-sm-8">
								<form onSubmit={this.handleSubmit}>
									<div className="form-row">
										<div className="form-group col-sm-9">
											<label htmlFor="txtTenSP">Tên Sản Phẩm:</label>
											<input type="text" 
													className="form-control" 
													placeholder="Tên Sản Phẩm" 
													defaultValue={this.state.product.product_name}
													ref="txtProductName"
													required/>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-sm-9">
											<label htmlFor="txtTenSP">Loại Sản Phẩm:</label>
											<select className="form-control" 
												name="category"
												value={this.state.category}
												onChange={this.handleChange}>
												<option value={1} >Công Nghệ</option>
												<option value={2}>Mỹ phẩm</option>
												<option value={3}>Thời Trang</option>
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
													ref="txtProductPrice"
													defaultValue={this.state.product.product_price} />
										</div>
									</div>
									<button type="submit" className="btn btn-primary">Cập nhật</button>
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