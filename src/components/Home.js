import React, { Component } from 'react';

class Home extends Component {
	render() {
		return (
			<div className="container-fluid">
				<div style={{ textAlign: 'center' }}>
					{/* <h1 style="color: red">CHÀO MỪNG BẠN</h1>  */}
					<div>
						<img src="images/daugiangay.svg" width="40%" />
					</div>
					<img src="images/big_logo.jpg" alt="daugiangay.svg" style={{ width: '30%' }} />
					<h3 className="display-4">Ra giá và có ngay sản phẩm mà bạn ưng ý!!!</h3>
				</div>
			</div>
		);
	}
}

export default Home;