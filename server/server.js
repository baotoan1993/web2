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
	// 				} else {
	// 					list_products[idx].current_timer = x.timer
	// 				}
	// 			})
	// 			// console.log(list_products[0].current_timer)
	// 		}, 1000)
	// 	})
})
var auction_id = 1
app.get('/start', (req, res) => {
	sequelize.query("select * from products", {
		type: sequelize.QueryTypes.SELECT
	})
		.then(val => {
			list_products = val
			list_products.forEach(x => {
				sequelize.query("insert into auction (auction_id, product_id) values(?,?)", {
					type: sequelize.QueryTypes.INSERT,
					replacements: [auction_id, x.id]
				})
			})
			interval = setInterval(function () {
				list_products.forEach((x, idx) => {
					if (x.current_timer > 0) {
						list_products[idx].current_timer--
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
			if (val == null) {
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
	list_products.forEach(item => {
		if (item.id == id) {
			res.send(item)
		}
	})
})

app.post('/auction', (req, res) => {
	let product_id = req.body.product_id
	let user_id = req.body.user_id
	let price = req.body.price
	sequelize.query(`select * from auctioning 
						where auction_id = ? and 
						product_id = ? and
						user_id = ?`, {
			type: sequelize.QueryTypes.SELECT,
			replacements: [auction_id, product_id, user_id]
		})
		.then(val => {
			if(!val){
				sequelize.query("insert into auctioning values(?,?,?,?)",{
					type: sequelize.QueryTypes.INSERT,
					replacements: [auction_id, product_id, user_id, price]
				})
			}
		})
})