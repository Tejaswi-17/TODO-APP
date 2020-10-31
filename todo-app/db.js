const express=require('express');
const app=express();
const mysql=require("mysql");


app.set('view engine', 'ejs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false}));

var connection = mysql.createConnection({
	host:"localhost",
	user:"root",
	password:"Qwerty@123",
	database:"todo"
});

connection.connect((e) => {
	if (e) {throw e;}
});

var s;

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
	res.redirect("/");
})

app.post('/removetask',(req,res,fields)=>{
   connection.query("Truncate table mynotes;",(err,result,f)=>{
   	    if(err){throw err;}
   	    res.redirect("/");
   });
});

app.get("/remove/:task", (req,res,fields) => {
	task=req.params.task;
	connection.query("Delete from mynotes where id=?",[task],(err,result,f)=>{
		if(err){throw err;}
		res.redirect("/");
	})
});

app.get("/",(req,res,fields) =>{
	connection.query("SELECT * FROM mynotes;",(err,result,f)=>{
		if(err){throw err;}
		res.render("index",{list:result});
	})
});

app.listen(3000,()=>{
	console.log("Started..");
});