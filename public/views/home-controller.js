angular.module('muktika')
.controller('HomeController', ['$scope','$http','$state', function ($scope, $http, $state) {

	
  $scope.securityDelay = [];
  $scope.taxiDelay = [];
  $scope.cancelledFlights = [];
  $scope.select1 = "";
  $scope.select2 = "";
  $scope.select3 = "";
  var uploadurl = '/test';
  
  $http({
    method: 'GET',
    url: uploadurl
  }).then(function successCallback(response) {
      if(response.data == "Error"){
        alert("Some error occurred. Try again.");
      }else{
       // alert("Process completed! Check result.");
        console.log(response.data.response);
        $scope.securityDelay = response.data.response.securityDelay;
        $scope.taxiDelay = response.data.response.taxiDelay;
        $scope.cancelledFlights = response.data.response.cancelledFlights;
      }
  }, function errorCallback(error) {
    console.log(error);
  });

  $scope.submit1 = function(){
    $http({
            method: 'POST',
            url: '/input1',
            data: {'input1':$scope.select1}
          }).then(function successCallback(response) {
              console.log(response);
              $scope.securityDelay = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });
  }

  $scope.submit2 = function(){
    $http({
            method: 'POST',
            url: '/input2',
            data: {'input2':$scope.select2}
          }).then(function successCallback(response) {
              console.log(response);
              $scope.taxiDelay = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });
  }

  $scope.submit3 = function(){
    $http({
            method: 'POST',
            url: '/input3',
            data: {'input3':$scope.select3}
          }).then(function successCallback(response) {
              console.log(response);
              $scope.cancelledFlights = response.data;
          }, function errorCallback(error) {
            console.log(error);
          });
  }
  // $scope.uploadUrl = function(link) {

  //   if(Boolean(link)){
  //     var uploadurl = '/findUrl';

  //     $http({
  //           method: 'POST',
  //           url: uploadurl,
  //           data: {'link':link}
  //         }).then(function successCallback(response) {
  //             if(response.data == "Error"){
  //               alert("Some error occurred. Try again.");
  //             }else{
  //               alert("Process completed! Check result.");
  //               $scope.showResult=1;
  //               $scope.child = response.data;
  //             }
  //         }, function errorCallback(error) {
  //           console.log(error);
  //         });
  //   }else{
  //     alert("Please Enter Valid URL");
  //   }
    
  // }

  
}]);