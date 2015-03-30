(function () {
    'use strict';

    function config($urlRouterProvider, $locationProvider) {
        $urlRouterProvider.otherwise('/');
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    }

    function run() {
        FastClick.attach(document.body);
    }
    angular.module('application', [
        'ui.router',
        'ngAnimate',
        //app modules
        'core',
        'auth',
        'user',
        //foundation
        'foundation',
        'foundation.dynamicRouting',
        'foundation.dynamicRouting.animations'
    ])
        .config(config)
        .constant('API_URL', '/api')
        .run(run);
})();