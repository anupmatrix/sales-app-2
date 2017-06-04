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
  this.fetchServiceItemsFroDelivery = function (requestParams) {
       return $http({
          method: 'GET',
          url: 'fixture/service-items-delivery.json',
          params: requestParams,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
       });
  };
  this.deliverProduct = function (requestParams) {
       return $http({
          method: 'POST',
          url: 'fixture/items-delivery.json',
          data: requestParams,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
       });
  };
}   
])
