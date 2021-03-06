console.log('inside server.js');

var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var path = require('path');

// NOTES & ARTICLES //
var Note = require('./models/Note.js');
var Article = require('./models/Article.js');

var request = require('request');
var cheerio = require('cheerio');

mongoose.Promise = Promise;
// mongoose.connect("mongodb://heroku_g2k0716m:ohj3loscmufsiqgc55cmvmn1ek@ds223653.mlab.com:23653/heroku_g2k0716m", {
//     useMongoClient: true
// });

var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/scrapDB";


// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect( MONGODB_URI, {

  useMongoClient: true

}); 
var app = express();
var PORT = process.env.PORT || 3000;
var db = mongoose.connection;

app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static("public"));

var exphbs = require('express-handlebars');
app.engine("handlebars", exphbs({
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "/views/layouts/partials")
}));
app.set("view engine", "handlebars");

db.on('error', function (err) {
    console.log('Mongoose Error: ', err);
});

db.once('open', function () {
    console.log('Mongoose connection successful.');
});

// ROUTES //
app.get('/', function (req, res) {
    Article.find({ "saved": false }).limit(20).exec(function (error, data) {
        var hbsObject = {
            article: data
        };
        console.log(hbsObject);
        res.render("home", hbsObject);
    });
});

// SCRAPE //
app.get("/saved", function (req, res) {
    Article.find({ "saved": true }).populate("notes").exec(function (error, articles) {
        var hbsObject = {
            article: articles
        };
        res.render("saved", hbsObject);
    });
});

app.get('/scrape', function (req, res) {
    console.log('--------- In Scrape ------------');
    request("https://www.app.com/", function (error, response, html) {
        var $ = cheerio.load(html);
        $("article").each(function (i, element) {
            var result = {};
            result.title = $(this).children("h2").text();
            result.summary = $(this).children(".summary").text();
            //result.link = $(this).children("h2").children("a").attr('href');
            result.link = $(this).children(".js-asset-link").text();

            console.log(result, "--------------this is the scrape result ----------");

            // ARTICLES for RESULTS //
          //  var entry = new Article(result);

                        Article.create(result)
                        .then(function(dbArticle) {
                            // If we were able to successfully scrape and save the Recipe, send a message to the client
                            console.log('scrape complete', dbArticle);
                           
                        })
                        .catch(function(err) {
                            console.log( err, "-------- in error -----------");
                            // If an error occurred, send it to the client
                            
                        });
             });
        });

        res.send("Scrape Completed");
});

//             // SAVE to DB //
//             entry.save(function (err, doc) {
//                 if (err) {
//                     console.log(err);
//                 }
//                 else {
//                     console.log(doc);
//                 }
//             });
//         });
//         res.send("Scrape Complete");
//     });


// SCRAPED ARTICLES from MONGODB //
app.get("/articles", function (req, res) {
    Article.find({}).limit(20).exec(function (err, doc) {
        if (err) {
            console.log(err);
        }
        else {
            res.json(doc);
        }
    });
});

app.get('/articles/:id', function (req, res) {
    Article.findOne({ '_id': req.params.id })
        .populate("note")
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.json(doc);
            }
        });
});

app.post('/articles/save/:id', function (req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });

});

app.post("/articles/delete/:id", function (req, res) {
    Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": false, "notes": [] })
        .exec(function (err, doc) {
            if (err) {
                console.log(err);
            }
            else {
                res.send(doc);
            }
        });
});

app.post("notes/save/:id", function (req, res) {
    var newNote = new Note({
        body: req.body.text,
        article: req.params.id
    });
    console.log(req.body)
    newNote.save(function (error, note) {
        if (error) {
            console.log(error);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "notes": note } })
                .exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send(note);
                    }
                });
        }
    });
});

app.delete("/notes/delete/:note_id/:article", function (req, res) {
    Note.findOneAndRemove({ "_id": req.params.note.id }, function (err) {
        if (err) {
            console.log(err);
            res.send(err);
        }
        else {
            Article.findOneAndUpdate({ "_id": req.params.article_id }, { $pull: { "notes": req.params.note_id } })
                .exec(function (err) {
                    if (err) {
                        console.log(err);
                        res.send(err);
                    }
                    else {
                        res.send("Note Deleted");
                    }
                });
        }
    });
});

app.listen(PORT, function () {
    console.log("App running on PORT: " + PORT);
});