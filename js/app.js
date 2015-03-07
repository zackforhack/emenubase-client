    'use strict';
    angular.module('mobileCloneDemo', ['mobileClone', 'firebase', 'ngAnimate', 'snap', 'ui.bootstrap.datetimepicker'])
    .config(function ($routeProvider, $locationProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider
            .when("/services", {
                templateUrl: "partials/services.html",
                controller: 'DemoCtrl'
            })
            .when("/categories", {
                templateUrl: "partials/categories.html",
                controller: 'DemoCtrl'
            })
            .when("/items", {
                templateUrl: "partials/items.html",
                controller: 'DemoCtrl'
            })
            .when("/onetouchcall", {
                templateUrl: "partials/onetouchcall.html",
                controller: 'DemoCtrl'
            })

            .when("/companyinfo", {
                templateUrl: "partials/companyinfo.html",
                controller: 'DemoCtrl'
            })

            .when("/hours", {
                templateUrl: "partials/hours.html",
                controller: 'DemoCtrl'
            })

            .when("/foodquality", {
                templateUrl: "partials/foodquality.html",
                controller: 'DemoCtrl'
            })
            // .when("/reservation", {
            //     templateUrl: "emenubase-client/partials/reservation.html",
            //     controller: 'ResCtrl'
            // })

            .when("/about", {
                templateUrl: "partials/about.html",
                controller: 'DemoCtrl'
            })

            .otherwise({
                redirectTo: "/services"
            });
    })
    .controller('DemoCtrl', function ($scope, $pages, $rootScope, $firebase, $location) {
        var about = new Firebase('https://gforgelato.firebaseio.com/About')
        $scope.about = $firebase(about);
        
        var categories = new Firebase('https://gforgelato.firebaseio.com/Category');
        $scope.categories = $firebase(categories);
        
        var menu = new Firebase('https://gforgelato.firebaseio.com/MenuItems');
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
            $pages.next('onetouchcall');
        };

        $scope.chooseCompanyinfo = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('companyinfo');
        };

        $scope.chooseHours = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('hours');
        };

        $scope.chooseFoodquality = function() {
            //$rootScope.serviceChoice = service.name;
            $pages.next('foodquality');
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

        function WeiXinShareBtn() {
    if (typeof WeixinJSBridge == "undefined") {
    alert(" 请先通过微信搜索 wow36kr 添加36氪为好友，通过微信分享文章 :) ");
    } else {
    WeixinJSBridge.invoke(‘shareTimeline‘, {
    "title": "36氪",
    "link": "http://www.36kr.com",
    "desc": " 关注互联网创业 ",
    "img_url": "http://www.36kr.com/assets/images/apple-touch-icon.png"
    });
    };

    } 

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
            if (!$rootScope.myPlate.length || !$scope.telNum || !$scope.clientNname || !$scope.clientAddress)
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
                'tel': $scope.telNum,
                'clientname': $scope.clientNname,
                'clientaddress': $scope.clientAddress,
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

        .controller('CompanyinfoCtrl', function ($scope, $firebase){
        var about = new Firebase('https://gforgelato.firebaseio.com/About');
        $scope.about = $firebase(about);


    })

        .controller('HoursCtrl', function ($scope, $firebase){
        var about = new Firebase('https://gforgelato.firebaseio.com/About');
        $scope.about = $firebase(about);


    })

        .controller('FoodqualityCtrl', function ($scope, $firebase){
        var about = new Firebase('https://gforgelato.firebaseio.com/About');
        $scope.about = $firebase(about);


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
