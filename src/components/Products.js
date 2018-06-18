import React, { Component } from 'react';
import { connect } from 'react-redux'
import { NavLink } from 'react-router-dom'


import Product_Item from './Product_Item';
import axios from 'axios'

class Products extends Component {
	constructor(props) {
		super(props);
		this.state = {
			products: [],
			isOut: null
		}
	}

	componentWillMount() {
		var x = setInterval(() => {
			axios.get('http://localhost:4000/products', {
				method: 'get'
			})
				.then(val => {
					this.setState({
						products: val.data
					})
				})
		}, 1000)
		this.setState({ isOut: x })

	}

	componentWillUnmount() {
		clearInterval(this.state.isOut)
	}


	handleChangeTech = (e) => {
		e.preventDefault()
		clearInterval(this.state.isOut)
		var x = setInterval(() => {
			axios.get('http://localhost:4000/products/1', {
				method: 'get'
			})
				.then(val => {
					this.setState({
						products: val.data
					})
				})
		}, 1000)
		this.setState({ isOut: x })
	}

	handleChangePer = (e) => {
		e.preventDefault()
		clearInterval(this.state.isOut)
		var x = setInterval(() => {
			axios.get('http://localhost:4000/products/2', {
				method: 'get'
			})
				.then(val => {
					this.setState({
						products: val.data
					})
				})
		}, 1000)
		this.setState({ isOut: x })
	}
	
	handleChangeFash = (e) => {
		e.preventDefault()
		clearInterval(this.state.isOut)
		var x = setInterval(() => {
			axios.get('http://localhost:4000/products/3', {
				method: 'get'
			})
				.then(val => {
					this.setState({
						products: val.data
					})
				})
		}, 1000)
		this.setState({ isOut: x })
	}

	render() {
		return (
			<div>
				<ul className="nav justify-content-center">
					<li className="nav-item">
						<NavLink className="nav-link" to="#" onClick={this.handleChangeTech}>Công nghệ</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="#" onClick={this.handleChangePer}>Mỹ phẩm</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="#" onClick={this.handleChangeFash}>Thời trang</NavLink>
					</li>
					<li className="nav-item">
						<NavLink className="nav-link" to="#">Nổi bật</NavLink>
					</li>
				</ul>
				<div className="container-fluid">
					<div className="row content">
						{/*Phan container_menubar*/}
						{/*Ket thuc container_menubar*/}
						<div className="col-sm-12">
							<div className="list-group-item bg-info text-white" style={{ marginBottom: 10 }}>
								<b>SẢN PHẨM</b>
							</div>
							<div className="row ds-sanpham">
								{
									this.state.products.map((item, idx) => {
										return <Product_Item
											key={idx}
											currentTimer={item.current_timer}
											currentPrice={item.product_price}
											image={item.image} />
									})
								}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Products;