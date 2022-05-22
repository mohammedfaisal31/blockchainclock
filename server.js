const express = require('express')
const port = process.env.PORT || 8400
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const app = express()

let con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Akida123",
    database: "inventory"
});
con.connect((err) => {
    if (err) console.log(err) 
    console.log("Connected to the database")
});

app.use(express.static('views'))
app.use('/css', express.static(__dirname + 'views/css'))
app.use('/js', express.static(__dirname + 'views/js'))

app.set('views', './views')
app.set('view engine', 'ejs')

app.get('/',(req,res)=>{
	res.render('index')
})

app.get('/signup',(req,res)=>{
	res.render('signup')
})

app.get('/login',(req,res)=>{
	res.render('login')
})
app.get('/portfolio',(req,res)=>{
	res.render('portfolio')
})
app.get('/trade',(req,res)=>{
	res.render('trade')
})
app.listen(port, () => console.log("listening"))
