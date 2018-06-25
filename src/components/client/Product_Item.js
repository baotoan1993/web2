import React, { Component } from 'react';
import { Link } from 'react-router-dom'

class Product_Item extends Component {

	// handleSelectedItem = (e) => {
	// 	e.preventDefault()
	// 	console.log(this.props.itemId)
	// }

	render() {
		return (
			<div className="col-sm-2">
				<Link to={"/product-item/" + this.props.itemId} className="thumb">
					<div className="article">
						<img className="img-fluid" alt={this.props.image} src={"images/" + this.props.image} />
					</div>
					<div className="row">
						<div className="col-6 text-center">
							<p style={{ fontWeight: 'bold', color: 'red' }}>{new Date(this.props.currentTimer * 1000).toISOString().substr(11, 8)}</p>
						</div>
						<div className="col-6 text-center">
							<p>{this.props.currentPrice}K</p>
						</div>
					</div>
				</Link>
			</div>
		);
	}
}

export default Product_Item;