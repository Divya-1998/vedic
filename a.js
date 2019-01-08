
var express = require('express')
var app = express()
app.use(express.static('sub'))
var request = require('request')
app.set('view engine','ejs')


// var Datastore = require('nedb')
// var db = new Datastore({filename: 'pr',autoload: true });

mongojs = require('mongojs')
db = mongojs('mongodb://node:node123@ds157503.mlab.com:57503/mydatabase',['users'])

var bodyParser = require('body-Parser')
app.use(bodyParser.urlencoded({extended:false}))

var session = require('express-session')
app.use(session({secret : 'keyboard cat',cookie : {maxAge : 60000}}))
// ----------------------------------------------------------------------
app.get('/',function (req,res) {
	req.session.firstname = 'yes'
	res.sendFile(__dirname + '/sub/home.html')
})

app.get('/signup',function (req,res) {
	//console.log(__dirname)
	res.sendFile(__dirname+'/sub/signup.html')
})

// app.get('/dashboard',function (req,res) {
// 	//console.log(__dirname)
// 	res.sendFile(__dirname+'/sub/dashboard.html')
// })

// -----------------------------------------------------------------------
//db.find(doc,function(err,doc) {
//	if(doc.length>0) {
//		db.find({},function(err,doc) {
//			res.render('dashboard',{res:doc})
//		})
//	}
//})

// -----------------------------------------------------------------------
app.post('/login',function(req,res) {
	var doc =  {
		email : req.body.En,
		Password : req.body.pass,
	}
	console.log(doc)
	db.users.find(doc,function(err,docs) {
		if(docs.length > 0) {
			req.session.user = true
			db.users.find({},function(err,docs) {
				res.render('dash',{res : docs})
			})
		} else {
				res.send('fail')
		}
	})
	
	// db.insert(doc,function(err,newD) {
		// console.log(newD)
		// res.send('<h1>successful</h1>')
	// })
})
// -----------------------------------------------------------------------
app.post('/signup',function(req,res) {
	var d =  {
		firstname  : req.body.fn,
		lastname : req.body.ln,
		Password : req.body.pass,
		email : req.body.en,
		Mobile : req.body.mobile,
		dateofbirth : req.body.num
	}
	db.users.insert(d,function(err,newD) {
		if(err) {
			res.send('something went wrong')
		} else {
			res.sendFile(__dirname+'/sub/login.html')
		}
		
	})
})
// --------------------------------------------------------------------------

 app.get('/dashboard',function (req,res) {
 	if(req.session.user == true) {
	res.send('welcome'+req.session.firstname)
} else {
	res.sendFile(__dirname + '/sub/login.html')
}
})

// -------------------------------------------------------------------------

app.get('/logout',function(err,res) {
	req.session.destroy(function(err) {
		res.redirect('/login')
	})
})

app.listen(3000,function() {
	console.log("hey the server started")
})
