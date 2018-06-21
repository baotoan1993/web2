var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

var Sequelize = require('sequelize')
var sequelize = new Sequelize({
	database: 'web2',
	host: 'localhost',
	username: 'postgres',
	password: '123456',
	port: 5432,
	dialect: 'postgres'
})

app.use((req, res, next) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'Content-type');
	res.setHeader('Access-Control-Allow-Headers', 'X-Signature');
	res.setHeader('Access-Control-Allow-Headers', 'X-Key');
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers")
	next()
})

var list_products = []
var interval
app.listen(4000, () => {
	console.log('started port 4000')
	// sequelize.query("select * from products",
	// 	{
	// 		type: sequelize.QueryTypes.SELECT
	// 	})
	// 	.then(val => {
	// 		// console.log(val)
	// 		list_products = val
	// 		interval = setInterval(function () {
	// 			list_products.forEach((x, idx) => {
	// 				if (x.current_timer > 0) {
	// 					list_products[idx].current_timer--
	// 				}
	// 				// else {
	// 				// 	list_products[idx].current_timer = x.timer
	// 				// }
	// 			})
	// 		}, 1000)
	// 	})
})

app.get("/start", (req, res) => {
	sequelize.query("select * from products",
		{
			type: sequelize.QueryTypes.SELECT
		})
		.then(val => {
			list_products = val
			interval = setInterval(function () {
				list_products.forEach((x, idx) => {
					if (x.current_timer > 0) {
						list_products[idx].current_timer--
					}
					else {
						// list_products[idx].current_timer = x.timer
						// console.log("start: cap nhat aution_price (products)")
						sequelize.query(`update products
										 set auction_price = product_price
										 where id = ?`, {
								type: sequelize.QueryTypes.UPDATE,
								replacements: [x.id]
							}).then(() => {
								// console.log("start: row tu bang auctioning")
								sequelize.query("select * from auctioning where product_id = ?", {
									type: sequelize.QueryTypes.SELECT,
									replacements: [x.id]
								})
									.then(au => {
										if (au.length > 0) {
											// console.log("start: them vao bang invoice")
											sequelize.query(`insert into invoice(user_id, product_id, price, status)
													 values(?,?,?,false)`, {
													type: sequelize.QueryTypes.INSERT,
													replacements: [au[0].user_id, au[0].product_id, au[0].price]
												})
												.then(() => {
													// console.log("start: xoa row trong auctioning")
													sequelize.query(`delete from auctioning where product_id = ?`, {
														type: sequelize.QueryTypes.DELETE,
														replacements: [au[0].product_id]
													}).then(() => {
														list_products.splice(idx, 1)
													})
												})
										} else {
											list_products.splice(idx, 1)
										}
									})
							})
					}
				})
			}, 1000)
		})
})

app.post('/login', (req, res) => {
	var username = req.body.username
	var password = req.body.password
	sequelize.query("select * from account where username = ? and password = ?",
		{
			type: sequelize.QueryTypes.SELECT,
			replacements: [username, password]
		})
		.then((val) => {
			if (val.length == 0) {
				res.json({ status: 0 })
			} else {
				res.json({
					status: 1,
					user: val[0]
				})
			}
		})
})

app.get('/products', (req, res) => {
	res.send(list_products)
})

app.get('/products/:category', (req, res) => {
	let list = []
	let category = req.params.category

	list_products.forEach(x => {
		if (x.category == category) {
			list.push(x)
		}
	})
	res.send(list)
})

app.get('/product-item/:id', (req, res) => {
	let id = req.params.id
	let check = false
	list_products.forEach(item => {
		if (item.id == id) {
			res.send(item)
			check = true
			res.end()
		}
	})
	if (check == false) {
		res.send('0')
	}
})

app.post('/auction', (req, res) => {
	let product_id = parseInt(req.body.product_id)
	let user_id = parseInt(req.body.user_id)
	let price = parseInt(req.body.price)

	// console.log(product_id, user_id, price)

	/*
		-kiem tra trong bang auctioning
		--nếu tồn tại dòng có product_id và price > price cũ thì cập nhật lại user_id và price
		---thay đổi auction_price bên bảng products
		--thêm mới product_id và user_id và price
		----cập nhật lại list_product
	*/

	sequelize.query("select * from auctioning where product_id = ?", {
		type: sequelize.QueryTypes.SELECT,
		replacements: [product_id]
	})
		.then(x => {
			if (x.length > 0) { //sản phẩm đã có người đấu giá
				sequelize.query("update auctioning set user_id = ?, price = ? where product_id = ?", {
					type: sequelize.QueryTypes.UPDATE,
					replacements: [user_id, price, product_id]
				}).then(() => {
					// sequelize.query(`update products set auction_price = ? where id = ?`, {
					// 	type: sequelize.QueryTypes.UPDATE,
					// 	replacements: [price, product_id]
					// }).then(() => {
					list_products.forEach((x, idx) => {
						if (x.id == product_id) {
							list_products[idx].auction_price = price
							if (x.current_timer < 20) {
								list_products[idx].current_timer = 20
							}
						}
						// })
					})
				}).then(() => {
					res.end()
				})

			} else {
				sequelize.query("insert into auctioning values(?,?,?)", {
					type: sequelize.QueryTypes.INSERT,
					replacements: [product_id, user_id, price]
				}).then(() => {
					list_products.forEach((x, idx) => {
						if (x.id == product_id) {
							list_products[idx].auction_price = price
							if (x.current_timer < 20) {
								list_products[idx].current_timer = 20
							}
						}
					})
				}).then(() => {
					res.end()
				})

			}
		})
})

app.post('/cart', (req, res) => {
	let user_id = req.body.user_id
	sequelize.query(`select iv.*, p.product_name from invoice iv, products p 
					 where user_id = ? 
					 and status = false
					 and p.id = iv.product_id`, {
			type: sequelize.QueryTypes.SELECT,
			replacements: [user_id]
		})
		.then(val => {
			res.send(val)
		})
})

app.post('/cart/remove', (req, res) => {
	let invoice_id = req.body.invoice_id
	sequelize.query("delete from invoice where invoice_id = ?", {
		type: sequelize.QueryTypes.DELETE,
		replacements: [invoice_id]
	}).then(() => {
		res.end()
	})
})

app.post('/cart/paid', (req, res) => {
	let user_id = req.body.user_id
	let fullname = req.body.fullname
	let address = req.body.address
	let phone = req.body.phone

	sequelize.query("select * from invoice where user_id = ? and status = false", {
		type: sequelize.QueryTypes.SELECT,
		replacements: [user_id]
	}).then(val => {
		val.forEach(x => {
			sequelize.query(`insert into invoice_done (product_id, user_id, address, phone, fullname) 
							values(?,?,?,?,?)`, {
					type: sequelize.QueryTypes.INSERT,
					replacements: [x.product_id, user_id, address, phone, fullname]
				}).then(() => {
					sequelize.query(`update invoice set status = ? where user_id = ? and status = false`, {
						type: sequelize.QueryTypes.UPDATE,
						replacements: [true, user_id]
					})
				})
		})
	})
})