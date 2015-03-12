'use strict';
angular.module('auth').controller('LoginModalController',
    function($scope, $element, close, roles, AuthFactory) {
        $scope.user = {};

        $scope.login = function(user) {

            AuthFactory.login(user).then(function success(response) {
                $scope.message = response.data;
                if (response.status < 400) {
                    if (roles) {
                        if (AuthFactory.checkRole(roles)) {
                            close(true);
                        } else {
                            $scope.message = 'This Account is not allowed to enter';
                        }
                    } else {
                        close(true);
                    }


                }

            }, function error(err) {
                $scope.message = err.data;
            });
        };

        $scope.closeModal = function(state) {
            if (state) {
                close(state);
            } else {
                close(false);
            }


        };

    });