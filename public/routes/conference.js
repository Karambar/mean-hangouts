'use strict';

angular.module('mean.mean-hangouts').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider.state('conference example page', {
            url: '/conference/example',
            templateUrl: 'mean-hangouts/views/index.html'
        });
    }
]);
