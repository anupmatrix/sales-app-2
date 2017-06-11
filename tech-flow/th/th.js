'use strict';

angular.module('salesApp.technicianHandle', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/pending', {
    templateUrl: 'tech-flow/th/th.html',
    controller: 'TechnicianHandleJobsController'
  });
}])

.controller('TechnicianHandleJobsController', [function() {
		
}]);