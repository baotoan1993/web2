import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import axios from 'axios'

class Product_Detail extends Component {

	constructor(props) {
		super(props);
		this.state = {
			isOut: null,
			isDone: false
		}
	}


	componentWillMount() {
		let id = this.props.match.params.item
		let x = setInterval(() => {
			axios.get('http://localhost:4000/product-item/' + id + '/' + localStorage.getItem('userkey'), {
				method: 'get'
			})
				.then(val => {
					if(val.data == '0'){
						this.setState({
							isDone: true
						})
						clearInterval(this.state.isOut)
					}
					this.setState({
						...val.data,
					})
				})
		}, 1000)

		this.setState({
			isOut: x
		})

		// axios.get('http://localhost:4000/product-item/' + id, {
		// 		method: 'get'
		// 	})
		// 	.then(val => {
		// 		this.setState({
		// 			...val.data
		// 		})
		// 		console.log(val.data)
		// 	})

	}

	handleInputValue = (e) => {
		this.setState({
			auction_price_detail: e.target.value
		})
	}

	handleLostFocus = (e) => {
		if(e.target.value <= this.state.auction_price || /[a-zA-Z]/.test(e.target.value)){
			e.target.value = parseInt( this.state.auction_price) + 1
		}
	}

	handleAuction = (e) => {
		var user_id = JSON.parse(localStorage.getItem('user')).id
		var pr = this.refs.the_price.value <= this.state.auction_price ? parseInt(this.state.auction_price)  + 1 : this.refs.the_price.value
		var product_id = this.state.id
		console.log(user_id, pr, product_id)
		axios({
			url: 'http://localhost:4000/auction',
			method: 'post',
			data: {
				user_id: user_id,
				product_id: product_id,
				price: pr
			},
			headers: {
				Authorization: localStorage.getItem('userkey')
			}
		})
	}

	handleClickIncrease = () => {
		let val = parseInt(this.refs.the_price.value) + 1
		this.refs.the_price.value = val
	}

	handleClickDecrese = () => {
		let val = parseInt(this.refs.the_price.value) - 1
		if(val > this.state.auction_price){
			this.refs.the_price.value = val
		}
	}

	componentWillUnmount(){
		clearInterval(this.state.isOut)
	}

	render() {
		return (
			<div className="container">
				<div className="row content" style={{ height: 700 }}>
					{/*Phan container_menubar*/}

					{/*Ket thuc container_menubar*/}
					<div className="col-sm-12">
						<div className="list-group-item bg-info text-white" style={{ marginBottom: 10 }}>
							<b>
								<span>SẢN PHẨM: {this.state.product_name}</span>
							</b>
						</div>
						<div className="row">
							<div className="col-sm-4">
								<img src={"/images/" + this.state.image} alt="hinh chi tiet" style={{ width: '80%' }} />
							</div>
							<div className="col-sm-3">
								<span>Thời gian còn</span>
								<br />
								<h2 className="text-danger">{this.state.isDone? "KẾT THÚC" : this.state.current_timer} (giây)</h2>
							</div>
							<div className="col-sm-5">
								<h6>Giá đấu thầu hiện tại</h6>
								<h3>{this.state.auction_price}k</h3>
								<div className="row" style={{ marginBottom: 10 }}>
									<div className="col-lg-offset-3 col-lg-6">
										<div className="input-group">
											<span className="input-group-btn">
												<button className="btn btn-danger" 
														type="button" 
														style={{ borderRadius: 0 }} 
														id="btnGiam"
														onClick={this.handleClickDecrese}>-</button>
											</span>
											<input type="text" className="form-control" style={{ textAlign: 'center' }}
												defaultValue={this.state.auction_price} id="numGiaNhap"
												onKeyUp={this.handleInputValue} 
												onBlur={this.handleLostFocus}
												ref="the_price"/>
											<span className="input-group-btn">
												<button className="btn btn-warning" 
														type="button" 
														style={{ borderRadius: 0 }} 
														id="btnTang"
														onClick={this.handleClickIncrease}>+</button>
											</span>
										</div>
									</div>
								</div>
								<button type="button" className="btn btn-success" onClick={this.handleAuction}>
									<i className="fa fa-gavel" aria-hidden="true" />&nbsp; Đấu Giá Ngay
          						</button>
							</div>
						</div>
						{/* <div className="row">
							<div className="col-sm-12">
								<div className="list-group-item bg-info text-white" style={{ margin: '10px 0 10px 0' }}>
									<b>THÔNG TIN SẢN PHẨM</b>
								</div>
								<div>
									<h3>ÁO BÈO TRỄ VAI</h3>
									<p>chi tiết</p>
									<ul>
										<li>Vải : Voan dày</li>
										<li>Size : freeszie dưới 54kg, vòng ngực dưới 90cm</li>
										<li>Màu : đen, trắng, hồng</li>
									</ul>
								</div>
							</div>
						</div> */}
					</div>
				</div>
			</div>
		);
	}
}

export default Product_Detail;