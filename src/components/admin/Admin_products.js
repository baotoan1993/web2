import React, { Component } from 'react';
import axios from 'axios'

class Admin_products extends Component {

	constructor(props) {
		super(props);
		this.state = {
			products: []
		}
	}

	componentWillMount() {
		axios({
			url: 'http://localhost:4000/admin/products',
			method: 'get'
		})
			.then(res => {
				this.setState({
					products: res.data
				})
			})


	}

	handleClickBegin = (e) => {
		let product_id = e.target.getAttribute('product_id')
		axios({
			url: 'http://localhost:4000/admin/products/start/' + product_id,
			method: 'get'
		}).then(() => {
			axios({
				url: 'http://localhost:4000/admin/products',
				method: 'get'
			})
				.then(res => {
					this.setState({
						products: res.data
					})
				})
		})
	}


	render() {
		return (
			<div className="container-fluid">
				<div className="row content">
					{/*Phan container_menubar*/}
					<div className="col-sm-3 sidenav">
						<div className="onleft">
							<div className="list-group">
								<div className="list-group-item active">
									<b>DANH MỤC</b>
								</div>
								<a href="#" className="list-group-item">Công Nghệ</a>
								<a href="#" className="list-group-item">Thời Trang</a>
								<a href="#" className="list-group-item">Làm Đẹp</a>
							</div>
						</div>
					</div>
					{/*Ket thuc container_menubar*/}
					<div className="col-sm-9">
						<div className="list-group-item bg-info text-white" style={{ marginBottom: 10 }}>
							<b>SẢN PHẨM</b>
						</div>
						<table className="table table-striped">
							<thead>
								<tr>
									<th style={{ textAlign: 'center' }}>Mã SP</th>
									<th>Tên Sản Phẩm</th>
									<th>Thời Gian</th>
									<th>Hình</th>
									<th>
										<i className="fa fa-cog" aria-hidden="true" />
										<button type="button" className="btn btn-success">Thêm</button>
									</th>
									<th className="text-center">Trạng Thái</th>
								</tr>
							</thead>
							<tbody>
								{
									this.state.products.map((data, idx) => {
										return (
											<tr key={idx}>
												<td scope="row">{data.id}</td>
												<td>{data.product_name}</td>
												<td>{new Date(data.timer * 1000).toISOString().substr(11, 8)}</td>
												<td>
													<img src={"/images/" + data.image} alt={data.image} width="50px;" />
												</td>
												<td>
													<button type="button" className="btn btn-info" style={{ borderRadius: '20%' }}>
														<i className="fa fa-pencil-square-o fa-3" aria-hidden="true" style={{ textAlign: 'center' }} />
													</button>
													<button type="button" className="btn btn-danger" style={{ borderRadius: '20%' }}>
														<i className="fa fa-trash fa-3" aria-hidden="true" style={{ textAlign: 'center' }} />
													</button>
												</td>
												<td className="text-center">
													{
														data.status ? <span className="badge badge-secondary">Đang chạy</span>
															: <button product_id={data.id}
																onClick={this.handleClickBegin}
																className="btn btn-warning">Bắt đầu</button>
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

export default Admin_products;