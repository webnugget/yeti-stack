'use strict';
angular.module('account', ['ui.router'])
    .config(function ($stateProvider) {
        $stateProvider.state('account', {
            url: '/account',
            templateUrl: 'templates/account/account.html',
            data: {
                requiresLogin: true
            }
        });
    });