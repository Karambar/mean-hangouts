'use strict';

// The Package is past automatically as first parameter
module.exports = function(Conference, app, auth, database) {
    var PORT            = 8282;
    var appPath         = process.cwd();
    var config          = require(appPath + '/server/config/config');
    var express         = require('express');
    var https           = require('https');
    var socketApp       = express();
    
    var server          = null;
    if (config.key){
        server      = https.createServer({key: config.key, cert: config.cert}, socketApp);
    }else{
        server      = require('http').createServer(socketApp);
    }

    var io              = require('socket.io').listen(server);

    server.listen(PORT, function() {
        console.log('Chat now listening on port: ' + PORT + '\n');
    });

    var allowCrossDomain = function(req, res, next) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');

        // intercept OPTIONS method
        if ('OPTIONS' === req.method) {
            res.send(200);
        } else {
            next();
        }
    };
    socketApp.use(allowCrossDomain);

    var channels = {};

    io.on('connection', function (socket) {
        var initiatorChannel = '';
        if (!io.isConnected) {
            io.isConnected = true;
            socket.emit('connect', true);
        }

        socket.on('new-channel', function (data) {
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
            }
            channels[data.channel] = data.channel;
            onNewNamespace(data.channel, data.sender);
        });

        socket.on('new-custom-channel', function (data) {
            if (!channels[data.channel]) {
                initiatorChannel = data.channel;
                onNewNamespaceCustom(data.channel, data.sender);
            }
            channels[data.channel] = data.channel;
        });

        socket.on('message', function (data) {
            socket.broadcast.emit('message', data.data);
        });


        socket.on('presence', function (channel) {
            var isChannelPresent = !! channels[channel];
            socket.emit('presence', isChannelPresent);
        });

        socket.on('disconnect', function (channel) {
            if (initiatorChannel) {
                delete channels[initiatorChannel];
            }
        });


    });

    function onNewNamespaceCustom(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            socket.on('setPresenter', function(userid){
                socket.broadcast.emit('presenterGiven', userid.id);
            });
            socket.on('notifyNewPresenter', function(id){
                socket.broadcast.emit('newPresenterSet', id);
            });
        });
    }

    function onNewNamespace(channel, sender) {
        io.of('/' + channel).on('connection', function (socket) {
            console.log(sender + ' connected to room : ' + channel);
            var username;
            if (io.isConnected) {
                io.isConnected = false;
                socket.emit('connect', true);
            }

            socket.on('message', function (data) {
                if (data.sender === sender) {
                    if(!username) username = data.data.sender;

                    socket.broadcast.emit('message', data.data);
                }
            });

            socket.on('disconnect', function() {
                if(username) {
                    socket.broadcast.emit('user-left', username);
                    username = null;
                }
            });
        });
    }


    app.get('/conference/example/anyone', function(req, res, next) {
        res.send('Anyone can access this');
    });

    app.get('/conference/example/auth', auth.requiresLogin, function(req, res, next) {
        res.send('Only authenticated users can access this');
    });

    app.get('/conference/example/admin', auth.requiresAdmin, function(req, res, next) {
        res.send('Only users with Admin role can access this');
    });

    app.get('/conference/example/render', function(req, res, next) {
        Conference.render('index', {
            package: 'conference'
        }, function(err, html) {
            //Rendering a view from the Package server/views
            res.send(html);
        });
    });
};
