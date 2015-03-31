'use strict';
angular.module('usermanagement')
    .factory('UsermanagementFactory', function ($http, API_URL, $q) {
        function getUsers() {
            var deferred = $q.defer();
            $http.get(API_URL + '/usermanagement/users')
                .then(function success(response) {
                    deferred.resolve(response.data);
                }, function error() {
                    deferred.reject({
                        message: 'unable to resolve userlist'
                    });
                });
            return deferred.promise;
        }

        function updateUser(user) {
            $http.put(API_URL + '/usermanagement/' + user._id, user);
        }
        return {
            getUsers: getUsers,
            updateUser: updateUser,
            roles: ['registered', 'user', 'editor', 'admin', 'manager']
        };
    });