'use strict';
angular.module('auth')
    .factory('AuthFactory', function (API_URL, store, $state, $http, NotificationFactory, jwtHelper, _) {
        var auth = {},
            token = store.get('token'),
            authNotes = new NotificationFactory({
                id: 'authNotes',
                position: 'top-middle'
            });
        if (token) {
            auth.user = jwtHelper.decodeToken(token);
        }
        auth.login = function (user) {
            return $http.post(API_URL + '/auth', user)
                .then(function success(response) {
                    store.set('token', response.data.token);
                    auth.user = jwtHelper.decodeToken(response.data.token);
                    $state.go('home');
                    return response;
                }, function error(err) {
                    authNotes.addNotification({
                        title: 'Something went wrong!',
                        content: err.data,
                        autoclose: 5000
                    });
                });
        };
        auth.newtoken = function () {
            return $http.get(API_URL + '/auth/newtoken')
                .then(function success(response) {
                    store.set('token', response.data.token);
                    auth.user = jwtHelper.decodeToken(response.data.token);
                    console.log('new token set');
                    return response;
                }, function error(err) {
                    return err;
                });
        };
        auth.logout = function () {
            store.remove('token');
            auth.user = undefined;
            $state.go('home');
        };
        auth.signup = function (user) {
            return $http.post(API_URL + '/auth/signup', user)
                .then(function success(response) {
                    store.set('token', response.data.token);
                    auth.user = jwtHelper.decodeToken(response.data.token);
                    $state.go('home');
                }, function error(err) {
                    authNotes.addNotification({
                        title: 'Something went wrong!',
                        content: err.data,
                        autoclose: 5000
                    });
                });
        };
        auth.forgotPassword = function (user) {
            return $http.post(API_URL + '/auth/forgotpassword', user)
                .then(function success(response) {
                    return response;
                }, function error(err) {
                    return err;
                });
        };
        auth.resetPassword = function (user, resetToken) {
            return $http.post(API_URL + '/auth/resetpassword/' + resetToken, user)
                .then(function success(response) {
                    store.set('token', response.data.token);
                    auth.user = jwtHelper.decodeToken(response.data.token);
                    console.log('new token set');
                    return {
                        data: 'password changed...'
                    };
                }, function error(err) {
                    return err;
                });
        };
        auth.checkRole = function (roles) {
            var token = store.get('token') || undefined,
                decoded;
            if (token) {
                decoded = jwtHelper.decodeToken(token);
            }
            if (decoded && roles) {
                var requiredRoles = roles.split(' ');
                if (_.intersection(decoded.roles, requiredRoles)
                    .length) {
                    return true;
                }
            }
            return false;
        };
        return auth;
    });