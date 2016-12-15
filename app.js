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

app.get('/', function(req,res,next){
  db.any('SELECT * FROM blogs')
      .then(function(data){
          return res.render('index', {data: data})
      })
      .catch(function(err){
          return next(err);
      });
});
/*
// edit users
app.get('/blogs/:id/edit', function(req,res,next){
    var id = parseInt(req.params.id);
    db.one('select * from highscores where id = $1', id)
        .then(function (blog) {
            res.render('edit', {blog: blog})
        })
        .catch(function (err) {
            return next(err);
        });
});

app.post('/blogs/:id/edit', function(req,res,next){
    db.none('update blogs set title=$1, poster=$2, content=$3 where id=$4', [req.body.title, req.body.poster, req.body.content, parseInt(req.params.id)])
        .then(function () {
            res.redirect('/');
        })
        .catch(function (err) {
            return next(err);
        });
});

app.get('/blogs/:id/delete', function(req, res, next){
    var id = parseInt(req.params.id);
    db.result('delete from blogs where id = $1', id)
        .then(function (result) {
            res.redirect('/');
        })
        .catch(function (err) {
            return next(err);
        });
});

app.get('/new', function(req, res, next){
  return res.render('new');
});

app.post('/new', function(req, res, next){
  db.none('insert into blogs(title, poster, content)' + 'values($1, $2, $3)', [req.body.title, req.body.poster, req.body.content])
    .then(function () {
      res.redirect('/');
    })
    .catch(function (err) {
      return next(err);
    });
});
*/

app.listen(process.env.PORT, function(){
    console.log('Application running on localhost on port ' + process.env.PORT);
});
