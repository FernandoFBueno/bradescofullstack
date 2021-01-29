'use strict'

var express = require('express');
var bodyParser = require('body-parser');

var app = express();

var user_routes = require('./routes/user');

//Rotas
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//Rotas do Backend (API)
app.use('/api', user_routes);

//Rotas do Front
app.get('/', function(req, res) {
    res.status(200).send({message: "Bem vindo!"});
});


module.exports = app;

