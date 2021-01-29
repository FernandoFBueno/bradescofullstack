'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var user_routes = require('./routes/user');
var artist_routes = require('./routes/artist');
var album_routes = require('./routes/album');
var song_routes = require('./routes/song');

//Rotas
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Rotas do Backend (API)
app.use('/api', user_routes);
app.use('/api', artist_routes);
app.use('/api', album_routes);
app.use('/api', song_routes);

//Rotas do Front
app.get('/', function(req, res) {
    res.status(200).send({message: "Bem vindo!"});
});


module.exports = app;

