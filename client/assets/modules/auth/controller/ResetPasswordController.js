'use strict';
angular.module('auth')
    .controller('ResetPasswordController', function ResetPasswordController($scope, AuthFactory, $stateParams) {
        $scope.user = {};
        $scope.resetPassword = function (user) {
            AuthFactory.resetPassword(user, $stateParams.resetToken)
                .then(function success(response) {
                    $scope.message = response.data;
                }, function error(err) {
                    $scope.message = err.data;
                });
        };
    });