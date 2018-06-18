import React, { Component } from 'react';

class Product_Item extends Component {
	render() {
		return (
			<div className="col-sm-2">
				<a href="/" className="thumb">
					<div className="article">
						<img className="img-fluid" src={"images/" + this.props.image} />
					</div>
					<div className="row">
						<div className="col-6 text-center">
							<p style={{ fontWeight: 'bold', color: 'red' }}>{new Date(this.props.currentTimer * 1000).toISOString().substr(11, 8)}</p>
						</div>
						<div className="col-6 text-center">
							<p>{this.props.currentPrice}K</p>
						</div>
					</div>
				</a>
			</div>
		);
	}
}

export default Product_Item;