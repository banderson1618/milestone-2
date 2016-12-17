var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var pgp = require('pg-promise')();
var db = pgp('postgres://postgres:1234@localhost:5432/highscores');

app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.set('views', __dirname+'/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var currentScore; // the current score recieved by the player
var numEntries; // the number of high scores in the database
var lowScore; // the lowest high score in the database
const MAXHIGHSCORES = 10; // the number of high scores allowed into the database

// sets the numEntries and the lowScore variables, based on the database, then renders the quiz screen
app.get('/', function(req,res,next){
    currentScore = 0;
    db.one('SELECT COUNT (*) FROM highscores') // gets the current number of entries from the database
        .then(function (result){
            numEntries = parseInt(result.count);
        })
        .catch(function(err){
            console.log(err);
        })
    db.one('SELECT MIN(score) FROM highscores' ) // gets the smallest score entry in the database, and sets that as the low score
        .then(function(result){ // used to determine if a score is a high score or not
            lowScore = parseInt(result.min);
        })
        .catch(function(err){
            console.log(err);
        })
    
    res.render('index');
});

// calculates the player's score. If it's a high score, then it directs the player to enter their name
// otherwise, it just goes straight to the high score screen
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
    
    if(numEntries < MAXHIGHSCORES){ // if the high scores database isn't full, the player is guaranteed a high score
        numEntries++;
        res.render('enterScore', {score:currentScore});
    }
    else if(currentScore > lowScore){ // if the high score database is full, and the player's score is higher
        db.result('delete from blogs where id = $1', MAXHIGHSCORES) // deletes the last entry in the database
            .then(function (result) {
                 res.render('enterScore', {score:currentScore}); // renders the "enter score" page
            })
            .catch(function (err) {
              return next(err);
            });
    }
    else{
        res.redirect('/hiscores');
    }
});

// enters the score into the database, then goes to the high score screen
app.post('/logScore', function(req, res, next){
    db.none('insert into highscores(player, score)' + 'values($1, $2)', [req.body.player, currentScore])
        .then(function () {
            res.redirect('/hiscores');
        })
        .catch(function (err) {
            return next(err);
        });
});

// renders the high score screen, sorted with the highest score at the top
app.get('/hiscores', function(req, res, next){
    db.any('SELECT * FROM highscores ORDER BY score DESC')
        .then(function(data){
            return res.render('hiscores', {data: data})
        })
        .catch(function(err){
            return next(err);
        });
});

// starts the server
app.listen(process.env.PORT, function(){
    console.log('Application running at https://milestone-2-banderson.c9users.io/');
});
