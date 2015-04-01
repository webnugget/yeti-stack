'use strict';
angular.module('usermanagement', [])
    .config(function ($stateProvider) {
        //declare states for usermanagement-module
        $stateProvider.state('usermanagement', {
            url: '/usermanagement',
            controller: 'UsermanagementController',
            //This module is admin only
            data: {
                requiresRole: 'admin'
            },
            resolve: {
                userlist: function (UsermanagementFactory) {
                    return UsermanagementFactory.getUsers();
                }
            },
            templateUrl: 'templates/usermanagement/usermanagement.html',
            animation: {
                enter: 'slideInRight',
                leave: 'slideOutRight'
            }
        });
    })
    .run(function () {});