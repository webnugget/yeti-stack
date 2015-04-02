'use strict';
angular.module('auth')
    .controller('SignUpController', function SignUpController($scope, AuthFactory) {
        $scope.user = {};
        $scope.createUser = function (user) {
            AuthFactory.signup(user);
        };
    });