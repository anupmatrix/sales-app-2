'use strict';

angular.module('salesApp.report', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/report', {
    templateUrl: 'report/report.html',
    controller: 'ReportCtrl'
  });
}])

.controller('ReportCtrl', ['$scope','$http',function($scope,$http) {
	$scope.searchFilterOptions = [ "SERVICE ID","SERIAL NUMBER", "PRODUCT NAME","CUSTOMER PHONE", "CUSTOMER NAME"];
	
	$scope.init= function(){
		updateMyLink();
		$scope.selectedFilterOption =$scope.searchFilterOptions[0];
		$scope.errorInSearchOptions = "";
	}

	$scope.searchTextAsPerFilterOption = function(){
		// invoke Search
		$http({
				//method: "POST",
				method: "GET",
				//  url: 'rest/login?v='+(Math.random()),
				  url: 'report/searchOptionForService.json?v='+(Math.random()),
				  data:{"userName":$scope.userNameModel,"password":$scope.userPasswordModel}
				}).then(function successCallback(response) {
				    // this callback will be called asynchronously
					if (response.data.status) {
						 $scope.errorInSearchOptions = "Found "+response.data.searchResults.length+" records";
						 
						 
					}
					else {
						
						 $scope.errorInSearchOptions ="Error in searching.."
					}
					
					console.log(localStorage.getItem("userInfo"));
				    // when the response is available
				  }, function errorCallback(response) {
				    // called asynchronously if an error occurs
				    // or server returns response with an error status.
					  $scope.errorInLogin = "true";
					  $scope.errorInLoginMessage ="Error in Login. Please check the credentials"
				  });

	}


	
}]);