'use strict';
angular.module('usermanagement')
    .controller('UsermanagementController', function ($scope, UsermanagementFactory, userlist) {
        $scope.userlist = userlist;
        $scope.UsermanagementFactory = UsermanagementFactory;
    });