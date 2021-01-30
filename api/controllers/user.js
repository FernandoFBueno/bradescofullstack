'use strict'

var fs = require('fs');
var path = require('path');
var User = require('../models/user');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
const { restart } = require('nodemon');

function teste(req, res) {
    var params = req.user;

    res.status(200).send({
        user: params
    });
}

function saveUser(req, res) {
    var user = new User();
    var params = req.body;

    user.name = params.name;
    user.surname = params.surname;
    user.email = params.email;
    user.role = 'ROLE_USER';
    user.image = 'null';

    if(params.password) {
        //encrypt da senha
        bcrypt.hash(params.password, null, null, function(err, hash) {
            user.password = hash;
            //validar os campos
            if(user.name != null 
               && user.surname != null 
               && user.email != null) {
                //salvar o usuario
                user.save((err, userStored) => {
                    if(err){
                        res.status(500).send({message: "Erro ao salvar usuario"});
                    } else {
                        if(!userStored) {
                            res.status(404).send({message: "Usuario não encontrado"});
                        } else {
                            res.status(200).send({user: userStored});
                        }
                    }
                });

            } else {
                res.status(200).send({message: "Por favor preencha todos os campos!"});
            }

        });

    } else {
        res.status(500).send({message: "Password is empty"});
    }  
}

function loginUser(req, res) {
    var params = req.body;
    var email = params.email;
    var password = params.password;

    User.findOne({email: email.toLowerCase()}, (err, user) => {
        if(err){
            res.status(500).send({message: "Erro na requisão"});
        } else {
            if(!user) {
                res.status(404).send({message: "Usuário nao encontrado"});
            } else {
                bcrypt.compare(password, user.password, function(err, check) {
                    if(check) {
                        //res.status(200).send({user})
                        if(params.gethash){
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        } else {
                            res.status(200).send({user})
                        }
                    } else {
                        res.status(401).send({message: "Não foi possivel fazer login"});
                    }
                });
            }

        }
    });
}

function updateUser(req, res) {
    var userId = req.params.id;
    var update = req.body;

    User.findByIdAndUpdate(userId, update, (err, userUpdated) => {
        if(err) {
            res.status(500).send({message: "Erro ao atualizar usuário"});
        } else {
            if(!userUpdated) {
                res.status(404).send({message: "Não foi possível atualizar o usuário"});
            } else {
                res.status(200).send({user: userUpdated});
            }
        }
    });
}

function uploadImage(req, res) {
    var userId = req.params.id;
    var file_name = "sem imagem";

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var file_ext_split = file_name.split('\.');
        var file_ext = file_ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            User.findByIdAndUpdate(userId, {image: file_name}, (err, userUpdated) => {
                if(!userUpdated) {
                    res.status(404).send({message: "Não foi possível atualizar o usuário"});
                } else {
                    res.status(200).send({image: file_name, user: userUpdated});
                }  
            });
        } else {
            res.status(200).send({message: "Por favor envie uma imagem valida!"});
        }
    } else {
        res.status(200).send({message: "Nenhum arquivo no upload"});
    }
}

function getImageFile(req, res) {
    var imageFile = req.params.imageFile;
    var path_file = './uploads/users/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "Imagem não encontrada"});
        }
    }); 
}

module.exports = {
    teste,
    saveUser,
    loginUser,
    updateUser,
    uploadImage,
    getImageFile
}