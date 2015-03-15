(function () {
    'use strict';

    function config($urlRouterProvider, $locationProvider, $httpProvider, jwtInterceptorProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode({
            enabled: false,
            requireBase: false
        });
        $locationProvider.hashPrefix('!');
        jwtInterceptorProvider.tokenGetter = function (API_URL, store, config, AuthFactory, jwtHelper) {
            var token = store.get('token');
            //Check if token exists
            if (token) {
                var decoded = jwtHelper.decodeToken(token),
                    issueTime = decoded.exp - decoded.iat,
                    refreshAfterSec = issueTime / 24,
                    timeleftSec = (decoded.exp - Date.now() / 1000);
                //check if token is expired
                if (jwtHelper.isTokenExpired(token)) {
                    //token expired, logout user and remove token
                    AuthFactory.logout();
                } else if (timeleftSec < (issueTime - refreshAfterSec)) {
                    //token need to be renewed
                    if (config.url === API_URL + '/auth/newtoken') {
                        return token;
                    }
                    AuthFactory.newtoken()
                        .then(function success(response) {
                            return response.data.token;
                        }, function error() {
                            return token;
                        });
                } else {
                    return token;
                }
            } else {
                return null;
            }
        };
        $httpProvider.interceptors.push('jwtInterceptor');
    }

    function run($rootScope, $state, store, jwtHelper, ModalService, AuthFactory) {
        FastClick.attach(document.body);
        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState) {
            function showLoginModal(requiredRoles) {
                var modalOptions = {
                    templateUrl: 'templates/auth/login-modal.html',
                    controller: 'LoginModalController',
                    inputs: {
                        roles: requiredRoles
                    }
                };
                ModalService.showModal(modalOptions)
                    .then(function (modal) {
                        modal.close.then(function (result) {
                            if (result === 'signup') {
                                $state.go('signup');
                            } else if (result) {
                                $state.go(toState.name);
                            } else {
                                $state.go(fromState.name);
                            }
                        });
                    });
            }
            var requiresLogin = false;
            var requiresRole = false;
            //check if toState requires login or role
            if (toState.data && (toState.data.requiresLogin || (toState.data.vars && toState.data.vars.requiresLogin))) {
                requiresLogin = toState.data.requiresLogin || toState.data.vars.requiresLogin;
            }
            if (toState.data && (toState.data.requiresRole || (toState.data.vars && toState.data.vars.requiresRole))) {
                requiresRole = toState.data.requiresRole || toState.data.vars.requiresRole;
            }
            if (requiresLogin && !requiresRole) {
                //console.log('login required but no role needed');
                if (!store.get('token') || jwtHelper.isTokenExpired(store.get('token'))) {
                    event.preventDefault();
                    showLoginModal();
                }
            }
            if (requiresRole) {
                if (!store.get('token') || jwtHelper.isTokenExpired(store.get('token'))) {
                    event.preventDefault();
                    //console.log('no token set and role required');
                    showLoginModal(requiresRole);
                } else {
                    //console.log('token set and role required');
                    if (!AuthFactory.checkRole(requiresRole)) {
                        //console.log('role does not match');
                        event.preventDefault();
                        showLoginModal(requiresRole);
                    }
                }
            }
        });
    }
    angular.module('application', [
        'ui.router',
        'ngAnimate',
        //app modules
        'core',
        'auth',
        'user',
        'angular-jwt',
        'angular-storage',
        'angularModalService',
        //foundation
        'foundation',
        'foundation.dynamicRouting',
        'foundation.dynamicRouting.animations'
    ])
        .config(config)
        .constant('API_URL', '/api')
        .run(run);
})();