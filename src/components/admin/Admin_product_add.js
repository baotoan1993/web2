import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

class Admin_product_add extends Component {

	constructor(props) {
		super(props);
		this.state = {
			images: [],
		}
	}

	onDrop = (pic) => {
		this.setState({
			images: pic.target.files[0]
		})
		var reader = new FileReader()

		reader.onload = (e) => {
			(this.refs.imgPrev).setAttribute('src', e.target.result)
		}
		reader.readAsDataURL(pic.target.files[0])


	}

	handleClickAdd = () => {
		var form_data = new FormData()
		form_data.append("file", this.state.images)

		let product_name = this.refs.txtProductName.value
		let category = this.refs.slCategory.value
		let hour = parseInt(this.refs.txtHour.value)
		let minute = parseInt(this.refs.txtMinute.value)
		let second = parseInt(this.refs.txtSecond.value)
		let price = this.refs.txtPrice.value
		let timer = hour * 3600 + minute * 60 + second
		let image = ''

		console.log(timer)

		switch (category) {
			case '1':
				image = 'congnghe/' + this.state.images.name
				break
			case '2':
				image = 'mypham/' + this.state.images.name
				break
			case '3':
				image = 'thoitrang/' + this.state.images.name
				break
		}

		axios.post('http://localhost:4000/admin/products/add/picture', form_data)
			.then((res) => {
				if (res.data == '1') {
					axios({
						url: 'http://localhost:4000/admin/products/add',
						method: 'post',
						data: {
							product_name: product_name,
							product_price: price,
							category: category,
							timer: timer,
							image: image,
							image_name: this.state.images.name
						}
					}).then(val => {
						if (val.data == '1') {
							alert('them thanh cong')
							window.location.reload()
						} else {
							alert('them that bai')
						}
					})
				}
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
								<span>THÊM SẢN PHẨM MỚI</span>
							</b>
						</div>
						<div className="row">
							<div className="col-sm-4">
								<img src='' alt="hinh chi tiet" style={{ width: '80%' }} ref="imgPrev" />
								<input type="file" className="btn btn-warning"
									style={{ marginTop: 10 }}
									onChange={this.onDrop} />
								{/* <ImageUploader 
									withIcon={true}
									withLabel={false}
									buttonText="chon hinh"
									onChange={this.onDrop}
									imgExtension={['.jpg', '.png']}
									withPreview={false}
								/> */}
							</div>
							<div className="col-sm-8">
								<form>
									<div className="form-row">
										<div className="form-group col-sm-9">
											<label htmlFor="txtTenSP">Tên Sản Phẩm:</label>
											<input type="text"
												className="form-control"
												placeholder="Tên Sản Phẩm"
												ref="txtProductName" />
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-sm-9">
											<label htmlFor="txtTenSP">Loại Sản Phẩm:</label>
											<select className="form-control" ref="slCategory">
												<option value="1">Công Nghệ</option>
												<option value="2">Mỹ Phẩm</option>
												<option value="3">Thời Trang</option>
											</select>
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-2">
											<label htmlFor="inputHour">Giờ</label>
											<input type="number" className="form-control"
												defaultValue={0} min={0} max={48}
												ref="txtHour" />
										</div>
										<div className="form-group col-md-2">
											<label htmlFor="inputMinute">Phút</label>
											<input type="number" className="form-control"
												defaultValue={0} min={0} max={59}
												ref="txtMinute" />
										</div>
										<div className="form-group col-md-2">
											<label htmlFor="inputSecond">Giây</label>
											<input type="number" className="form-control"
												defaultValue={15} min={0} max={59}
												ref="txtSecond" />
										</div>
									</div>
									<div className="form-row">
										<div className="form-group col-md-3">
											<label htmlFor="numMucGia">Giá ban đầu: </label>
											<input type="number" className="form-control"
												min={1} step={3} defaultValue={1}
												ref="txtPrice" />
										</div>
									</div>
									<button type="button"
										className="btn btn-primary"
										onClick={this.handleClickAdd}
									>
										Thêm mới
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}

export default connect()(Admin_product_add);