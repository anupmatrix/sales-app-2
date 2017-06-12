'use strict';
angular.module('salesApp.status', ['ngRoute' , 'smart-table', 'ui.bootstrap'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/status', {
    templateUrl: 'tech-flow/status/tech-status.html',
    controller: 'TechnicianStatusCtrl'
  });
}])
.controller('TechnicianStatusCtrl', ['$scope', '$http', '$uibModal', '$log','Util' ,function($scope, $http, $modal, $log,Util) {
  
  $scope.init = function(){
    $scope.resetModel();
  }
  $scope.resetModel = function(){
    $scope.statusSearchTextModel = "";
    $scope.itemSelectionError ="";
    $scope.currentJobStatusList=[];
    $scope.statusSearchFilterOptions =  [ "ALL","SERVICE_ID","SERIAL_NUMBER", "PRODUCT_NAME","CUSTOMER_PHONE", "CUSTOMER_NAME"];
    $scope.statusSelectedSearchFilterOptionsModel  =$scope.statusSearchFilterOptions[0];


  }

  $scope.statusSearchTextAsPerFilterOption = function(){


      $http.get('fixture/searchForStatus.json?v='+(Math.random()),{
          params: {
            text: $scope.statusSearchTextModel,
            filter: $scope.statusSelectedSearchFilterOptionsModel
          }
        }).then(function(response){
            $scope.currentJobStatusList = response.data.searchResults;
        });

  }
}]);
