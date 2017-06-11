'use strict';

angular.module('salesApp.customerApproval', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/customer-approval-jobs', {
    templateUrl: 'tech-flow/ca/ca.html',
    controller: 'CustomerApprovalJobsController'
  });
}])

.controller('CustomerApprovalJobsController', [function() {
		
}]);