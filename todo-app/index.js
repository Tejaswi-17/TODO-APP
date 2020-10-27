const express=require('express');
const app=express();

var task=[];
var searchResult = [];

app.set('view engine', 'ejs');

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));



var search = (str) => {
	searchResult = [];
	task.forEach(val => {
		if (val.includes(str)){
			searchResult = searchResult.concat(val);
		}
	})
}

app.get('/search',(req,res)=>{
	search(req.query.search);
	// search(req.body.params);
	res.render("index",{task:searchResult});
});

app.post('/removetask',(req,res)=>{
   task = [];
   res.redirect("/");
});

app.post('/addtask',(req,res)=>{
	var newtask=req.body.addtask;
	task.push(newtask);
	res.redirect("/");
});

app.get("/remove/:task", (req,res) => {
	task = task.filter((e) => { return e !== req.params.task });

	res.redirect("/");
})

app.get("/", function(req, res) {   
  res.render("index", { task: task});
});

app.listen(3000);