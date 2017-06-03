'use strict';

angular.module('salesApp.report', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/service-pickup', {
    templateUrl: 'service-pickup/service-pickup.html',
    controller: 'ReportCtrl'
  });
}])

.controller('ReportCtrl', ['$scope','$http', 'Util', function($scope,$http,Util) {
	$scope.searchFilterOptions = [ "SERVICE ID","SERIAL NUMBER", "PRODUCT NAME","CUSTOMER PHONE", "CUSTOMER NAME", "ALL"];
	$scope.searchFilterByOptions=["SEARCH BY TEXT", "SEARCH BY DATE"];
	$scope.searchQueryObject ={};
	$scope.serviceStatusMapping ={
		"IP":"In Progress",
		"TNS":"Technician Not Started",
		"PP":"Part Pending",
		"CBR":"Cannot be repaired",
		"C":"Complete"
	}

	$scope.isValidStateToAddToBill = function(row){
		return !(row.serviceStatus === 'C');
	}
	$scope.init= function(){
		updateMyLink();
		$scope.selectedFilterOption =$scope.searchFilterOptions[0];
		$scope.errorInSearchOptions = "";
		$scope.serviceDateFromModel="";
		$scope.serviceDateTo="";
		$scope.selectedFilterByOption =$scope.searchFilterByOptions[0];
		$scope.serviceSearchCriteriaIncomplete = "";
		$scope.searchServiceByText ="";
		$scope.actualServiceList =[];

	}

	$scope.resetInput = function() {
		$scope.searchQueryObject ={
				"query":"",
				"type":"",
				"col":"",
				"startFrom":"",
				"startTo":""
			}
		this.serviceSearchCriteriaIncomplete = "";

		
	}

	$scope.onFilterByOptionIsChanged = function(){
		this.resetInput();
	}

	$scope.populateQueryObject = function(){
			this.resetInput();
			if (this.selectedFilterByOption === 'SEARCH BY TEXT') {
				
				if(this.searchServiceByText === ''){
					this.serviceSearchCriteriaIncomplete = "Please enter the search text";
				 	return false;
				}
				this.searchQueryObject["query"] = this.searchServiceByText;
				this.searchQueryObject["type"] = 'TEXT';
				this.searchQueryObject["col"] = this.selectedFilterOption;
			}else {
				if ($scope.serviceDateTo === "" || $scope.serviceDateFromModel === "" ) {
					this.serviceSearchCriteriaIncomplete = "Please enter the range date";
				 	return false;
				}
				else {
						this.searchQueryObject["query"] = '';
					this.searchQueryObject["type"] = 'DATE';
					this.searchQueryObject["startFrom"] = Util.jsDateConversionFunction($scope.serviceDateFromModel);
					this.searchQueryObject["startTo"] = Util.jsDateConversionFunction($scope.serviceDateTo);	
				}
				
			}

			return true;
			
			
	}

	$scope.searchTextAsPerFilterOption = function(){

		var b = this.populateQueryObject();
		if (b) {
			$http({
				//method: "POST",
				method: "GET",
				//  url: 'rest/login?v='+(Math.random()),
				  url: 'service-pickup/searchOptionForService.json?v='+(Math.random()),
				  params:this.searchQueryObject
				}).then(function successCallback(response) {
				    // this callback will be called asynchronously
					if (response.data.status) {
						 $scope.errorInSearchOptions = "Found "+response.data.searchResults.length+" records";
						 $scope.actualServiceList =response.data.searchResults;
						 
						 
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
		// invoke Search
		
	}


	
}]);