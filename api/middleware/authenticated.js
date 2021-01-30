'use strict'

var jwt = require('jwt-simple');
const { months } = require('moment');
var moment = require('moment');
var secret = 'chave_secreta';

exports.ensureAuth = function(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(403).send({message: "A requisição não possui cabeçalho de autorização!"});
    }

    var token = req.headers.authorization.replace(/['"]+/g, '');

    try{
        var payload = jwt.decode(token, secret);

        if(payload.exp <= moment().unix()){
            return res.status(401).send({message: "Token expirado"});
        }

    } catch (ex) {
        //console.log(ex.toString());
        return res.status(404).send({message: "Token inválido"});
    }

    req.user = payload;
    //req.body = payload;

    next();
}