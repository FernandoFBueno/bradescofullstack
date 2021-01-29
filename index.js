'use strict'

// function connect(uris: string, 
//                  options: mongoose.ConnectOptions, 
//                  callback: (err: MongoError) => void): Promise<typeof mongoose> 
//                  )

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.PORT || 3977;

mongoose.connect('mongodb://localhost:27017/curso_mean',
                 { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, 
                 (err, res) => {
    if (err) {
        throw err;
    } else {
        console.log("Database is connected");

        app.listen(port, function() {
            console.log("Servidor API rodando em http://localhost:"+port);
        });
    }
});

// mongoose.connect('mongodb+srv://bradesco:bradesco123@cluster0.2rfxt.mongodb.net/curso_mean?retryWrites=true&w=majority', (err, res) => {
//     if (err) {
//         throw err;
//     } else {
//         console.log("Database is connected");
//     }
// });

