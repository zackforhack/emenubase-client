    'use strict';
    angular.module('mobileCloneDemo', ['mobileClone', 'firebase', 'ngAnimate', 'snap', 'ui.bootstrap.datetimepicker'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/services", {
                templateUrl: "emenubase-client/partials/services.html",
                controller: 'DemoCtrl'
            })
            .when("/categories", {
                templateUrl: "emenubase-client/partials/categories.html",
                controller: 'DemoCtrl'
            })
            .when("/items", {
                templateUrl: "emenubase-client/partials/items.html",
                controller: 'DemoCtrl'
            })
            .when("/callus", {
                templateUrl: "emenubase-client/partials/callus.html",
                controller: 'BuzzCtrl'
            })
            // .when("/reservation", {
            //     templateUrl: "emenubase-client/partials/reservation.html",
            //     controller: 'ResCtrl'
            // })

            .when("/about", {
                templateUrl: "emenubase-client/partials/about.html",
                controller: 'DemoCtrl'
            })

            .otherwise({
                redirectTo: "/services"
            });
    })
    .controller('DemoCtrl', function ($scope, $pages, $rootScope, $firebase, $location) {
        var menu = new Firebase('https://gforgelato.firebaseio.com/MenuItems');
        var categories = new Firebase('https://gforgelato.firebaseio.com/Category');
        var about = new Firebase('https://gforgelato.firebaseio.com/About')
        menu.on('value', function(dataSnapshot) {
            $scope.menuItems = dataSnapshot.val();
          });
        $scope.menuItemArray = (function() {
            var itemArray = [];
            for(var item in $scope.menuItems) {
                itemArray.push($scope.menuItems[item]);
            }
            return itemArray;
        })();

        $scope.categories = $firebase(categories);
        $scope.about = $firebase(about);
        
        $scope.chooseCategory = function(categ) {
            $rootScope.categoryChoice = categ.name;
            $pages.next('items');
        };

        $scope.addToPlate = function(item){
            $rootScope.$broadcast('addToPlate', item);
        };

        $scope.chooseMenu = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('categories');
        };

        $scope.chooseCallus = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('callus');
        };

        $scope.chooseReservation = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('reservation');
        };

        $scope.chooseAbout = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('about');
        };

        $scope.saveItem = function(item){
        $scope.defaultItem = item;
      }; 

    })
    .controller('OrderCtrl', function ($scope, $firebase, $rootScope, $animate){
        var orders = new Firebase('https://gforgelato.firebaseio.com/Orders');
        $scope.orders = $firebase(orders);

        $rootScope.myPlate = [];
        $scope.orderPlaced = false;
        $scope.myTotal = 0;

        $scope.$on('addToPlate', function(name, item){
            $rootScope.myPlate.push(angular.copy(item));
            $scope.myTotal += item.price;
            $animate.addClass(angular.element(document.querySelector( '#notification' )), 'animate', function(){
                $animate.removeClass(angular.element(document.querySelector( '#notification' )), 'animate');
            });
        });
        $scope.removeFromPlate = function(obj, arr){
            $scope.myTotal -= obj.price;
            arr.splice(arr.indexOf(obj), 1);
        };
        $scope.canOrder = function(){
            if (!$rootScope.myPlate.length || !$scope.tableNum)
                return true;
        };

        $scope.canCheckOut = function(){
            $scope.canSkipConfirm = true;
            if (!$rootScope.myPlate.length)
                return true;
        };


        $scope.order = function(){
            $scope.canSkipConfirm = false;
            var myOrder = {
                'table': $scope.tableNum,
                'order': $rootScope.myPlate,
                'total': $scope.myTotal,
                'confirmed': false
            };
            $scope.orders.$add(angular.fromJson(angular.toJson(myOrder))).then(function(ref) {
                var myPlacedOrder = new Firebase('https://gforgelato.firebaseio.com/Orders/'+ref.name());
                $scope.myPlacedOrder = $firebase(myPlacedOrder);
            });
            $rootScope.myPlate.length = 0;
            $scope.myTotal = 0;
            $scope.orderPlaced = true;
        };
        $scope.orderMore = function(){
            delete $scope.myPlacedOrder;
        };


    })

        .controller('BuzzCtrl', function ($scope, $firebase, $rootScope, $animate){
        var orders = new Firebase('https://gforgelato.firebaseio.com/Orders');
        $scope.orders = $firebase(orders);
        $rootScope.myHelp = [];
        var help = {"category": "Help", "description": "Help", "price": 0, "title": "Help"};
        $rootScope.myHelp.push(angular.copy(help));
        
        $rootScope.BT = {
        Number : null
        }      
        $scope.canBuzz = function(){
            if (!$rootScope.BT.Number)
                return true;
        };

        $scope.buzz = function(){

            var myOrder = {
                'table': $rootScope.BT.Number,
                'order': $rootScope.myHelp,
                'total': 0,
                'confirmed': false
            };
            $scope.orders.$add(angular.fromJson(angular.toJson(myOrder))).then(function(ref) {
                var myPlacedOrder = new Firebase('https://gforgelato.firebaseio.com/Orders/'+ref.name());
                $scope.myPlacedOrder = $firebase(myPlacedOrder);
            });

        };

    })

    //     .controller('ResCtrl', function ($scope, $firebase, $rootScope, $animate){
    //     var reservations = new Firebase('https://gforgelato.firebaseio.com/Reservations');
    //     $scope.reservations = $firebase(reservations);

  
    //     $scope.canRes = function(){
    //         if (!$scope.buzzTableNum)
    //             return true;
    //     };

    //       $rootScope.firstName= {
    //     data : null
    //     } ;
    //       $rootScope.lastName= {
    //     data : null
    //     } ;
    //       $rootScope.teleNum= {
    //     data : null
    //     } ;
    //       $rootScope.data= {
    //     dateDropDownInput : null
    //     } ;   

    //         $scope.res = function(){
            
    //         var myRes = {
    //             'firstName': $rootScope.firstName.data,
    //             'lastName': $rootScope.lastName.data,
    //             'telePhone': $rootScope.teleNum.data,
    //             'time': $rootScope.data,
    //             'confirmed': false
    //         };
    //         $scope.reservations.$add(angular.fromJson(angular.toJson(myRes))).then(function(ref) {
    //             var myPlacedRes = new Firebase('https://gforgelato.firebaseio.com/Reservations/'+ref.name());
    //             $scope.myPlacedRes = $firebase(myPlacedRes);
    //         });
  
    //     };


    // })
    ;
