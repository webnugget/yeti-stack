'use strict';
angular.module('auth').controller('LoginController',
    function LoginController($scope, AuthFactory) {
        $scope.user = {};

        $scope.login = function(user) {
            AuthFactory.login(user).then(function success(response) {

            $scope.message = response.data;

            }, function error(err) {
                $scope.message = err.data;
            });
        };

    });