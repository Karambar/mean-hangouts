'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Conference = new Module('conference');

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

    /**
    //Uncomment to use. Requires meanio@0.3.7 or above
    // Save settings with callback
    // Use this for saving data from administration pages
    Conference.settings({
        'someSetting': 'some value'
    }, function(err, settings) {
        //you now have the settings object
    });

    // Another save settings example this time with no callback
    // This writes over the last settings.
    Conference.settings({
        'anotherSettings': 'some value'
    });

    // Get settings. Retrieves latest saved settigns
    Conference.settings(function(err, settings) {
        //you now have the settings object
    });
    */

    Conference.settings({
        'funcPage': '../controllers/sockets',
        'getMessageFunc': 'createFromSocket',
        'getAllMessagesFunc': 'getAllForSocket',
        'removeOldMessagesFunc': 'removeOldSocketMessages',
        'getAllChannelsFunc': 'getListOfChannels'
    });

    return Conference;
});
