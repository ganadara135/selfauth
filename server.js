var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var session = require('express-session');
var fs = require("fs")



app.set('views', __dirname +'/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);



app.use(express.static('public'));

// create application/json parser
var jsonParser = bodyParser.json({ type: 'application/json'});
// create application/x-www-form-urlencoded parser
//extended: false means you are parsing strings only (not parsing images/videos..etc)
var urlencodedParser = bodyParser.urlencoded({ extended: false })
// parse application/json
app.use(jsonParser);
// parse application/x-www-form-urlencoded
app.use(urlencodedParser)


app.use(session({
 secret: '@#@$MYSIGN#@$#$',
 resave: false,
 saveUninitialized: true,
 cookie: { maxAge: 600000 }  // 10분
}));

//agruments process
console.log(process.argv);
var client_token_param = process.argv[2];
var address_param = process.argv[3];

console.log('client_token_param: ' + client_token_param);
console.log('address_param: ' + address_param);

var router = require('./router/main')(app, fs, jsonParser, urlencodedParser,client_token_param,address_param);
// or router(app, fs, jsonParser, urlencodedParser);

var server = app.listen(3000, function(){
    console.log("Server has started on port 3000")
});
