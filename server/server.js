var express = require('express')
var bodyParser = require('body-parser')
var multer = require('multer')
var mv = require('mv')


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
	// res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
	// res.setHeader('Access-Control-Allow-Headers', 'Authorization');
	// res.setHeader('Access-Control-Allow-Headers', 'X-Signature');
	// res.setHeader('Access-Control-Allow-Headers', 'X-Key');
	res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, Authorization")
	next()
})

var storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, 'public/images')
	},
	filename: function (req, file, cb) {
		cb(null, file.originalname)
	}
})

var upload = multer({ storage: storage })

var list_products = []
var keyAuth = []
var interval
app.listen(4000, () => {
	console.log('started port 4000')
	console.log("key Auth: ", keyAuth)
})

app.get("/start", (req, res) => {
	let userkey = req.headers.authorization
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	sequelize.query("select * from products where status = true",
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
												}).then(() => {
													sequelize.query(`update products set status = ? where id =?`, {
														type: sequelize.QueryTypes.UPDATE,
														replacements: [false, x.id]
													})
												})
										} else {
											sequelize.query(`update products set status = ? where id =?`, {
												type: sequelize.QueryTypes.UPDATE,
												replacements: [false, x.id]
											})
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

	if(keyAuth.find(x => x.username == username)){
		res.send({status: 0, message: "Tài khoản này đang đăng nhập"})
		res.end()
		return
	}

	sequelize.query("select * from account where username = ? and password = ?",
		{
			type: sequelize.QueryTypes.SELECT,
			replacements: [username, password]
		})
		.then((val) => {
			if (val.length == 0) {
				res.json({ status: 0, message: 'Tên đăng nhập hoặc mật khẩu không đúng!' })
			} else {
				var str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
				keyAuth.push({username: val[0].username, userkey: str})
				res.json({
					status: 1,
					user: {
						id: val[0].id,
						fullname: val[0].fullname,
						role: val[0].role

					},
					userkey: str
				})
			}
		})
})

app.post('/logout', (req, res) => {
	let key = req.body.userkey
	keyAuth.forEach((x, idx) => {
		if(x.userkey == key){
			keyAuth.splice(idx, 1)
			return
		}
	})
	console.log(keyAuth)
})

// app.get('/random', (req, res) => {
// 	var str = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
// 	res.send(str)
// })

app.post('/register', (req, res) => {
	let username = req.body.username
	let password = req.body.password
	let fullname = req.body.fullname

	sequelize.query("select * from account where username = ?", {
		type: sequelize.QueryTypes.SELECT,
		replacements: [username]
	}).then(val => {
		if (val.length > 0) {
			res.send("0")
			res.end()
		} else {
			sequelize.query("insert into account(username, password, fullname, role) values(?,?,?,?)", {
				type: sequelize.QueryTypes.INSERT,
				replacements: [username, password, fullname, false]
			}).then(() => {
				res.send("1")
				res.end()
			})
		}
	})
})

app.get('/products/:userkey', (req, res) => {
	let userkey = req.params.userkey
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	res.send(list_products)
})

app.post('/products/category', (req, res) => {
	let list = []
	let category = req.body.category
	if(category == 0){
		res.send(list_products)
		res.end()
		return
	}
	list_products.forEach(x => {
		if (x.category == category) {
			list.push(x)
		}
	})
	res.send(list)
	res.end()
})

