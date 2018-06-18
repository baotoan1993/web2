var express = require('express')
var bodyParser = require('body-parser')
var app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))



app.listen(4000)

app.post('/login', (req, res) => {
	console.log(req.body)
})