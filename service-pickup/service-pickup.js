'use strict';

angular.module('salesApp.report', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/service-pickup', {
    templateUrl: 'service-pickup/service-pickup.html',
    controller: 'ServicePickUpController'
  });
}])

.controller('ServicePickUpController', ['$scope','$http', 'Util','$location', function($scope,$http,Util,$location) {
	$scope.searchFilterOptions = [ "SERVICE ID","SERIAL NUMBER", "PRODUCT NAME","CUSTOMER PHONE", "CUSTOMER NAME", "ALL"];
	$scope.searchFilterByOptions=["SEARCH BY TEXT", "SEARCH BY DATE"];
	$scope.selectedFilterOption = $scope.searchFilterOptions[0];
	$scope.searchQueryObject ={};
	$scope.searchServiceByText ="";
	$scope.selectedProductList = {
		"itemsToDeliver" :[
		]
	}
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
		$scope.selectedFilterOption = $scope.searchFilterOptions[0];
		$scope.errorInSearchOptions = "";
		$scope.serviceDateFromModel="";
		$scope.serviceDateTo="";
		$scope.selectedFilterByOption =$scope.searchFilterByOptions[0];
		$scope.serviceSearchCriteriaIncomplete = "";
		$scope.searchServiceByText ="";
		$scope.actualServiceList =[];
		$scope.selectedServiceOrderId ="";
		$scope.itemSelectionError ="";
		$scope.selectedServiceOrderId  ="";


	}

	$scope.toDisableDeliverButton = function(row){
		if ($scope.selectedServiceOrderId === ""){
			return false;
		}


		if ($scope.selectedServiceOrderId !== ""  && row.serviceNumber === $scope.selectedServiceOrderId){
			return false;			
		}
		return true;
		//console.log($scope.selectedProductList.itemsToDeliver);

	}

	$scope.someOrderIsSelectedForDelivery = function(){

			if ($scope.selectedServiceOrderId !== ""){
				return true;
			}
			return false;
	}

	$scope.moveToCustomerDelivery = function(row){
		$scope.itemSelectionError ="";
		
		console.log($scope.selectedProductList.itemsToDeliver);
		var someItemSelected = false;
		for (var i=0;i < row.productInfo.length;i++ ) {
			if ($scope.selectedProductList.itemsToDeliver.indexOf(row.productInfo[i].id) !== -1){
				someItemSelected = true;
				break;
			}
		}
		if (!someItemSelected) {
			$scope.itemSelectionError =" Please Select Item To Deliver";
			return false;
		}
		
		$scope.selectedServiceOrderId = row.serviceNumber
		$scope.selectedServiceOrderDetails = row;
		$location.path( '/service-pickup-final/'+$scope.selectedServiceOrderId+'/'+$scope.selectedProductList.itemsToDeliver.toString() );
		//$scope.selectedProductList.itemsToDeliver - items selected

		
	}

	$scope.filterTextOptionChanged = function(x){
		console.log($scope.selectedFilterOption)	
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
				this.searchQueryObject["query"] = $scope.searchServiceByText;
				this.searchQueryObject["type"] = 'TEXT';
				this.searchQueryObject["col"] = $scope.selectedFilterOption.replace(/\s+/g, '');;
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
			$scope.actualServiceList = [];
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