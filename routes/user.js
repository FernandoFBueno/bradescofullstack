'use strict'

var express = require('express');
var multiparty = require('connect-multiparty');

var UserController = require('../controllers/user');
var md_auth = require('../middleware/authenticated');
var md_upload = multiparty({uploadDir: './uploads/users'});

var api = express.Router();

api.get('/apiusuarios', md_auth.ensureAuth, UserController.teste);
api.post('/userregister', UserController.saveUser);
api.post('/userlogin', UserController.loginUser);
api.post('/update-user/:id', md_auth.ensureAuth, UserController.updateUser);
api.post('/upload-user-image/:id', [md_auth.ensureAuth, md_upload], UserController.uploadImage);
api.get('/get-user-image/:imageFile', UserController.getImageFile);


module.exports = api;