'use strict';

// Declare app level module which depends on filters, and services
angular.module('dashApp', ['restangular', 'ngTable', 'googlechart.directives','ngSanitize']).
config(['$routeProvider', '$locationProvider', 'RestangularProvider',
    function($routeProvider, $locationProvider, RestangularProvider) {


        // individual component
        $routeProvider.when('/:site/:env/events', {
            templateUrl: 'template/wrapper.html',
            controller: 'EventsCtrl'
        });
        $routeProvider.when('/:site/:env/curations', {
            templateUrl: 'template/wrapper.html',
            controller: 'CurationsCtrl'
        });
        $routeProvider.when('/:site/:env/graph', {
            templateUrl: 'template/bar.html',
            controller: 'GraphCtrl'
        });
        $routeProvider.when('/:site/:env/nav', {
            templateUrl: 'template/nav.html'
        });
        $routeProvider.when('/:site/:env/future', {
            templateUrl: 'template/bar.html',
            controller: 'FutureEventCtrl'
        });


        $routeProvider.when('/:site/:env/event/:eventId', {
            templateUrl: 'template/event.html',
            controller: 'EventCtrl'
        });

        $routeProvider.when('/:site/:env/channels', {
            templateUrl: 'template/bar.html',
            controller: 'ChannelCtrl'
        });

        $routeProvider.otherwise({
            redirectTo: '/us/production/dash'
        });

        // dash
        $routeProvider.when('/:site/:env/dash', {
            templateUrl: 'template/dash.html'
        });

        $routeProvider.when('/:site/:env/pop', {
            templateUrl: 'template/pop.html'
        });


        RestangularProvider.setBaseUrl("/api/");
        RestangularProvider.setResponseExtractor(function(response, operation, what, url) {
            var newResponse = [];
            newResponse.push(response);
            return newResponse;
        });

    }
]);

// Graph initialization
google.load('visualization', '1', {
    packages: ['corechart']
});
