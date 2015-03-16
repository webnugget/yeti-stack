'use strict';
angular.module('auth')
    .controller('SignUpController', function SignUpController($scope, AuthFactory) {
        $scope.user = {};
        $scope.createUser = function (user) {
            AuthFactory.signup(user)
                .then(function success() {
                    // $scope.message = response.data;
                }, function error(err) {
                    $scope.message = err.data;
                });
        };
    });