'use strict';
angular.module('auth')
    .controller('ForgotPasswordController', function ForgotPasswordController($scope, AuthFactory) {
        $scope.user = {};
        $scope.success = false;
        $scope.loading = false;
        $scope.forgotPassword = function (user) {
            $scope.loading = true;
            AuthFactory.forgotPassword(user)
                .then(function success(response) {
                    $scope.message = response.data;
                    $scope.loading = false;
                    if (response.status < 400) {
                        $scope.success = true;
                        $scope.user = {};
                    } else {
                        $scope.user = {};
                    }
                }, function error(err) {
                    $scope.message = err.data;
                    $scope.loading = false;
                });
        };
    });