angular.module('salesApp.services.Util', [])
.service('Util', ['$http',function ($http) {
  this.jsDateConversionFunction = function (now) {
      var year = "" + now.getFullYear();
      var month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
      var day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
      var hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
      var minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
      var second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
  };
  
    this.toDecimalPrecision = function(amount, decimalPosition){
        if(decimalPosition == undefined || isNaN(decimalPosition)){
            decimalPosition = 2;
        }
        if(amount){
            amount = parseFloat(amount,10);
            amount = amount.toFixed(decimalPosition);
            amount = parseFloat(amount,10);
        }
        return amount;
    };
    
    this.getTaxValue = function(taxType, taxTypes){
            var taxValue = 0;
            for(var k in taxTypes){
                if(taxTypes[k].name == taxType){
                      taxValue = taxTypes[k].value;
                }
            }
        return taxValue;
    };
    
  
}   
])

