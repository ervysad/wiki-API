//jshint esversion:6


const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');



const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/public", express.static("public"));



//connectiong to mongodb  
try {
    mongoose.connect('mongodb://localhost:27017/wikiAPIdb'); //add your own db with the wikiSchema here.
    console.log("Connected to DB...");
} catch (error) {
    console.log(error);
}


const wikiSchema = new mongoose.Schema({
    title: String,
    content: String,
});

const Article = mongoose.model("Article", wikiSchema); //check the Mayus here al crear la collection va a quitar la mayuscula y a pluralizar el nombre.

/////////////////////////////////////////HTTP Request to all parameters ///////////////////////////////////
app.route('/articles')
    .get(function (req, res) {
        //get all objs inside a collections
        Article.find(function (err, allArticles) {
            if (err) {
                console.log(err);
            } else {
                res.send(allArticles);
            }
        })
    })
    .post(function (req, res) {
        //Post to create a new obj inside a collection
        const newarticle = new Article({
            content: req.body.contentpst,
            title: req.body.titlepst
        })
        newarticle.save(function (err) {
            if (!err) {
                res.send("Element sucessfully added to collection db")
            } else {
                res.send(err)
            }
        })
    })
    .delete(function (req, res) {
        //Deleting all the collection.
        Article.drop(
            function (err) {
                if (!err) {
                    res.send("All db collection deleted")
                } else {
                    res.send(err)
                }

            }
        )
    }
    );

/////////////////////////////////////////HTTP Request to a single obj ///////////////////////////////////

app.route("/articles/:articleTitleEntered")
    .put(function (req, res) {
        //put on a specific obj (updates the whole article I can add null or empty properties if not defined.)
        Article.replaceOne(
            { title: req.params.articleTitleEntered },
            {
                title: req.body.title,
                content: req.body.content
            },
            function (err, results) {
                if (!err) {
                    res.send("Article updated")
                }
            }
        )
    })

    .patch(function (req, res) {
        //patch on a specific obj (updates just the defined properties durng the request.)
        Article.updateOne(
            { title: req.params.articleTitleEntered },
            {
                $set: req.body,
            },
            function (err, results) {
                if (!err) {
                    res.send("Article updated")
                    console.log(req.body);
                } else {
                    res.send(err)
                }
            }
        );
    })

    .delete(function (req, res) {
        //patch on a specific obj (updates just the defined properties durng the request.)
        Article.deleteOne(
            { title: req.params.articleTitleEntered },
            function (err) {
                if (!err) {
                    res.send("Article Deleted")
                } else {
                    res.send(err)
                }
            }
        );
    })



    .get(function (req, res) {
        //get all objs inside a collections that match title with the articleTitleEntered
        Article.find({ title: req.params.articleTitleEntered }, function (err, foundArticle) {
            if (foundArticle) {
                res.send(foundArticle);
            } else if (err) {
                res.send("Not Articles found 404");
            }
        })
    })

///////////////////////////// main index /////////////////////
app.get("/", function (req, res) {
    res.render("main")
})
app.listen(process.env.PORT || 3000, function () {
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});