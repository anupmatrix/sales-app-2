'use strict';

// Declare app level module which depends on views, and components
angular.module('salesApp', [
  'ngRoute',
  'salesApp.tech',
  'salesApp.completed',
  'salesApp.version',
  'salesApp.date',
  'salesApp.modal',
  'salesApp.services.Util',
  'ui.bootstrap',
  'smart-table'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/myjobs'});
}]);
