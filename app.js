'use strict';

// Declare app level module which depends on views, and components
angular.module('salesApp', [
  'ngRoute',
  'salesApp.view1',
  'salesApp.view2',
  'salesApp.sales',
  'salesApp.repair',
  'salesApp.service',
  'salesApp.report',
  'salesApp.version',
  'salesApp.date',
  'salesApp.modal',
  'ui.bootstrap',
  'smart-table',
  'salesApp.services.customers',
  'salesApp.services.products',
  'salesApp.services.tax',
  'salesApp.services.Util',
  'checklist-model',
  'salesApp.services.validation',
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/sales'});
}]);
