'use strict';
angular.module('salesApp.status', ['ngRoute' , 'smart-table', 'ui.bootstrap'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/status', {
    templateUrl: 'tech-flow/status/tech-status.html',
    controller: 'TechnicianStatusCtrl'
  });
}])
.controller('TechnicianStatusCtrl', ['$scope', '$http', '$uibModal', '$log','Util' ,function($scope, $http, $modal, $log,Util) {

}]);
