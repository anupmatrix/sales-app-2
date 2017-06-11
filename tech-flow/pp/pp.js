'use strict';

angular.module('salesApp.partPending', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/part-pending-jobs', {
    templateUrl: 'tech-flow/pp/pp.html',
    controller: 'PartPendingJobsController'
  });
}])

.controller('PartPendingJobsController', [function() {
		
}]);