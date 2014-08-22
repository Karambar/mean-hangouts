'use strict';

angular.module('mean.mean-hangouts').controller('ConferenceController', ['$scope', 'Global', 'Conference',
    function($scope, Global, Conference) {
        $scope.global = Global;
        $scope.package = {
            name: 'conference'
        };

		Conference.registerObserverCallback(function(){
			$scope.myuser   = Conference.getMyUser();
			$scope.users    = Conference.getUsers();
            $scope.screen   = Conference.getScreen();
            $scope.$apply();
        });

        this.switchPresenter = function(id){
            Conference.switchPresenter(id);
        };

        this.startSharingScreen = function(){
            Conference.startSharingScreen();
        };

        this.getUserStatus = function(user){
            return user.isPresenter ? 'Presenter' : '';
        };

       	var random = Math.floor(Math.random()*100000 + 50);
        $scope.getRandom = function(){
            return random;
        }

        $('.create-room').on('click', function() {
            Conference.createRoom($(this).attr('id'));
        });

        $('.join-room').on('click', function() {
            Conference.joinRoom($('#room-id').val());
        });

    }
]);