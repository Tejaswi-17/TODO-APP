const express=require('express');
const app=express();
const mysql=require("mysql");
var jwt = require('jsonwebtoken');
const SECRET = "Qwerty@1234567890";
var cookieParser = require('cookie-parser')

app.set('view engine', 'ejs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));
app.use(cookieParser())

var connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"Qwerty@123",
	database:"todo"
});

connection.connect((e) => {
	if (e) {throw e;}
});

var s = 1;

var count=()=>{
	connection.query("SELECT count(*) AS val FROM mynotes;",(e,r,f) => {
		s=r[0].val;
	})
}

count();

app.post('/addtask',(req,res,fields)=>{
	s+=1;
	var sno=s;
	var newtask=req.body.addtask;
	if(newtask){
		connection.query("INSERT INTO mynotes VALUES(?,?,?)",[sno,newtask,0],(err,result,f)=>{
			if(err){throw err;}
		})
	}
	res.redirect("/dashboard");
})

app.post('/removetask',(req,res,fields)=>{
   connection.query("Truncate table mynotes;",(err,result,f)=>{
   	    if(err){throw err;}
   	    res.redirect("/dashboard");
   });
});

app.get("/remove/:task", (req,res,fields) => {
	task=req.params.task;
	connection.query("Delete from mynotes where id=?",[task],(err,result,f)=>{
		if(err){throw err;}
		res.redirect("/dashboard");
	})
});


app.post("/register",(req,res,next) => {
	if (req.body.uname && req.body.upass){
		uname = req.body.uname;
		upass = req.body.upass;
	 	connection.query("INSERT INTO users VALUES(?,?);",[uname,upass],(e,r,f) => {
			if (e){throw e;}

			res.redirect("/login");
		})
	}
	else{
		res.redirect("/register");
	}
})


app.get("/register",(req,res,next) => {

	res.render("register");
})

app.post("/login",(req,res,n) => {
	if (req.body.uname && req.body.upass){

		uname = req.body.uname;
		upass = req.body.upass;

		connection.query("SELECT uname FROM users WHERE uname=? AND upass=?",[uname,upass],(e,r,f) => {

			if (e){throw e}
			if (r.length > 0){
				user = r[0].uname
				var token = jwt.sign({"logged_in_user":user},SECRET);
				res.cookie("login_token",token);
				res.redirect("/dashboard");
			}
			else{

				res.redirect("/");

			}

		});

	}
	else{
		res.redirect("/");
	}

})


app.get("/",(req,res,next) => {

	res.render("login")
})


app.get("/dashboard",(req,res,fields) =>{
	if (req.cookies.login_token){

		jwt.verify(req.cookies.login_token,SECRET,(err,r) => {
			if (err) {console.log("Oops!")}
			if (typeof r !== "undefined"){
				connection.query("SELECT * FROM mynotes;",(err,result,f)=>{
					if(err){throw err;}
					res.render("index",{list:result});
				})

			}
			else{
				res.send("Wrong Token");
			}
		})
	
	}
	else{
		res.redirect("/");
	}
});


app.get("/logout",(req,res,n) => {
	res.clearCookie("login_token");
	res.redirect("/");
})


app.listen(3000,()=>{
	console.log("Started..");
});