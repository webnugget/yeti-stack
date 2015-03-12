'use strict';
angular.module('auth', [
    'ui.router',
    'angular-storage'
])
    .config(function($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            controller: 'LoginController',
            templateUrl: 'templates/auth/login.html'
        }).state('signup', {
            url: '/signup',
            controller: 'SignUpController',
            templateUrl: 'templates/auth/signup.html'
        });
    });