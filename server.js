var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;


var app = express();
app.use(morgan('combined'));
var config={
    user:'duttaanimesh08', 
    database:'duttaanimesh08',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:db-'duttaanimesh08-68770' };

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

var pool= new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.status(JSON.stringify(result));
        }
    });
});
app.get('/article-one',function(req,res){
  res.sendFile(path.join(__dirname, 'ui','article-one.html'));

    
});
app.get('/article-two',function(req,res){
  res.sendFile(path.join(__dirname, 'ui','article-two.html'));
});
app.get('/article-three',function(req,res){
  res.sendFile(path.join(__dirname, 'ui','article-three.html'));
});

// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
