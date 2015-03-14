'use strict';
angular.module('utils')
    .factory('_', function() {
        return window._; // assumes lodash has already been loaded on the page
    });