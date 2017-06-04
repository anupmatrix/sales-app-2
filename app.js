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
  'salesApp.services.repairService'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider
  .when('/service', {
        templateUrl: 'service/service.html',
        controller: 'ServiceCtrl',
        resolve: {pageMode: function() { return "SERVICE_DROP"; }}        
    })
    .when('/service-pickup-final/:serviceId/:selectedItems', {
        templateUrl: 'service/servicePickup.html',
        controller: 'ServiceCtrl',
        resolve: {pageMode: function() { return "SERVICE_PICKUP"; }}        
    })
    .when('/service-pickup-final/:serviceId', {
        templateUrl: 'service/servicePickup.html',
        controller: 'ServiceCtrl',
        resolve: {pageMode: function() { return "SERVICE_PICKUP"; }}        
    }).
  
  when('/sales', {
    templateUrl: 'sales/sales.html',
    controller: 'SalesCtrl'
  }).
  otherwise({redirectTo: '/sales'});
}]);
