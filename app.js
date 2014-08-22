'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Conference = new Module('mean-hangouts');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Conference.register(function(app, auth, database) {

    //We enable routing. By default the Package Object is passed to the routes
    Conference.routes(app, auth, database);

    //We are adding a link to the main menu for all authenticated users
    Conference.menus.add({
        title: 'Start Conference',
        link: 'conference example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    var socket = require('socket.io-client')('http://localhost:8282');
    socket.on('connect', function(){
        socket.on('event', function(data){});
        socket.on('disconnect', function(){});
    });

    Conference.settings({
        'funcPage': '../controllers/sockets',
        'getMessageFunc': 'createFromSocket',
        'getAllMessagesFunc': 'getAllForSocket',
        'removeOldMessagesFunc': 'removeOldSocketMessages',
        'getAllChannelsFunc': 'getListOfChannels'
    });

    return Conference;
});