app.get('/product-item/:id/:userkey', (req, res) => {
	let userkey = req.params.userkey
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
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
					 and iv.status = false
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
			sequelize.query(`insert into invoice_done (product_id, user_id, address, phone, fullname, status) 
							values(?,?,?,?,?,false)`, {
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


app.get('/admin/products', (req, res) => {
	let userkey = req.headers.authorization
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	sequelize.query("select * from products", {
		type: sequelize.QueryTypes.SELECT
	}).then((val) => {
		res.send(val)
	})
})

app.post('/admin/products/stop', (req, res) => {
	sequelize.query("select * from products where status = false", {
		type: sequelize.QueryTypes.SELECT
	}).then((val) => {
		res.send(val)
	})
})

app.get('/admin/products/start/:product_id', (req, res) => {
	let product_id = req.params.product_id
	sequelize.query("update products set status = ? where id = ?", {
		type: sequelize.QueryTypes.UPDATE,
		replacements: [true, product_id]
	}).then(() => {
		sequelize.query("select * from products where id = ?", {
			type: sequelize.QueryTypes.SELECT,
			replacements: [product_id]
		}).then(val => {
			list_products.push(val[0])
			res.end()
		})
	})
})

app.post('/admin/products/add/picture', upload.single('file'), (req, res) => {
	console.log(req.file)
	res.send('1')
	res.end()
})

app.post('/admin/products/add', (req, res) => {
	let userkey = req.headers.authorization
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	let product_name = req.body.product_name
	let product_price = parseInt(req.body.product_price)
	let category = parseInt(req.body.category)
	let timer = parseInt(req.body.timer)
	let image = req.body.image
	let image_name = req.body.image_name
	let dest = `public/images/` + image
	mv(`public/images/${image_name}`, dest, function(err) {
		if(err){
			console.log(err)
		}
	})

	sequelize.query(`insert into products(product_name,product_price,timer,current_timer,image,category,auction_price, status) values(?,?,?,?,?,?,?,?)`, {
		type: sequelize.QueryTypes.INSERT,
		replacements: [product_name, product_price, timer, timer, image, category, product_price, false]
	}).then(() => {
		res.send('1')
		res.end()
	}).catch(() => {
		res.send('0')
		res.end()
	})
})

app.post('/admin/products/remove', (req, res) => {
	let product_id = req.body.product_id
	sequelize.query("delete from products where id = ?", {
		type: sequelize.QueryTypes.DELETE,
		replacements: [product_id]
	}).then(() => {

		list_products.forEach((x, idx) => {
			if(x.id == product_id){
				list_products.splice(idx, 1)
			}
		})

		res.send('1')
		res.end()
	}).catch(() => {
		res.send('0')
		res.end()
	})
})

app.get('/admin/product/detail/:product_id', (req, res) => {
	let product_id = req.params.product_id
	sequelize.query("select * from products where id = ?", {
		type: sequelize.QueryTypes.SELECT,
		replacements: [product_id]
	}).then(val => {
		res.send(val[0])
		res.end()
	})
})

app.get('/admin/invoice', (req, res) => {
	let userkey = req.headers.authorization
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	sequelize.query(`select i.*, p.product_name from invoice_done i, products p
					where i.product_id = p.id`, {
		type: sequelize.QueryTypes.SELECT
	}).then(val => {
		res.send(val)
		res.end()
	})
})

app.post('/admin/invoice/deliver', (req, res) => {
	let userkey = req.headers.authorization
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	let invoice_done_id = req.body.invoice_done_id
	console.log(invoice_done_id)
	sequelize.query("update invoice_done set status = true where invoice_done_id = ?", {
		type: sequelize.QueryTypes.UPDATE,
		replacements: [invoice_done_id]
	}).then(() => {
		res.send("ok")
		res.end()
	})
})

app.post('/admin/products/change', (req, res) => {
	let userkey = req.headers.authorization
	if(!keyAuth.find(x => x.userkey == userkey)){
		res.send("Khong the truy cap")
		res.end()
		return
	}
	let { product_id, product_name, category, product_price, timer } = req.body
	sequelize.query(`update products SET product_name=?, product_price=?, timer=?, current_timer=?, category=?, auction_price=?
	WHERE id=?`, {
		type: sequelize.QueryTypes.UPDATE,
		replacements: [product_name, product_price, timer, timer, category, product_price, product_id]
	})
	res.end()
})