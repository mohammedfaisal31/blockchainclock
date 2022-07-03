const express = require('express')
const port = process.env.PORT || 8400
const bodyParser = require('body-parser')
const mysql = require('mysql2')
const app = express()
let urlencodedParser = express.urlencoded({ extended: false })
let con = mysql.createConnection({
    host: "btktwyp7v4dhff9gtijj-mysql.services.clever-cloud.com",
    user: "ueejbf6mdavbgdaq",
    password: "4uclhV4G5d9OiUw9pvd8",
    database: "btktwyp7v4dhff9gtijj"
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

app.post('/signup',urlencodedParser,(req,res)=>{
	let iobj = Object.assign({},req.body)
    let sql = "INSERT INTO StockUser(user_ID,customer_name,email,passcode) VALUES(null,'"+iobj.username+"','"+iobj.email+"','"+iobj.password+"');"
	console.log(sql)
    console.log(iobj)
    con.query(sql, (err, result) => {
        if (err) {
			console.log(err)
        }
        console.log("inserted ")
		res.redirect("/login")
    })
})


app.get('/login',(req,res)=>{
	res.render('login')
})
let email_id
app.post('/login',urlencodedParser,(req,res)=>{
	validateLogin(req.body.email, req.body.passcode).then(function (obj) {
        console.log(obj);
        if(obj.flag != null) 
            return res.redirect('portfolio')
        else 
            return res.render('login',{error:"Email or password is wrong"})
        
    }).then(function setEmailID(email = req.body.email){
        email_id = email
    }).catch((err)=> res.send("<h3>Something went wrong!</h3>"))
})

app.get('/portfolio',(req,res)=>{
	getPortfolio(email_id).then((data)=>{
        console.log(data['data'][0])
        res.render('portfolio',stock = data['data'][0])
    }).catch((err)=> res.send("<h3>Something went wrong!</h3> "))
    
})
app.get('/trade',(req,res)=>{
	res.render('trade')
})
app.post('/trade',urlencodedParser,(req,res)=>{
	let stockObj = Object.assign({},req.body) 
    console.log(Object.assign({},req.body))
    updateHoldings(email_id,stockObj.stock,stockObj.amount).then((obj)=>console.log(obj)).catch((err)=>console.log(err))
    res.redirect('portfolio')
})
app.listen(port, () => console.log("listening"))


function validateLogin(email, passcode) {
    return new Promise((resolve, reject) => {
        let sql = ' SELECT email FROM StockUser WHERE email="'+email+'" AND passcode ="'+passcode+'"'
	    console.log(sql);
        con.query(sql, (err, result) => {
            if (err ) reject({
                sqlerror:err,
                query:sql
            })
            //console.log(result);
            resolve({
                flag: result[0]
            })
        })
    })
}

function getPortfolio(email){
    return new Promise((resolve, reject) => {
        let sql = ' SELECT * FROM Holdings WHERE email = "'+email+'"'
	    console.log(sql);
        con.query(sql, (err, result) => {
            if (err ) reject({
                sqlerror:err,
                query:sql
            })
            //console.log(result);
            resolve({
                data: result
            })
        })
    })

}

function updateHoldings(email,token,value){
    return new Promise((resolve, reject) => {
        let sql1 = 'INSERT INTO Holdings(email) VALUES("'+email+'")'
	    console.log(sql1)
        con.query(sql1, (err, result) => {
            if (err ) reject({
                sqlerror:err,
                query:sql1
            })
            //console.log(result);
            resolve({
                data: result
            })
        })

        let sql2 = 'UPDATE Holdings SET '+token+' = "'+value+'" WHERE email="'+email+'"'
	    console.log(sql2)
        con.query(sql2, (err, result) => {
            if (err ) reject({
                sqlerror:err,
                query:sql2
            })
            //console.log(result);
            resolve({
                data: result
            })
        })
        

    })
}