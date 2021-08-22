//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static("public"));

/* connecting to mongodb*/
mongoose.connect("mongodb://localhost:27017/wikiDB", { useNewUrlParser: true });

/*Creating Article Schema*/
const articleSchema = {
	title: String,
	content: String
};
const Article = mongoose.model("Article", articleSchema);

///////////////////////////////////////////////Requests Targeting all Articles/////////////////////////////////////////////////
/**app.route() method:allows you to create chainable route handlers by using app.route  */
/*Article Route*/
app.route("/articles")


	/* Fetches all article from the database and send to the reciever*/
	.get(function (req, res) {
		Article.find(function (err, foundArticles) {
			if (!err) {
				res.send(foundArticles);
			}
			else {
				res.send(err);
			}
		})
	})
	/* Post New Article to our database */
	.post(function (req, res) {
		const newArticle = new Article({
			title: req.body.title,
			content: req.body.content
		});
		newArticle.save(function (err) {
			if (!err) {
				res.send("Succesfully added a new article");
			}
			else {
				res.send(err);
			}
		});

	})

	/*Delete All article present in the database*/
	.delete(function (req, res) {
		Article.deleteMany(function (err) {
			if (!err) {
				res.send("Succesfully Deleted all articles.");
			}
			else {
				res.send("No articles matching that title was found.");
			}
		});
	});
///////////////////////////////////////////////Requests Targeting Specific Articles/////////////////////////////////////////////////
/* localhost:3000/articles/jQuery
	req.params.articleTitle="jQuery"
*/
app.route("/articles/:articleTitle")
	.get(function(req,res){
		/* Reading from the database to look for a specific article with the article title */
		Article.findOne({title: req.params.articleTitle},function(err,foundArticle){
		      if(foundArticle){
				res.send(foundArticle);
		      }
		      else{
				res.send("No articles matching that title was found");
		      }
		});
	})
	/**PUT->updating database by sending entire entry to replace the previous one */
	.put(function(req,res){
		Article.update(
			{title: req.params.articleTitle},
			{title:req.body.title, content: req.body.content},
			{overwrite: true},
			function(err,results){
				if(!err){
					res.send("Successfully updated article.");
				}

			}
		)
	})
	/*only update the fiedls that we proviede
		here also calls the update method without overwrite as true and have setflag which tells mongo to only update 
		the field that we have provied update for
	*/
	.patch(function(req,res){
		// req.body={
		// 	title: "TEST",
		// 	title:"TEST"
		// }
		Article.update(
			// {tite: req.params.articleTitle},
			// /*only title */
			// {$set: {title: "Chuck Norris"}}
			// /* only content */
			// {$set: {title: ""}}
			// /* Both */
			// {$set: {content:"",title:""}}
			{title: req.params.articleTitle},
			{$set: req.body},
			function(err){
				if(!err){
					res.send("Successfully updated article.")
				}else{
					res.send(err);
				}
			}

		)
	})
	/**Delete Spcific article */
	.delete(function(req,res){
		Article.deleteOne(
			
			{title:req.params.articleTitle},
			function(err){
			if(!err){
				res.send("Succesfully deleted Article the corresponding article");
			}else{
				res.send(err);
			}
		});
	});
// app.get("/articles/jack-bauer",);
// app.get("/articles",);
// app.post("/articles",);
// app.delete("/articles",);


/**Runs Server */
app.listen(3000, function () {
	console.log("Server started on port 3000");
});