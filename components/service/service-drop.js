angular.module('salesApp.services.repairService', [])
.service('customerService', ['$http',function ($http) {
  this.dropProduct = function () {
       return $http({
          method: 'GET',
          url: 'fixture/service-drop.json',
          params: { filterData: 'Test' },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
       });
  };
}   
])
