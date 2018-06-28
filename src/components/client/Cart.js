import React, { Component } from 'react';
import axios from 'axios'

class Cart extends Component {

	constructor(props) {
		super(props);
		this.state = {
			invoices: [],
			total: 0
		}
	}



	componentWillMount() {
		// console.log((JSON.parse(localStorage.getItem('user')).id))
		axios({
			url: 'http://localhost:4000/cart',
			method: 'post',
			headers: {
				Authorization: localStorage.getItem('userkey')
			},
			data: {
				user_id: (JSON.parse(localStorage.getItem('user'))).id
			}
		})
			.then(val => {
				let total = 0
				val.data.forEach(x => {
					total += parseInt(x.price) * 1000
				})
				this.setState({
					invoices: val.data,
					total: total
				})
				console.log(this.state)
			})
	}

	handleClickRemoveItem = (e) => {
		console.log(e.target.getAttribute("invoice_id"))
		if (window.confirm("ban co chac chan xoa mon hang nay??")) {
			axios({
				url: 'http://localhost:4000/cart/remove',
				method: 'post',
				headers: {
					Authorization: localStorage.getItem('userkey')
				},
				data: {
					invoice_id: e.target.getAttribute("invoice_id")
				}
			}).then(() => {
				axios({
					url: 'http://localhost:4000/cart',
					method: 'post',
					headers: {
						Authorization: localStorage.getItem('userkey')
					},
					data: {
						user_id: (JSON.parse(localStorage.getItem('user'))).id
					}
				})
					.then(val => {
						let total = 0
						val.data.forEach(x => {
							total += parseInt(x.price) * 1000
						})
						this.setState({
							invoices: val.data,
							total: total
						})
						console.log(this.state)
					})
			})
		} else {
			console.log("cancel")
		}
	}

	handleSubmit = (e) => {
		e.preventDefault()
		let fullname = this.refs.txtFullname.value
		let address = this.refs.txtAddress.value
		let phone = this.refs.txtPhone.value
		let user_id = (JSON.parse(localStorage.getItem('user'))).id

		// alert("Cám ơn bạn đã thanh toán!! chúc bạn đấu giá được sản phẩm ưng ý!")
		// 	window.location.href = "/",true

		axios({
			url: 'http://localhost:4000/cart/paid',
			method: 'post',
			headers: {
				Authorization: localStorage.getItem('userkey')
			},
			data: {
				user_id: user_id,
				fullname: fullname,
				address: address,
				phone: phone
			}
		})
		.then(() => {
			alert("Cám ơn bạn đã thanh toán!! chúc bạn đấu giá được sản phẩm ưng ý!")
			window.location.href = "/",true
		})
	}

	render() {
		return (
			<div>
				<div className="container">
					<div className="row">
						<div className="col-sm-12">
							<div className="list-group-item bg-info text-white" style={{ marginBottom: 10 }}>
								<b>
									<span>THÔNG TIN GIỎ HÀNG CỦA BẠN</span>
								</b>
							</div>
							{/* <div class="row"> */}
							<table className="table table-striped">
								<thead>
									<tr>
										<th>#</th>
										<th className="text-center">Tên món hàng</th>
										<th className="text-center">Giá đấu thầu</th>
										<th className="text-center">Huỷ đơn</th>
									</tr>
								</thead>
								<tbody>
									{   this.state.invoices.length > 0 ?
										this.state.invoices.map((data, idx) => {
											return (<tr key={idx}>
												<td>{idx + 1}</td>
												<td className="text-center" scope="row">{data.product_name}</td>
												<td className="text-center">{(data.price * 1000).toLocaleString('vi-VN')}</td>
												<td className="text-center">
													<button type="button"
														className="btn btn-danger"
														style={{ borderRadius: '50%' }}
														invoice_id={data.invoice_id}
														onClick={this.handleClickRemoveItem}
													>
														<i className="fa fa-trash" aria-hidden="true" invoice_id={data.invoice_id} />
													</button>
												</td>
											</tr>)
										}) :
										<tr><td colSpan="4"><h2>Chưa có sản phẩm trong giỏ hàng!</h2></td></tr>
									}
									{
										this.state.invoices.length > 0 ?
										<tr>
											<td scope="row" colSpan="2">
												<b>
													<h3>TỔNG CỘNG</h3>
												</b>
											</td>
											<td className="text-center">
												<b>
													<h3>{this.state.total.toLocaleString('vi-VN')}</h3>
												</b>
											</td>
											<td></td>
										</tr> :
										null
									}
									
								</tbody>
							</table>
							{/* </div> */}
							{
								this.state.invoices.length > 0 ?
								<div className="row">
									<div className="col-sm-9">
										<h3>vui lòng hoàn tất đơn hàng!!</h3>
									</div>
									<div className="col-sm-3">
										<button className="btn btn-warning btn-lg" data-toggle="modal" data-target="#myModal">
											Hoàn tất đơn hàng
									</button>
									</div>
								</div> : null
							}
							
						</div>
					</div>
				</div>
				<form className="modal fade" id="myModal" onSubmit={this.handleSubmit}>
					<div className="modal-dialog">
						<div className="modal-content">
							{/* Modal Header */}
							<div className="modal-header">
								<h4 className="modal-title">Thông tin nhận hàng</h4>
								<button type="button" className="close" data-dismiss="modal">×</button>
							</div>
							{/* Modal body */}
							<div className="modal-body">
								<div>
									<div className="form-group">
										<label htmlFor="usr">Họ tên:</label>
										<input type="text" 
												className="form-control" 
												required="true"
												ref="txtFullname"/>
									</div>
									<div className="form-group">
										<label htmlFor="pwd">Địa chỉ nhận:</label>
										<input type="text" 
												className="form-control" 
												required="true" 
												ref="txtAddress"/>
									</div>
									<div className="form-group">
										<label htmlFor="pwd">Số điện thoại</label>
										<input type="text" 
												className="form-control" 
												required="true" 
												ref="txtPhone"/>
									</div>
								</div>

							</div>
							{/* Modal footer */}
							<div className="modal-footer">
								<button type="submit" className="btn btn-success">Thanh toán</button>
								<button type="button" className="btn btn-danger" data-dismiss="modal">Close</button>
							</div>
						</div>
					</div>
				</form>

			</div>
		);
	}
}

export default Cart;