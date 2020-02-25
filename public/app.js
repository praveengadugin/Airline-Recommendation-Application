'use strict';
var myApp = angular.module('muktika', ['ui.router', 'ngResource']);
myApp.config(['$urlRouterProvider','$stateProvider', '$locationProvider', function($urlRouterProvider,$stateProvider,$locationProvider){

  // Remove # from URL
  $locationProvider.html5Mode(
    {
        enabled: true,
        requireBase: false
    });

  $locationProvider.hashPrefix('!');

  $urlRouterProvider.otherwise('/');

  $stateProvider
  		.state('layout',{
        	url: '',
        	abstract: true,
        	views: {
          	'header': {
            		templateUrl: 'layout/header.html',
            		},
        	},
      })

  		.state('layout.home', {
  			url: '/',
        views: {
            'header': {
                templateUrl: 'layout/header.html',
                },
            'body@': {
                templateUrl: 'views/home.html',
                controller: 'HomeController',
              },
          },
  		})

}]);