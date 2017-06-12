'use strict';
angular.module('salesApp.tech', ['ngRoute' , 'smart-table', 'ui.bootstrap'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/new', {
    templateUrl: 'tech-flow/tech.html',
    controller: 'TechnicianCtrl'
  });
}])
.controller('TechnicianCtrl', ['$scope', '$http', '$uibModal', '$log','Util' ,function($scope, $http, $modal, $log,Util) {

   $scope.searchTextModel = "";
    $scope.searchFilterOptions = [ "ALL","SERVICE ID","SERIAL NUMBER", "PRODUCT NAME","CUSTOMER PHONE", "CUSTOMER NAME"];

    $scope.itemStatusListMap = [ "IN PROGRESS","COMPLETE","PART PENDING", "CANNOT BE REPAIRED"];
    $scope.backendItemStatusMap= {
        "IN PROGRESS" :"IP",
        "COMPLETE" : "C",
        "PART PENDING" :"PP",
         "CANNOT BE REPAIRED" :"CBR"
    }

    $scope.selectedItemStatusListMapModel ="";


    $scope.selectedSearchFilterOptionsModel ="";
    $scope.serviceStatusMapping ={
        "IP":"In Progress",
        "TNS":"Technician Not Started",
        "PP":"Part Pending",
        "CBR":"Cannot be repaired",
        "C":"Complete"
    }

    $scope.init  = function(){
        $scope.searchTextModel = "";
        $scope.selectedSearchFilterOptionsModel = $scope.searchFilterOptions[0];
        $scope.selectedItemForUpdate = undefined;
        $scope.selectedItemStatusListMapModel = $scope.itemStatusListMap[0];
    }

    $scope.searchTextAsPerFilterOption = function(){
        console.log($scope.searchTextModel+" ::: "+$scope.selectedSearchFilterOptionsModel);
        var searchQueryObject={
            "searchText":$scope.searchTextModel,
            "col": $scope.selectedSearchFilterOptionsModel.replace(/\s+/g,'')
        }
        $http({
                //method: "POST",
                method: "GET",
                //  url: 'rest/login?v='+(Math.random()),
                  url: 'service-pickup/searchOptionForService.json?v='+(Math.random()),
                  params:searchQueryObject
                }).then(function successCallback(response) {
                    // this callback will be called asynchronously
                    if (response.data.status) {
                         $scope.actualServiceList =response.data.searchResults;
                    }
                    else {
                        
                         $scope.serviceSearchCriteriaIncomplete ="Error in searching.."
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

    $scope.updateStatusClicked = function(row){
        $scope.selectedItemForUpdate = row;
        Util.openBasicPopUp($scope, 'tech-update');
    } 
    
    
    $scope.statusIsUpdated = function(){
      var domList = document.getElementsByClassName("my-product-info")
      var techCommentDom = document.getElementById("techCommentsIDModal")  ;
      var updatedStatusList=[];
      for(var i=0;i<domList.length;i++){
        updatedStatusList.push({
            'serviceNumber':$scope.selectedItemForUpdate.serviceNumber,
            'itemId':domList[i].getAttribute('my-data'),
            'status':$scope.backendItemStatusMap[(domList[i].value).toUpperCase()],
            "techComment":techCommentDom.value
        });
      }

      if (updatedStatusList.length > 0){
            var searchQueryObject = {
            "updatedProductList":updatedStatusList
             }
               $http({
                method: "POST",
                  url: 'service-pickup/searchOptionForService.json?v='+(Math.random()),
                  data:searchQueryObject
                }).then(function successCallback(response) {
                    if (response.data.status) {
                        window.location.reload();
                    }   
                    else {
                        alert("Error in Updating STATUS")
                    }
                    // when the response is available
                  }, function errorCallback(response) {
                    // called asynchronously if an error occurs
                    // or server returns response with an error status.
                    alert("Error In Updating the STATUS")
                  });
        }
    } 

    $scope.clearSearchCriteria = function(){
        
    }

}]);
