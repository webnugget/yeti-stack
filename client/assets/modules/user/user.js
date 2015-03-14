'use strict';
angular.module('user', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('user', {
            url: '/user',
            templateUrl: 'templates/user/user.html',
            data: {
                requiresLogin: true
            }
        });
    });