var express = require('express');
var http = require('http');
var server = new http.Server();
var app = express();


app.use(express.static(__dirname))

app.get('/', function(req,res){
    res.sendFile(__dirname + './index.html')
});


http.createServer(app).listen(7777)