'use strict';
angular.module('auth')
    .controller('ForgotPasswordController', function ForgotPasswordController($scope, AuthFactory) {
        $scope.user = {};
        $scope.forgotPassword = function (user) {
            AuthFactory.forgotPassword(user)
                .then(function success(response) {
                    $scope.message = response.data;
                }, function error(err) {
                    $scope.message = err.data;
                });
        };
    });