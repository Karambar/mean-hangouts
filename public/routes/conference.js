'use strict';

angular.module('mean.conference').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('conference example page', {
            url: '/conference/example',
            templateUrl: 'conference/views/index.html'
        });
    }
]);
