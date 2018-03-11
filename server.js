var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var app = express();
var crypto=require('crypto');
var bodyParser=require('body-parser');
app.use(morgan('combined'));
app.use(bodyParser.json());
var config={
    user:'duttaanimesh08', 
    database:'duttaanimesh08',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD };
    function createTemplate(data)
    {
        var title=data.title;
        var date=data.date;
        var content=data.content;
        var heading=data.heading;
        var htmlTemplate= `
        <html>
        <head>
        <title>
        ${title}
        </title>
        <link href="/ui/style.css" rel="stylesheet" />
        </head>
        <body>
        <h3>
        ${heading}
        </h3>
        <div class="container" >
         <div>
         <a href="/">Home</a>
         </div>
         <hr/>
         <div>
         ${date.toDateString()}
         </div>
         <div>
         ${content}
         </div>
       </div>
       </body>
       </html>
       `;
       return htmlTemplate;
    }
    app.get('/articles/:articleName',function(req,res){
       pool.query("SELECT * FROM article WHERE title=$1",[req.params.articleName],function(err,result){
           if(err){
               res.status(500).send(err.toString());
           }
           else if(result.rows.length===0){
               res.status(404).send('Article not found');
           }
           else{
               var articleData=result.rows[0];
               res.send(createTemplate(articleData));
           }
    });
    });

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

function hash(input,salt){
    var hashed=crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return["pbkdf2","10000",salt,hashed.toString('hex')].join('$');
}
app.get('/hash/:input',function(req,res){
   var hashedString=hash(req.params.input,'this-is-some-random-string');
   res.send(hashedString);
});
app.post('/create-user',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    var salt="simeone";
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.status(200).send('User created'+username);
        }
    });
});
app.post('/login',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    pool.query('SELECT * FROM "user" WHERE username=$1' ,[username],function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else if(result.rows.length===0)
            {
            res.send(403).send("Username/password invalid");    
            }
            
        
        else{
            var dbString=result.rows[0].password;
            var salt=dbString.split('$')[2];
            var hashedPassword=hash(password,salt);
            if(hashedPassword===dbString)
            {
                res.send('Credentials correct');
            }
            else
            {
                res.send(403).send("Username/password invalid");    

            }
                   
        }
        
    });
});

var pool= new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err.toString());
        }
        else{
            res.status(200).send(JSON.stringify(result.rows));
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
