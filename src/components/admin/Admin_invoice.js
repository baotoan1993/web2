import React, { Component } from 'react';
import axios from 'axios'

class Admin_invoice extends Component {

	constructor(props) {
		super(props);
		this.state = {
			invoice: []
		}
	}

	componentWillMount() {
		axios({
			url: 'http://localhost:4000/admin/invoice',
			method: 'get',
			headers: {
				Authorization: localStorage.getItem('userkey')
			}
		}).then((val) => {
			console.log(val.data)
			this.setState({
				invoice: val.data
			})
		})
	}

	handleDeliverd = e => {
		if (window.confirm("Bạn đã giao món hàng này?")) {
			let invoice_done_id = e.target.getAttribute("invoice_done_id")
			axios({
				url: 'http://localhost:4000/admin/invoice/deliver',
				method: 'post',
				data: {
					invoice_done_id: invoice_done_id
				},
				headers: {
					Authorization: localStorage.getItem('userkey')
				}
			}).then(() => {
				axios({
					url: 'http://localhost:4000/admin/invoice',
					method: 'get',
					headers: {
						Authorization: localStorage.getItem('userkey')
					}
				}).then((val) => {
					console.log(val.data)
					this.setState({
						invoice: val.data
					})
				})
			})
		}

	}

	render() {
		return (
			<div className="container">
				<div className="list-group-item bg-info text-white" style={{ marginBottom: 10 }}>
					<b>QUẢN LÝ HOÁ ĐƠN</b>
				</div>
				<div className="card">
					<div className="card-block">
						<table className="table table-striped">
							<thead className="thead-dark">
								<tr>
									<th>#</th>
									<th>Tên khách hàng</th>
									<th>Địa chỉ</th>
									<th>Điện thoại</th>
									<th>Sản phẩm</th>
									<th>Tình trạng</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.invoice.map((data, idx) => {
										return (
											<tr key={idx}>
												<td>{idx + 1}</td>
												<td>{data.fullname}</td>
												<td>{data.address}</td>
												<td>{data.phone}</td>
												<td>{data.product_name}</td>
												<td>
													{
														data.status ?
															<span className="badge badge-success">Đã giao hàng</span> :
															<span className="badge badge-danger"
																onClick={this.handleDeliverd}
																invoice_done_id={data.invoice_done_id}>Chưa giao hàng</span>
													}
												</td>
											</tr>
										)
									})
								}

							</tbody>
						</table>
					</div>
				</div>
			</div>

		);
	}
}

export default Admin_invoice;