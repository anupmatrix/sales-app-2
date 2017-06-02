angular.module('salesApp.services.customers', [])
.service('customerSearch', ['$http',function ($http) {
  this.search = function () {
       return $http({
          method: 'GET',
          url: 'fixture/customer.json',
          params: { filterData: 'Test' },
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
       });
  }   
}   
])
