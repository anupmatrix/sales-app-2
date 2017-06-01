'use strict';

// Declare app level module which depends on views, and components
angular.module('salesApp', [
  'ngRoute',
  'salesApp.tech',
  'salesApp.completed',
  'salesApp.version',
  'salesApp.date',
  'salesApp.modal',
  'ui.bootstrap',
  'smart-table'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
	alert("HELLO");
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/myjobs'});
}]);
