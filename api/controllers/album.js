'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getAlbum(req, res){
    var albumId = req.params.id;

    Album.findById(albumId).populate({path: 'artist'}).exec((err, album) => {
        if(err){
            console.log(err.toString());
            res.status(500).send({message: 'Erro na requisiçao'});
        } else {
            if(!album) {
                res.status(404).send({message: 'Album não existe'});
            } else {
                res.status(200).send({album});
            }

        }
    });
}

function saveAlbum(req, res) {
    var album = new Album();

    var params = req.body;
    album.title = params.title;
    album.description = params.description;
    album.year = params.year;
    album.image = 'null';
    album.artist = params.artist;

    album.save((err, albumStored) => {
        if(err){
            res.status(500).send({message: 'Erro ao salvar album'});
        } else {
            if(!albumStored) {
                res.status(404).send({message: 'Album não foi salvo corretamente'});
            } else {
                res.status(200).send({artist: albumStored});
            }
        }
    });
}

function getAlbums(req, res) {
    var artistId = req.params.artist;
    var find;

    if(!artistId) {
        //Pegar todos os albuns 
        find = Album.find({}).sort('title');
    } else {
        //Pegar todos os albuns de um artist
        find = Album.find({artist: artistId}).sort('year');
    }

    find.populate({path: 'artist'}).exec((err, albums) => {
        if(err){
            res.status(500).send({message: 'Erro ao salvar album'});
        } else {
            if(!albums) {
                res.status(404).send({message: 'Não existem albuns'});
            } else {
                res.status(200).send({albums});
            }
        }
    });
}

function updateAlbum(req, res){
    var albumId = req.params.id;
    var update = req.body;

    Album.findByIdAndUpdate(albumId, update, (err, albumUpdated) => {
        if(err){
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if(!albumUpdated) {
                res.status(404).send({message: 'Erro ao atualizar album'});
            } else {
                res.status(200).send({album: albumUpdated});
            }
        }
    });
}

function deleteAlbum(req, res) {
    var albumId = req.params.id;

    Album.findByIdAndRemove(albumId, (err, albumRemoved) => {
        if(err){
            res.status(500).send({message: 'Erro ao eliminar album'});
        } else {
            if(!albumRemoved) {
                res.status(404).send({message: 'Album não foi removido'});
            } else {

                Song.find({album: albumRemoved._id}).deleteMany((err, songRemoved) => {
                    if(err){
                        res.status(500).send({message: 'Erro ao eliminar song'});
                    } else {
                        if(!songRemoved) {
                            res.status(404).send({message: 'Song não foi removido'});
                        } else {
                            res.status(200).send({album: albumRemoved});
                        }
                    }
                });
            }
        }
    });
} 

function uploadImage(req, res) {
    var albumId = req.params.id;
    var file_name = "sem imagem";

    if(req.files) {
        var file_path = req.files.image.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var file_ext_split = file_name.split('\.');
        var file_ext = file_ext_split[1];

        if(file_ext == 'png' || file_ext == 'jpg' || file_ext == 'gif'){
            Album.findByIdAndUpdate(albumId, {image: file_name}, (err, albumUpdated) => {
                if(!albumUpdated) {
                    res.status(404).send({message: "Não foi possível atualizar o album"});
                } else {
                    res.status(200).send({album: albumUpdated});
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
    var path_file = './uploads/albums/' + imageFile;

    fs.exists(path_file, function(exists){
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "Imagem não encontrada"});
        }
    }); 
}

module.exports = {
    getAlbum,
    saveAlbum,
    getAlbums,
    updateAlbum,
    deleteAlbum,
    uploadImage,
    getImageFile
}