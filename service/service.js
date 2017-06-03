'use strict';

angular.module('salesApp.service', ['ngRoute' , 'smart-table', 'ui.bootstrap'])
.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/service', {
    templateUrl: 'service/service.html',
    controller: 'ServiceCtrl'
  });
}])

.controller('ServiceCtrl', ['$scope', '$http', '$uibModal', '$log' , 'customerSearch', 'productSearch' , 
                            'taxService', 'Util', 'Validation', 'customerService',
function($scope, $http, $modal, $log, customerSearch, productSearch, taxService, Util, Validation, customerService) {
    $scope.receiptType = "INVOICE";    
    $scope.taxTypes = taxService.getTaxListService();
    $scope.problemLists = ["Dust In View Finder", "Scratches on Focusing Screen", "Salt Water Damage", "Water Damage", "Fungus in Binocular", "Scratch on Body"];
    $scope.accessoryList= ["AC Cord", "Filter UV", "Memory Card", "USB Cable", "Charger", "Battery", "Body Cap", "Lens Cap Back", "Lens Cap front"];
    $scope.newProblem = "";
    $scope.newAccessory = "";
    $scope.shopUserComment = ""
    $scope.customerComment = "";
    $scope.tentative_quoted_cost = 0.00;
    $scope.formName = "serviveForm";
    $scope.serviceOrderDate = new Date();
    $scope.tentativeServiceCompletionDate = "";
    $scope.isValidProductToAdd = false;
    $scope.serviceResponse = [];
    $scope.serviceDate = new Date();
    $scope.printPage = Util.printPage;
    
    $scope.productReceivedMode = {
           receivedType:'manual', 
           receivedModes:[{name: "Courier", value: "courier"}, {name: "Manual", value: "manual"}]
    };

    var setCurrentProductBlank = function(){
        $scope.curentProduct = {tentative_service_completion_date:"",
                                service_order_date:Util.jsDateConversionFunction($scope.serviceOrderDate), 
                                name: "",  model: "",  sn: "", 
                                tentative_quoted_cost: "", totalPrice:0, taxType:0, taxValue:0, 
                                taxAmmount:0, grandTotal:0 };
        return $scope.curentProduct;
    };
    
    var setProductContainerToPristine = function(){
        $scope.serviveForm.currentProductName.$setUntouched();
        $scope.serviveForm.currentProductModelNumber.$setUntouched();
        $scope.serviveForm.currentProductSerialNumber.$setUntouched();

        $scope.serviveForm.currentProductName.$setPristine();
        $scope.serviveForm.currentProductModelNumber.$setPristine();
        $scope.serviveForm.currentProductSerialNumber.$setPristine();
    };

    var setCurrentProductBlank = function(){
        $scope.curentProduct = {tentative_service_completion_date:"",
                                service_order_date:Util.jsDateConversionFunction($scope.serviceOrderDate), 
                                name: "",  model: "",  sn: "", 
                                tentative_quoted_cost: "", totalPrice:0, taxType:0, taxValue:0, 
                                taxAmmount:0, grandTotal:0 };
        return $scope.curentProduct;
    };
    
    var setProductContainerToPristine = function(){
        $scope.serviveForm.currentProductName.$setUntouched();
        $scope.serviveForm.currentProductModelNumber.$setUntouched();
        $scope.serviveForm.currentProductSerialNumber.$setUntouched();

        $scope.serviveForm.currentProductName.$setPristine();
        $scope.serviveForm.currentProductModelNumber.$setPristine();
        $scope.serviveForm.currentProductSerialNumber.$setPristine();
    };    

    $scope.paymentInfo = {
      paymentType: "cash",
      paymentTypes: [{name: "Cash", value: "cash"},
                    {name: "Card Pyment", value: "card"},
                    {name: "Cheque", value: "cheq"}],
      cardTypes:["RuPay", "VISA", "MaeterCard", "American Express", "Chase", "Discover"],
      cash: {
        amount:0
      },
      card:{
        amount:0,
        bankName:'',
        cardNumber:'',
        expDate:'',
        cardNetwork:'',
        cardBank:''
      },
      cheq:{
        amount:0,
        bankName:'',
        cheqNo:'',
        cheqDate:''
      }
    };
    
    $scope.serviceRequest = {
        problemLists:[],
        accessoryList:[],
        shopUserComment:'',
        customerComment:'',
        tentative_quoted_cost:0.00,
        customerInfo:{
          id: "",
          name: "",
          address: "",
          phone: ""
        },
        productInfo:[],
        service_order_date:Util.jsDateConversionFunction($scope.serviceOrderDate),
        tentative_service_completion_date:Util.jsDateConversionFunction($scope.serviceOrderDate),
        courierInfo: {
            isCourier: false,
            courierName: "",
            courierPhone: "",
            courierDocumentNo: ""
        },
        courierOutwardInfo: {
            isCourier: false,
            courierName: "",
            courierPhone: "",
            courierDocumentNo: ""
        },
        pageMode:'SERVICE_DROP/SERVICE_PICKUP',
        serviceDate: Util.jsDateConversionFunction($scope.serviceDate)
    };
    
    $scope.removeRow = function removeRow(row) {
        var index = $scope.serviceRequest.productInfo.indexOf(row);
        if (index !== -1) {
            $scope.serviceRequest.productInfo.splice(index, 1);
        }
    }

    $scope.isValidCustomerAdd = function(){
        var isValidCustomerForm = false;
        if(!$scope.serviveForm.customerName.$invalid){
            isValidCustomerForm = true;
        }
        return isValidCustomerForm;
    }
    
    $scope.setFocusTo = function(formElementToFocus){
        document.getElementById(formElementToFocus).focus();
    };
    
    $scope.addProduct = function(){
        if(Validation.isNotEmptyStr($scope.curentProduct.name) && Validation.isNotEmptyStr($scope.curentProduct.model) && 
            Validation.isNotEmptyStr($scope.curentProduct.sn)){
            $scope.isValidProductToAdd = true;
        }        
        
        if($scope.isValidProductToAdd === true){
            $scope.serviceRequest.productInfo.push($scope.curentProduct);
            setCurrentProductBlank();
            setProductContainerToPristine();
            $scope.isValidProductToAdd = false;
        }
    };
        
    $scope.isValidProductToAdd = function(){
        var isValid = false;
        if($scope.newProblem.trim() !== "" && $scope.newProblem.trim().length >= 3){
            isValid = true;
        }
        return isValid;
    };
    
    $scope.isValidNewProblem = function(){
        var isValid = false;
        if($scope.newProblem.trim() !== "" && $scope.newProblem.trim().length >= 3){
            isValid = true;
        }
        return isValid;
    };
    
    $scope.isValidNewAccessory = function(){
        var isValid = false;
        if($scope.newAccessory.trim() !== "" && $scope.newAccessory.trim().length >= 3){
            isValid = true;
        }
        return isValid;
    };
    
    $scope.addProblem = function(){
        if($scope.isValidNewProblem()){
            $scope.problemLists.push($scope.newProblem);
            $scope.checkLastProblem($scope.newProblem);
            $scope.newProblem = "";
        }
    };  
   
    $scope.addAccessory = function(){
        if($scope.isValidNewAccessory()){
            $scope.accessoryList.push($scope.newAccessory);
            $scope.checkLastAccessory($scope.newAccessory);
            $scope.newAccessory = "";
        }
    };
    
    $scope.checkLastProblem = function(newProblem) {
        $scope.serviceRequest.problemLists.push(newProblem);
    };    
    
    $scope.checkLastAccessory = function(newAccessory) {
        $scope.serviceRequest.accessoryList.push(newAccessory);
    };    
        
    $scope.customerList = function(val) {
        var custPromise = customerSearch.search(val);
            custPromise.then(function(response){
            return response.data.customerServiceResponseList.map(function(item){
                return item;
            });
        });
    };
   
    $scope.productList = function(val, type) {
        var productPromise = productSearch.search(val);
        productPromise.then(function(response){
             return response.data.singleProductModelList.map(function(item){
                return item;
            });
        });
    };
    
    $scope.isValidProductInfoforAdd = function(){
        var allowAddProduct = false;
        if(!$scope.serviveForm.currentProductName.$invalid  && !$scope.serviveForm.currentProductModelNumber.$invalid && !$scope.serviveForm.currentProductSerialNumber.$invalid){
            allowAddProduct = true;
        }
        return allowAddProduct;
    };
    
    $scope.isValidCustomerAdd = function(){
        var isValidCustomerForm = false;
        if(!$scope[$scope.formName].customerName.$invalid){
            isValidCustomerForm = true;
        }
        return isValidCustomerForm;
    };
    
    $scope.stringify = function(json){
        return JSON.stringify(json);
    }
    
    $scope.performSalesOperation = function(){
        console.log($scope.serviceRequest);
        $scope.serviceRequest.serviceDate = Util.jsDateConversionFunction($scope.serviceDate);
        $scope.serviceRequest.paymentInfo = $scope.paymentInfo;
        customerService.dropProduct().then(function(response){
            $scope.serviceResponse = response.data;
            Util.openPrintPopUp($scope, 'service-drop');
        });
    };
    $scope.reloadPage = function(){
        window.location.reload();
    }
}]);