'use strict';
angular.module('core').controller('NavigationController',
    function LoginController($scope, AuthFactory) {
        $scope.auth = AuthFactory;

    });