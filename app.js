var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
var db = pgp('postgres://postgres:1234@localhost:5432/highscores');

// this is to serve the css and js from the public folder to your app
// it's a little magical, but essentially you put files in there and link  
// to them in you head of your files with css/styles.css
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var currentScore;
var numEntries;
var lowScore;
const MAXHIGHSCORES = 10;

app.get('/', function(req,res,next){
    currentScore = 0;
    db.one('SELECT COUNT (*) FROM highscores')
        .then(function (result){
            numEntries = parseInt(result.count);
        })
        .catch(function(err){
            console.log(err);
        })
    db.one('SELECT MIN(score) FROM highscores' )
        .then(function(result){
            lowScore = parseInt(result.min);
        })
        .catch(function(err){
            console.log(err);
        })
    
    res.render('index');
});


app.get('/submit', function(req,res,next){
    currentScore = 0;
    if(req.body.QuestionOne != '') currentScore++;
    if(req.body.QuestionTwo == "To seek the Holy Grail!") currentScore++;
    if(req.body.QuestionThree == "Blue" || req.body.QuestionThree == "blue" || req.body.QuestionThree == "Yellow" ||req.body.QuestionThree == "yellow") currentScore++;
    if(req.body.QuestionFour == "African or European?" || req.body.QuestionFour == "24 miles per hour") currentScore++;
    if(req.body.QuestionFive == "Monty Python and the Holy Grail") currentScore++;
    //console.log(req.body.QuestionOne);
    //console.log(numEntries);
    //console.log(MAXHIGHSCORES);
    
    if(numEntries < MAXHIGHSCORES){
        numEntries++;
        res.render('enterScore', {score:currentScore});
    }
    else if(currentScore > lowScore){
        db.result('delete from blogs where id = $1', MAXHIGHSCORES) // deletes the last entry in the database
            .then(function (result) {
                 res.render('enterScore', {score:currentScore});
            })
            .catch(function (err) {
              return next(err);
            });
    }
    else{
        res.redirect('/hiscores');
    }
});

app.post('/logScore', function(req, res, next){
    db.none('insert into highscores(player, score)' + 'values($1, $2)', [req.body.player, currentScore])
        .then(function () {
            res.redirect('/hiscores');
        })
        .catch(function (err) {
            return next(err);
        });
});

app.get('/hiscores', function(req, res, next){
    db.any('SELECT * FROM highscores ORDER BY score DESC')
        .then(function(data){
            return res.render('hiscores', {data: data})
        })
        .catch(function(err){
            return next(err);
        });
});

app.listen(process.env.PORT, function(){
    console.log('Application running on localhost on port ' + process.env.PORT);
});
