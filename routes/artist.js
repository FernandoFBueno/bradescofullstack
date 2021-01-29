'use strict'

var express = require('express');
var ArtistController = require('../controllers/artist');
var api = express.Router();
var md_auth = require('../middleware/authenticated');
var multiparty = require('connect-multiparty');
var md_upload = multiparty({uploadDir: './uploads/artist'});


api.get('/artist/:id', md_auth.ensureAuth, ArtistController.getArtist);
api.post('/artist', md_auth.ensureAuth, ArtistController.saveArtist);
api.get('/artists/:page?', md_auth.ensureAuth, ArtistController.getArtists);
api.put('/artist/:id', md_auth.ensureAuth, ArtistController.updateArtist);
api.delete('/artist/:id', md_auth.ensureAuth, ArtistController.deleteAritst);
api.post('/upload-artist-image/:id', [md_auth.ensureAuth, md_upload], ArtistController.uploadImage);
api.get('/get-artist-image/:imageFile', ArtistController.getImageFile);

module.exports = api;