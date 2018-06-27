import React, { Component } from 'react';
import { Link } from 'react-router-dom'
import axios from 'axios'

class My_Auction extends Component {

	constructor(props) {
		super(props);
		this.state = {
			auction: []
		}
	}

	componentWillMount() {
		var user_id = (JSON.parse(localStorage.getItem('user'))).id
		axios({
			url: 'http://localhost:4000/myaution',
			method: 'post',
			headers: {
				Authorization: localStorage.getItem('userkey')
			},
			data: {
				user_id: user_id
			}
		}).then(res => {
			this.setState({
				auction: res.data
			})
		})
	}

	render() {
		return (
			<div className="container">
				<div className="row content" style={{ height: 700 }}>
					{/* Tab panes */}
					<div className="col-sm-12">
						<ul className="nav nav-tabs" role="tablist">
							<li className="nav-item">
								<a className="nav-link active" data-toggle="tab" href="#tab-daugiahientai">Đấu giá hiện tại</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" data-toggle="tab" href="#tab-daugiathang">Đấu giá đang thắng</a>
							</li>
							<li className="nav-item">
								<a className="nav-link" data-toggle="tab" href="#tab-daugiathua">đấu giá đang thất bại</a>
							</li>
						</ul>
						<div className="tab-content">
							{/* tab đấu giá hiện tại */}
							<div id="tab-daugiahientai" className="container tab-pane active">
								<br />
								<table className="table table-striped">
									<thead className="thead-dark">
										<tr>
											<th>Trạng thái</th>
											<th>Sản phẩm</th>
											<th>Giá thầu của bạn</th>
											{/* <th>Giá thầu hiện tại</th> */}
										</tr>
									</thead>
									<tbody>
										{
											this.state.auction.map((data, idx) => {
												return (
													<tr key={idx}>
														<td>
															{
																data.win ?
																	<span className="badge badge-success">Thắng</span>
																	:
																	<span className="badge badge-danger">Thua</span>
															}
														</td>
														<td>
															<Link to={"/product-item/" + data.product_id}>{data.product_name}
															</Link>
														</td>
														<td>{data.auction_price}K</td>
														{/* <td>9K</td> */}
													</tr>
												)
											})
										}


									</tbody>
								</table>
							</div> {/* end tab đấu giá hiện tại */}
							{/* tab đấu giá thắng */}
							<div id="tab-daugiathang" className="container tab-pane fade">
								<br />
								{/* table-{1:striped|sm|bordered|hover|inverse} */}
								<table className="table table-striped">
									<thead className="thead-dark">
										<tr>
											<th>Trạng thái</th>
											<th>Sản phẩm</th>
											<th>Giá thầu của bạn</th>
											{/* <th>Giá thầu hiện tại</th> */}
										</tr>
									</thead>
									<tbody>
										{
											this.state.auction.map((data, idx) => {
												if (data.win) {
													return (
														<tr key={idx}>
															<td>
																{
																	data.win ?
																		<span className="badge badge-success">Thắng</span>
																		:
																		<span className="badge badge-danger">Thua</span>
																}
															</td>
															<td>
																<Link to={"/product-item/" + data.product_id}>{data.product_name}
																</Link>
															</td>
															<td>{data.auction_price}K</td>
															{/* <td>9K</td> */}
														</tr>
													)
												}
											})
										}


									</tbody>
								</table>
							</div> {/* end tab đấu giá thắng */}
							{/* tab đấu giá thua */}
							<div id="tab-daugiathua" className="container tab-pane fade">
								<br />
								<table className="table table-striped">
									<thead className="thead-dark">
										<tr>
											<th>Trạng thái</th>
											<th>Sản phẩm</th>
											<th>Giá thầu của bạn</th>
											{/* <th>Giá thầu hiện tại</th> */}
										</tr>
									</thead>
									<tbody>
										{
											this.state.auction.map((data, idx) => {
												if (!data.win) {
													return (
														<tr key={idx}>
															<td>
																{
																	data.win ?
																		<span className="badge badge-success">Thắng</span>
																		:
																		<span className="badge badge-danger">Thua</span>
																}
															</td>
															<td>
																<Link to={"/product-item/" + data.product_id}>{data.product_name}
																</Link>
															</td>
															<td>{data.auction_price}K</td>
															{/* <td>9K</td> */}
														</tr>
													)
												}
											})
										}


									</tbody>
								</table>
							</div> {/* end tab đấu giá thua */}
						</div> {/* end tab panes*/}
					</div>
				</div>
			</div>

		);
	}
}

export default My_Auction;