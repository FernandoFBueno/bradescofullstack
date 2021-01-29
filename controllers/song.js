'use strict'

var fs = require('fs');
var path = require('path');
var mongoosePaginate = require('mongoose-pagination');

var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');

function getSong(req, res){
    var songId = req.params.id;

    Song.findById(songId).populate({path: 'album'}).exec((err, song) => {
        if(err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if(!song) {
                res.status(404).send({message: 'Song não encontrado'});
            } else {
                res.status(200).send({song});
            }
        }
    });
    
}

function saveSong(req, res){
    var song = new Song();

    var params = req.body;
    song.number = params.number;
    song.name = params.name;
    song.duration = params.duration;
    song.file = null;
    song.album = params.album;

    song.save((err, songStored) => {
        if(err){
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if(!songStored) {
                res.status(404).send({message: 'Não foi possível salvar o song'});
            } else {
                res.status(500).send({song: songStored});
            }
        }
    });
}

function getSongs(req, res){
    var albumId = req.params.album;
    var find;

    if(!albumId){
        find = Song.find({}).sort('number');
    } else {
        find = Song.find({album: albumId}).sort('number');
    }

    find.populate({
        path: 'album',
        populate: {
            path: 'artist',
            model: 'Artist'
        }
    }).exec(function(err, songs) {
        if(err) {
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if(!songs) {
                res.status(404).send({message: 'Não exist songs'});
            } else {
                res.status(200).send({songs});
            }
        }
    });
}

function updateSong(req, res){
    var songId = req.params.id;
    var update = req.body;

    Song.findByIdAndUpdate(songId, update, (err, songUpdated) => {
        if(err){
            res.status(500).send({message: 'Erro na requisição'});
        } else {
            if(!songUpdated) {
                res.status(404).send({message: 'Erro ao atualizar song'});
            } else {
                res.status(200).send({song: songUpdated});
            }
        }
    });
}

function deleteSong(req, res) {
    var songId = req.params.id;

    Song.findByIdAndRemove(songId, (err, songRemoved) => {
        if(err){
            res.status(500).send({message: 'Erro ao eliminar song'});
        } else {
            if(!songRemoved) {
                res.status(404).send({message: 'Song não foi removido'});
            } else {
                res.status(200).send({song: songRemoved});
            }
        }
    });
} 


function uploadFile(req, res) {
    var songId = req.params.id;
    var file_name = "sem arquivo";

    if(req.files) {
        var file_path = req.files.file.path;
        var file_split = file_path.split('/');
        var file_name = file_split[2];
        var file_ext_split = file_name.split('\.');
        var file_ext = file_ext_split[1];

        if(file_ext == 'mp3' || file_ext == 'mp4' || file_ext == 'ogg'){
            Song.findByIdAndUpdate(songId, {file: file_name}, (err, songUpdated) => {
                if(!songUpdated) {
                    res.status(404).send({message: "Não foi possível atualizar o song"});
                } else {
                    res.status(200).send({song: songUpdated});
                }  
            });
        } else {
            res.status(200).send({message: "Por favor envie uma imagem valida!"});
        }
    } else {
        res.status(200).send({message: "Nenhum arquivo no upload"});
    }
}

function getSongFile(req, res) {
    var songFile = req.params.songFile;
    var path_file = './uploads/songs/' + songFile;

    fs.exists(path_file, function(exists){
        if(exists) {
            res.sendFile(path.resolve(path_file));
        } else {
            res.status(200).send({message: "Song não encontrada"});
        }
    }); 
}


module.exports = {
    getSong,
    saveSong,
    getSongs,
    updateSong,
    deleteSong,
    uploadFile,
    getSongFile
}