'use strict';
angular.module('salesApp.service', ['ngRoute' , 'smart-table', 'ui.bootstrap'])
.controller('ServiceCtrl', ['$scope', '$http', '$uibModal', '$log' , 'customerSearch', 'productSearch' , 
                            'taxService', 'Util', 'Validation', 'customerService', 'pageMode', '$routeParams', '$timeout', 'customerSearchFactory' ,
function($scope, $http, $modal, $log, customerSearch, productSearch, taxService, Util, Validation, customerService, pageMode, $routeParams, $timeout, customerSearchFactory) {
    console.log(pageMode);
    $scope.receiptType = "INVOICE";    
    $scope.pageMode = pageMode;    
    $scope.taxTypes = taxService.getTaxListService();
    $scope.problemLists = ["Dust In View Finder", "Scratches on Focusing Screen", "Salt Water Damage", "Water Damage", "Fungus in Binocular", "Scratch on Body"];
    $scope.accessoryList= ["AC Cord", "Filter UV", "Memory Card", "USB Cable", "Charger", "Battery", "Body Cap", "Lens Cap Back", "Lens Cap front"];
    $scope.newProblem = "";
    $scope.isValidProductToAdd = false;
    $scope.serviceResponse = [];
    $scope.serviceDate = new Date();
    $scope.serviceOrderDate = new Date();
    
    $scope.printPage = Util.printPage;
    $scope.serviceRequest = {
        selectedProductList:[],
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
        service_order_date:'',
        tentative_service_completion_date:'',
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
        pageMode:pageMode,
        serviceDate: ""
    };
    
    $scope.initServiceDelivery = function(){
        //setDummyProduct();
        //console.log($routeParams);
        $scope.receiptType = "TAX INVOICE";    
        mapHashChangeToMenuUpdate();
        var requestParams = {};
        if($routeParams.serviceId !==undefined){
            requestParams.serviceId = $routeParams.serviceId; 
        }
        if($routeParams.selectedItems !==undefined){
            var selectedItemsArr = $routeParams.selectedItems.split(',');
            if(selectedItemsArr.length > 0){
                requestParams.serviceItems = selectedItemsArr;
            }
        }
        if(requestParams.serviceId){
            customerService.fetchServiceItemsFroDelivery(requestParams).
            then(function(response){
                var data = angular.copy(response.data);
                    $timeout(function () {
                        angular.merge($scope.serviceRequest, data);
                        $scope.serviceRequest.advancePayment = getAdvancePaymentDoneForDrop(data.paymentInfo);
                    });
            });
        }
        
    };
    var resetOtherPaymentTypes = function(paymentInfo){
        if(paymentInfo.paymentType == 'cash'){
            paymentInfo.card = {amount:0, bankName:'', cardNumber:'', expDate:'', cardNetwork:'', cardBank:'' };
            paymentInfo.cheq = {amount:0, bankName:'', cheqNo:'', cheqDate:'' } ;
        }    
        if(paymentInfo.paymentType == 'card'){
            paymentInfo.cash = {amount:0};
            paymentInfo.cheq = {amount:0, bankName:'', cheqNo:'', cheqDate:'' } ;
        }    
        if(paymentInfo.paymentType == 'cheq'){
            paymentInfo.cash = {amount:0};
            paymentInfo.card = {amount:0, bankName:'', cardNumber:'', expDate:'', cardNetwork:'', cardBank:'' };
        }    
    }
    $scope.performServiceDelivery = function(){
        resetOtherPaymentTypes($scope.paymentInfo)
        $scope.serviceRequest.paymentInfo = angular.copy($scope.paymentInfo);
        var postParam = angular.copy($scope.serviceRequest);

        customerService.deliverProduct(postParam).then(function(response){
            $scope.deliverProductResponse = response.data;
            Util.openPrintPopUp($scope, 'service-drop');
        });
    }
    
    
    $scope.calculateReaminingPayment = function(){
        var totalPayment = Util.toDecimalPrecision($scope.paymentInfo.totalCharges);
        var advancePayment = Util.toDecimalPrecision($scope.serviceRequest.advancePayment);
        var remainingAmmount = '';
        if(!isNaN(totalPayment)){
            if(remainingAmmount = totalPayment - advancePayment);
        }
        $scope.paymentInfo.remainingAmmount = remainingAmmount;
        
        if(remainingAmmount > 0){
            $scope.paymentInfo.cash.amount = remainingAmmount;
            $scope.paymentInfo.card.amount = remainingAmmount;
            $scope.paymentInfo.cheq.amount = remainingAmmount;
        }
        
        //console.log(remainingAmmount);
    }
    
    var getAdvancePaymentDoneForDrop = function(data){
        var advancePaymentMade = 0;
            advancePaymentMade += Util.toDecimalPrecision(data.cash.amount || 0);
            advancePaymentMade += Util.toDecimalPrecision(data.card.amount || 0);
            advancePaymentMade += Util.toDecimalPrecision(data.cheq.amount || 0);
        return advancePaymentMade;
    }
    var getPaymentDoneForPickup = function(){
        var advancePaymentMade = 0;
            advancePaymentMade += Util.toDecimalPrecision($scope.serviceRequest.paymentInfo.cash.amount || 0);
            advancePaymentMade += Util.toDecimalPrecision($scope.serviceRequest.paymentInfo.card.amount || 0);
            advancePaymentMade += Util.toDecimalPrecision($scope.serviceRequest.paymentInfo.cheq.amount || 0);
        return advancePaymentMade;
    }
    
    $scope.productLogisticMode = {
           logisticType:'manual', 
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
    
    var setDummyProduct = function(){
        var dummyProduct = {tentative_service_completion_date:"11",
                                service_order_date:Util.jsDateConversionFunction($scope.serviceOrderDate), 
                                name: "11",  model: "22",  sn: "33", 
                                tentative_quoted_cost: "33", totalPrice:0, taxType:0, taxValue:0, 
                                taxAmmount:0, grandTotal:0 };
            dummyProduct.id=11    
            $scope.serviceRequest.productInfo.push(angular.copy(dummyProduct));  
            dummyProduct.id=22    
            $scope.serviceRequest.productInfo.push(angular.copy(dummyProduct)); 
            dummyProduct.id=33            
            $scope.serviceRequest.productInfo.push(angular.copy(dummyProduct));      
            dummyProduct.id=44        
            $scope.serviceRequest.productInfo.push(angular.copy(dummyProduct));                       
    };
    $scope.selectCustomerFrmList = function(value){
        $scope.serviceRequest.customerInfo.name = value.name || '';
        $scope.serviceRequest.customerInfo.id = value.id || null;
        $scope.serviceRequest.customerInfo.phone = value.phone || '';
        $scope.serviceRequest.customerInfo.address = value.address || '';
        $scope.serviceRequest.customerInfo.email = value.email || '';
        $scope.serviceRequest.customerInfo.alternateNo = value.contact2 || '';
    }
    
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
        //document.getElementById(formElementToFocus).focus();
        document.serviveForm[formElementToFocus].focus();
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
        if(typeof $scope.newAccessory ==  'string' && $scope.newAccessory.trim() !== "" && $scope.newAccessory.trim().length >= 3){
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
        //return $http.get('http://10.20.116.112:8080/vogellaRestImpl/rest/customer/serach-customer',{
        return $http.get('fixture/customer.json?text='+(Math.random()),{
          params: {
            text: val
          }
        }).then(function(response){
          return response.data.customerServiceResponseList.map(function(item){
             return item;
          });
        });
    };
   
    $scope.productList = function(val, type) {
        //return $http.get('http://10.20.116.112:8080/vogellaRestImpl/rest/product/search-product',{
        return $http.get('fixture/item-list.json?v='+Math.random(), {
          params: {
            text: val,
            type: type
          }
        }).then(function(response){
             return response.data.singleProductModelList.map(function(item){
                return item;
            });
        });
    };
    $scope.selectProductFrmList = function(value, type){
        $scope.curentProduct.id = value.id || "";
        $scope.curentProduct.name = value.name || '';
        $scope.curentProduct.model = value.model || '';
        
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
        if(!$scope.serviveForm.customerName.$invalid){
            isValidCustomerForm = true;
        }
        return isValidCustomerForm;
    };
    
    $scope.stringify = function(json){
        return JSON.stringify(json);
    }
    
    $scope.performServiceDrop = function(){
        console.log($scope.serviceRequest);
        $scope.serviceRequest.serviceDate = Util.jsDateConversionFunction($scope.serviceDate);
        $scope.serviceRequest.service_order_date = Util.jsDateConversionFunction($scope.serviceOrderDate);
        $scope.serviceRequest.tentative_service_completion_date = Util.jsDateConversionFunction($scope.serviceOrderDate);
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