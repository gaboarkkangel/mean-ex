const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
var morgan = require('morgan'); // log requests to the console (express4)


// Express APIs
const api = require('./routes/auth.routes');
const pollaCombinacion = require('./routes/pollaCombinacion.routes');
const polla = require('./routes/polla.routes');
const ejemplar = require('./routes/ejemplares.routes');
const hipodromo = require('./routes/hipodromo.routes');
const jinete = require('./routes/jinete.routes');
const entrenador = require('./routes/entrenador.routes');
const participante = require('./routes/participante.routes');
const carrera = require('./routes/carrera.routes');
const jornada = require('./routes/jornada.routes');
var database = require('./config/database'); //load the database config


// MongoDB conection
mongoose.Promise = global.Promise;
mongoose.connect(database.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Database connected')
},
    error => {
        console.log("Database can't be connected: " + error)
    }
);

// Remvoe MongoDB warning error
mongoose.set('useCreateIndex', true);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(cors());

// Serve static resources
app.use('/public', express.static('public'));

app.use('/api', api);
app.use('/api', ejemplar);
app.use('/api', hipodromo);
app.use('/api', jinete);
app.use('/api', entrenador);
app.use('/api', participante);
app.use('/api', carrera);
app.use('/api', jornada);
app.use('/api', polla);
app.use('/api', pollaCombinacion);



// configuration 

app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
app.use(morgan('combined')); // log every request to the console
app.use(bodyParser.urlencoded({
    'extended': 'true'
})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({
    type: 'application/vnd.api+json'
})); // parse application/vnd.api+json as json



// Define PORT
const port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
     ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

     app.listen(port, ip);

// Express error handling
app.use((req, res, next) => {
    setImmediate(() => {
        next(new Error('Something went wrong'));
    });
});



app.use(function (err, req, res, next) {
    console.error(err.message);
    if (!err.statusCode) err.statusCode = 500;
    res.status(err.statusCode).send(err.message);
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
  socket.on('my message', (msg) => {
    console.log('message: ' + msg);
    io.emit('my broadcast', `server: ${msg}`);
  });
  socket.on('new-message', (message) => {
    io.emit('new-message', message);
    console.log("escucho nuevo mensaje");
  });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});





// // server.js

// // set up ========================
// var express = require('express');
// var app = express(); // create our app w/ express
// var fs = require('fs')
// var mongoose = require('mongoose'); // mongoose for mongodb
// var morgan = require('morgan'); // log requests to the console (express4)
// var bodyParser = require('body-parser'); // pull information from HTML POST (express4)
// var database = require('./config/database'); //load the database config

// // configuration =================
// app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users
// app.use(morgan('combined')); // log every request to the console
// app.use(bodyParser.urlencoded({
//     'extended': 'true'
// })); // parse application/x-www-form-urlencoded
// app.use(bodyParser.json()); // parse application/json
// app.use(bodyParser.json({
//     type: 'application/vnd.api+json'
// })); // parse application/vnd.api+json as json

// var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
//     ip = process.env.IP || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

// mongoose.connect(database.url); // connect to mongoDB database
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));

// // load the routes
// require('./app/routes')(app);

// // listen (start app with node server.js) ======================================
// app.listen(port, ip);
// console.log('Server running on http://%s:%s', ip, port);

// module.exports = app;
