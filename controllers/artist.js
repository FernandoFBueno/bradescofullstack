'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');
const artist = require('../models/artist');
const e = require('express');

function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) => {
        if(err){
            res.status(500).send({message: 'Erro na requisiçao'});
        } else {
            if(!artist) {
                res.status(404).send({message: 'Artist não foi encontrado'});
            } else {
                res.status(200).send({artist});
            }

        }
    });
}

function saveArtist(req, res) {
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) => {
        if(err){
            res.status(500).send({message: 'Erro ao salvar artist'});
        } else {
            if(!artistStored) {
                res.status(404).send({message: 'Artist não foi salvo corretamente'});
            } else {
                res.status(200).send({artist: artistStored});
            }
        }
    });
}

function getArtists(req, res) {
    var page = 1;

    if(req.params.page){
        page = req.params.page;
    }

    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total) {
        if(err){
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if(!artists) {
                res.status(404).send({message: 'Não existem artists'});
            } else {
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req, res) {
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) => {
        if(err){
            res.status(500).send({message: 'Erro ao salvar artist'});
        } else {
            if(!artistUpdated) {
                res.status(404).send({message: 'Artist não foi atualizado corretamente'});
            } else {
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

function deleteAritst(req, res) {
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Erro ao eliminar artist'});
        } else {
            if(!artistRemoved) {
                res.status(404).send({message: 'Artist não foi removido corretamente'});
            } else {
                Album.find({artist: artistRemoved._id}).remove((err, albumRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Erro ao eliminar album'});
                    } else {
                        if(!albumRemoved) {
                            res.status(404).send({message: 'Album não foi removido'});
                        } else {

                            Song.find({artist: albumRemoved._id}).remove((err, songRemoved) => {
                                if(err){
                                    res.status(500).send({message: 'Erro ao eliminar song'});
                                } else {
                                    if(!songRemoved) {
                                        res.status(404).send({message: 'Song não foi removido'});
                                    } else {
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

function uploadImage(req, res) {
    var artistId = req.params.id;
    var file_name = "sem imagem";

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var file_ext_split = file_name.split('\.');
        var file_ext = file_ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Artist.findByIdAndUpdate(artistId, {image: file_name}, (err, artistUpdated) => {
                if(!artistUpdated) {
                    res.status(404).send({message: "Não foi possível atualizar o artist"});
                } else {
                    res.status(200).send({user: artistUpdated});
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
    var path_file = './uploads/artist/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "Imagem não encontrada"});
        }
    }); 
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteAritst,
    uploadImage,
    getImageFile
}