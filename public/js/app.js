angular.module('acerb2b', [
    'ngResource',
    'ui.router',
    'acerb2b.application',
    'acerb2b.shared.directives',
    'acerb2b.shared.filters',
    'ngAnimate',
    'ngMaterial',
    'ngCookies',
    'smart-table'
])
.run(["$rootScope", "$state", "$timeout", "$mdDialog", function($rootScope, $state, $timeout,$mdDialog){

  $rootScope.alertBox = function (options){
    var title = options.title || "Alert";
    var message = options.message || " ";
    var okBtnTxt = options.okText || "Ok";
    $mdDialog.show({
      controller:["$scope", "$mdDialog", function($scope,$mdDialog){
        $scope.close = function(){
          $mdDialog.hide();
        }
      }],
      template: '<md-dialog class="b2b-alertBox" aria-label="Custom Alert">' +
       '<md-toolbar>' +
        '<h2> ' +title+ '</h2>'+
        '</md-toolbar>'+
           '  <md-dialog-content>'+
              message +
            '  </md-dialog-content>'+
           '  <md-dialog-actions>' +
           '    <button ng-click="close()" class="btn-submit">' +
                  okBtnTxt+
           '    </button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
    }).finally(function(){
      if(options.funcOnClose){
        options.funcOnClose();
      }
    });
  }
  $rootScope.confirmBox = function (options){
    var title = options.title || "Confirm";
    var message = options.message || " ";
    var cancelBtnTxt = options.cancelLabel || "Cancel";
    var confirmBtnTxt = options.confirmLabel || "Confirm";
    $mdDialog.show({
      controller:["$scope", "$mdDialog", function($scope,$mdDialog){
        $scope.close = function(){
          $mdDialog.cancel();
        }
        $scope.confirm = function(){
          $mdDialog.hide();
        }
      }],
      template: '<md-dialog class="b2b-alertBox" aria-label="Custom Confirm">' +
       '<md-toolbar>' +
        '<h2> ' +title+ '</h2>'+
        '</md-toolbar>'+
           '  <md-dialog-content>'+
              message +
            '  </md-dialog-content>'+
           '  <md-dialog-actions>' +
           '    <button class="confirmCancelBtn btn-cancel" ng-click="close()">' +
                  cancelBtnTxt +
           '    </button>' +
           '    <button class="btn-submit" ng-click="confirm()">' +
                confirmBtnTxt +
           '    </button>' +
           '  </md-dialog-actions>' +
           '</md-dialog>',
    }).then(function(){
      if(options.funcOnConfirm){
        options.funcOnConfirm();
      }
    });
  }
  var dialogTime = [];
  $rootScope.errorBox = function(msg){
      var dialogOption = {
          type: 'W',
          message: 'ERROR: ' + msg,
      }
      dialogBox(dialogOption);
  }
  $rootScope.infoBox = function(msg){
      var dialogOption = {
          type: 'I',
          message: msg,
      }
      dialogBox(dialogOption);
  }
  var dialogBox = function(options){
      var type = options.type || " "; //I or W(Information / Warning)
      var message = options.message || " ";
      
      $rootScope.showDialog = true;
      $rootScope.showDialogType = type;
      $rootScope.showDialogMsg = message;
      
      $timeout.cancel(dialogTime);
      dialogTime = $timeout(
          function (){ 
              $rootScope.showDialog = false;
          }, 
          3000
      );
  }

}])
.constant
("b2bConfig",{
  "API_URL":"https://www.devtot.ctbg.acer.com/api/",
  "PARTNER":"acers"
});
angular.module('acerb2b.application', []);
angular.module("acerb2b.shared.directives",[]);
angular.module('acerb2b.shared.filters',[]);
angular.module("acerb2b.shared.services",[]);
'use strict';

angular.module('acerb2b.application').directive('appcardView',["$window", function($window){
	return {
		restrict:'EA',
		scope:{
			carddata:'=',
			index:'@'
		},
		template:"<div class='b2b-cardView'><div><img class='b2b-cardIcon' lazy-img='images/img_application_default.png'></div><h2 class='cardViewName'><a ui-sref='applicationHistory({appId:carddata.appId})' pg-clamp='2'>{{carddata.name}}</a></h2><table><tbody><tr><td>{{$root.lang.S_02810}}{{carddata.createDate}}</td></tr><tr><td>{{$root.lang.S_00026}}: {{carddata.platform}}</td></tr><tr><td>{{$root.lang.S_00421}}: {{$root.lang[carddata.status]}}</td></tr></tbody></table></div>",
		link:function(scope,element,attrs){
		}
	}
}]);
angular.module('acerb2b.application')
.controller('ApplicationController', ["$rootScope", "$scope", "$mdDialog", "ApplicationService", "b2bConfig", function ($rootScope, $scope,$mdDialog, ApplicationService,b2bConfig) {

    var appCtrl = this;
    appCtrl.appList = [];

    appCtrl.getApplicationList = function(){
        ApplicationService.applicationApi.get({partnerId:b2bConfig.PARTNER}).$promise.then(function(response){
            appCtrl.appList = response.appList;
        },function(failed){
            $rootScope.errorBox("something wrong happpened"); 
        });
    }

    appCtrl.appCreate = function(ev){
        $mdDialog.show({
             parent: angular.element(document.body),
             targetEvent: ev,
             templateUrl: 'view/application/applicationCreate.html',
             controller: 'AppCreateController',
             controllerAs : 'apCtrl',
             onRemoving:function(){
                appCtrl.getApplicationList();
             }
          });

    }

     appCtrl.getApplicationList();
    
}]);
angular.module('acerb2b.application')
.controller('AppCreateController', ["$scope", "$log", "$rootScope", "$mdDialog", "ApplicationService", "b2bConfig", function ($scope, $log, $rootScope, $mdDialog,ApplicationService,b2bConfig) {
    
    var createCtrl = this;
    createCtrl.id = '';
    createCtrl.onCancel = function(){
		$mdDialog.hide();
	}

	
	createCtrl.createApplication = function(){ 
		var newApplicationObject = {
			"partnerId":b2bConfig.PARTNER,
			"appName":createCtrl.name,
			"appSummary":createCtrl.description,
			"platformName":createCtrl.platform
		}
		ApplicationService.applicationApi.create(newApplicationObject).$promise.then(function(result){
			$mdDialog.hide();
			$rootScope.alertBox({title:"Application",message:"Application Created Successfully"}); 
			
		},function(failed){
			$rootScope.errorBox("something wrong happpened"); 
		});;

	}
}]);
angular.module('acerb2b.application')
.controller('AppDetailsController',["$scope", "$stateParams", "$state", "$log", "$rootScope", "ApplicationService", "$mdDialog", function ($scope, $stateParams, $state, $log, $rootScope, ApplicationService,$mdDialog) {
 
 	var detailsCtrl = this;
 	detailsCtrl.appDetails  = $stateParams;	
 	$scope.columnsInfo = {

			"columnsDef":[
				{
					'header':'Version',
					'field':'appVersionName',
					'sortable':true,
					'width':'30%'

				},{
					'header':'Size',
					'field' : 'contentSizeBytes',
					'sortable':true,
					'width':'30%'

				},{
					'header':'Released',
					'field':'releasedDate',
					'sortable':false,
					'width':'40%'
				},{
					'header':'',
					'field':'download',
					'sortable':false,
					'width':'40%'
				},{
					'header':'',
					'field':'',
					'template':'expand'
				}
			],
            "defaultPredicate":'appVersionName',
            "defaultReverse": false 
	}

	detailsCtrl.getAppVersionsData = function(){
		ApplicationService.appVersionApi.get().$promise.then(function(response){
			$scope.columnsInfo.data = response.appVersionList;
		},function(failed){
			debugger;
		})
	}

	detailsCtrl.versionCreate = function(ev){
        $mdDialog.show({
        	locals:{versionData: detailsCtrl.appDetails},
             parent: angular.element(document.body),
             targetEvent: ev,
             templateUrl: 'view/application/applicationVersion.html',
             controller: 'AppVerController',
             controllerAs : 'apVerCtrl',
             onRemoving:function(){
                detailsCtrl.getAppVersionsData();
             }
          });

    }

	detailsCtrl.getAppVersionsData();
 }]);


angular.module('acerb2b.application')
.factory('ApplicationService', ["$resource", "b2bConfig", function ($resource,b2bConfig) {
	var appService = {};

	appService.applicationApi = $resource(b2bConfig.API_URL +'v1/apps',{},{
		create:{
			method:'POST'
			}
	});

	appService.appVersionApi = $resource('data/appVersions.json');

	return appService;
}]);
angular.module('acerb2b.application')
.controller('AppVerController', ["$scope", "$log", "$rootScope", "$mdDialog", "ApplicationService", "b2bConfig", "versionData", function ($scope, $log, $rootScope, $mdDialog,ApplicationService,b2bConfig,versionData) {
    
    var verCtrl = this;
    verCtrl.onCancel = function(){
		$mdDialog.hide();
	}
	verCtrl.appImportance = "NORMAL";

	
	verCtrl.createVersion = function(){ 
		var newApplicationObject = {
			"partnerId":b2bConfig.PARTNER,
			"appName":verCtrl.name,
			"appSummary":verCtrl.description,
			"platformName":verCtrl.platform
		}
		ApplicationService.applicationApi.create(newApplicationObject).$promise.then(function(result){
			$mdDialog.hide();
			$rootScope.alertBox({title:"Application",message:"V Created Successfully"}); 
			
		},function(failed){
			$rootScope.errorBox("something wrong happpened"); 
		});;

	}
}]);
angular.module('acerb2b')
.controller('MainController',["$rootScope", "$location", "$state", function ($rootScope, $location, $state){

}]);                   

angular.module('acerb2b')
.config(["$urlRouterProvider", "$stateProvider", "$locationProvider", function($urlRouterProvider, $stateProvider, $locationProvider){
    
	$urlRouterProvider.otherwise('/');
    
	$stateProvider
    .state('/',{
        url:'/'
    })
    //======================login state======================
	.state('login', {
		url:'/login',
		templateUrl:'view/login/login.html',
	})
	//======================Applications state================
	.state('application', {
		url:'/application',
        titleName:'Application',
		templateUrl:'view/application/application.html'
	})
	.state('createApplication', {
		url:'/NewApplication',
        titleName:'Application',
		templateUrl:'view/application/applicationCreate.html'
	})
	.state('applicationHistory', {
		url:'/applicationDetails/:appName',
        titleName:'Application',
		templateUrl:'view/application/applicationDetails.html',
		params :{
			appName:'',
			appId:'',
			appSummary:'',
			platformName:''
		}
	});
}])



angular.module('acerb2b.shared.directives')
.directive('listView', function () {
    return {
        restrict: 'EA',
        templateUrl: "view/shared/listView.html",
        scope:false,
        link: function (scope, element, attrs) {
            debugger;
            scope.reverse = scope.columnsInfo.defaultReverse;
            scope.predicate = scope.columnsInfo.defaultPredicate;
            
            scope.order = function(predicate) {
                scope.reverse = (scope.predicate === predicate) ? !scope.reverse : false;
                scope.predicate = predicate;
            };
            scope.$watch(
                function (scope) {
                    if (!scope.columnsInfo) {
                        return;
                    }
                    return scope.columnsInfo.data;
                },
                function (newValue, oldValue) {
                    if (newValue) {
                        scope.rowCollection = newValue;
                        scope.displayedCollection = [].concat(newValue);
                    }
                }
            );

            scope.$watch('$root.lang', function (newValue, oldValue) {
                if (!scope.columnsInfo) {
                    return;
                }
                var columnsDef = scope.columnsInfo.columnsDef;
                for (var i in columnsDef) {
                    if (columnsDef[i].header == "") continue;
                    for (var name in oldValue) {
                        if (oldValue[name] == columnsDef[i].header) {
                            columnsDef[i].header = newValue[name];
                        }
                    }
                }
            })
        }
    }
});
'use strict';

angular.module('acerb2b.shared.filters')
.filter('unsafe',["$sce", function($sce){
	return $sce.trustAsHtml;
}])
.filter("sceTrustHtml",["$sce", function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
}]);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFjZXJCMmJNb2R1bGUuanMiLCJhcHBsaWNhdGlvbi9hcHBsaWNhdGlvbk1vZHVsZS5qcyIsInNoYXJlZC9kaXJlY3RpdmVzL2RpcmVjdGl2ZXNNb2R1bGUuanMiLCJzaGFyZWQvZmlsdGVycy9maWx0ZXJzTW9kdWxlLmpzIiwic2hhcmVkL3NlcnZpY2VzL3NlcnZpY2VzTW9kdWxlLmpzIiwiYXBwbGljYXRpb24vYXBwbGljYXRpb25DYXJkVmlld0RpcmVjdGl2ZS5qcyIsImFwcGxpY2F0aW9uL2FwcGxpY2F0aW9uQ29udHJvbGxlci5qcyIsImFwcGxpY2F0aW9uL2FwcGxpY2F0aW9uQ3JlYXRlQ29udHJvbGxlci5qcyIsImFwcGxpY2F0aW9uL2FwcGxpY2F0aW9uRGV0YWlsc0NvbnRyb2xsZXIuanMiLCJhcHBsaWNhdGlvbi9hcHBsaWNhdGlvblNlcnZpY2UuanMiLCJhcHBsaWNhdGlvbi9hcHBsaWNhdGlvblZlcnNpb25Db250cm9sbGVyLmpzIiwic2hhcmVkL2FjZXJCMmJNYWluQ29udHJvbGxlci5qcyIsInNoYXJlZC9hY2VyQjJiUm91dGVzLmpzIiwic2hhcmVkL2RpcmVjdGl2ZXMvbGlzdFZpZXdEaXJlY3RpdmUuanMiLCJzaGFyZWQvZmlsdGVycy9maWx0ZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLFFBQUEsT0FBQSxXQUFBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBO0lBQ0E7SUFDQTtJQUNBOztDQUVBLHNEQUFBLFNBQUEsWUFBQSxRQUFBLFNBQUEsVUFBQTs7RUFFQSxXQUFBLFdBQUEsVUFBQSxRQUFBO0lBQ0EsSUFBQSxRQUFBLFFBQUEsU0FBQTtJQUNBLElBQUEsVUFBQSxRQUFBLFdBQUE7SUFDQSxJQUFBLFdBQUEsUUFBQSxVQUFBO0lBQ0EsVUFBQSxLQUFBO01BQ0EsbUNBQUEsU0FBQSxPQUFBLFVBQUE7UUFDQSxPQUFBLFFBQUEsVUFBQTtVQUNBLFVBQUE7OztNQUdBLFVBQUE7T0FDQTtRQUNBLFNBQUEsT0FBQTtRQUNBO1dBQ0E7Y0FDQTtZQUNBO1dBQ0E7V0FDQTtrQkFDQTtXQUNBO1dBQ0E7V0FDQTtPQUNBLFFBQUEsVUFBQTtNQUNBLEdBQUEsUUFBQSxZQUFBO1FBQ0EsUUFBQTs7OztFQUlBLFdBQUEsYUFBQSxVQUFBLFFBQUE7SUFDQSxJQUFBLFFBQUEsUUFBQSxTQUFBO0lBQ0EsSUFBQSxVQUFBLFFBQUEsV0FBQTtJQUNBLElBQUEsZUFBQSxRQUFBLGVBQUE7SUFDQSxJQUFBLGdCQUFBLFFBQUEsZ0JBQUE7SUFDQSxVQUFBLEtBQUE7TUFDQSxtQ0FBQSxTQUFBLE9BQUEsVUFBQTtRQUNBLE9BQUEsUUFBQSxVQUFBO1VBQ0EsVUFBQTs7UUFFQSxPQUFBLFVBQUEsVUFBQTtVQUNBLFVBQUE7OztNQUdBLFVBQUE7T0FDQTtRQUNBLFNBQUEsT0FBQTtRQUNBO1dBQ0E7Y0FDQTtZQUNBO1dBQ0E7V0FDQTtrQkFDQTtXQUNBO1dBQ0E7Z0JBQ0E7V0FDQTtXQUNBO1dBQ0E7T0FDQSxLQUFBLFVBQUE7TUFDQSxHQUFBLFFBQUEsY0FBQTtRQUNBLFFBQUE7Ozs7RUFJQSxJQUFBLGFBQUE7RUFDQSxXQUFBLFdBQUEsU0FBQSxJQUFBO01BQ0EsSUFBQSxlQUFBO1VBQ0EsTUFBQTtVQUNBLFNBQUEsWUFBQTs7TUFFQSxVQUFBOztFQUVBLFdBQUEsVUFBQSxTQUFBLElBQUE7TUFDQSxJQUFBLGVBQUE7VUFDQSxNQUFBO1VBQ0EsU0FBQTs7TUFFQSxVQUFBOztFQUVBLElBQUEsWUFBQSxTQUFBLFFBQUE7TUFDQSxJQUFBLE9BQUEsUUFBQSxRQUFBO01BQ0EsSUFBQSxVQUFBLFFBQUEsV0FBQTs7TUFFQSxXQUFBLGFBQUE7TUFDQSxXQUFBLGlCQUFBO01BQ0EsV0FBQSxnQkFBQTs7TUFFQSxTQUFBLE9BQUE7TUFDQSxhQUFBO1VBQ0EsV0FBQTtjQUNBLFdBQUEsYUFBQTs7VUFFQTs7Ozs7Q0FLQTtDQUNBLFlBQUE7RUFDQSxVQUFBO0VBQ0EsVUFBQTs7QUNsSEEsUUFBQSxPQUFBLHVCQUFBO0FDQUEsUUFBQSxPQUFBLDRCQUFBO0FDQUEsUUFBQSxPQUFBLHlCQUFBO0FDQUEsUUFBQSxPQUFBLDBCQUFBO0FDQUE7O0FBRUEsUUFBQSxPQUFBLHVCQUFBLFVBQUEsMEJBQUEsU0FBQSxRQUFBO0NBQ0EsT0FBQTtFQUNBLFNBQUE7RUFDQSxNQUFBO0dBQ0EsU0FBQTtHQUNBLE1BQUE7O0VBRUEsU0FBQTtFQUNBLEtBQUEsU0FBQSxNQUFBLFFBQUEsTUFBQTs7OztBQ1ZBLFFBQUEsT0FBQTtDQUNBLFdBQUEsa0dBQUEsVUFBQSxZQUFBLE9BQUEsV0FBQSxtQkFBQSxXQUFBOztJQUVBLElBQUEsVUFBQTtJQUNBLFFBQUEsVUFBQTs7SUFFQSxRQUFBLHFCQUFBLFVBQUE7UUFDQSxtQkFBQSxlQUFBLElBQUEsQ0FBQSxVQUFBLFVBQUEsVUFBQSxTQUFBLEtBQUEsU0FBQSxTQUFBO1lBQ0EsUUFBQSxVQUFBLFNBQUE7VUFDQSxTQUFBLE9BQUE7WUFDQSxXQUFBLFNBQUE7Ozs7SUFJQSxRQUFBLFlBQUEsU0FBQSxHQUFBO1FBQ0EsVUFBQSxLQUFBO2FBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQTthQUNBLGFBQUE7YUFDQSxhQUFBO2FBQ0EsWUFBQTthQUNBLGVBQUE7YUFDQSxXQUFBLFVBQUE7Z0JBQ0EsUUFBQTs7Ozs7O0tBTUEsUUFBQTs7O0FDNUJBLFFBQUEsT0FBQTtDQUNBLFdBQUEsd0dBQUEsVUFBQSxRQUFBLE1BQUEsWUFBQSxVQUFBLG1CQUFBLFdBQUE7O0lBRUEsSUFBQSxhQUFBO0lBQ0EsV0FBQSxLQUFBO0lBQ0EsV0FBQSxXQUFBLFVBQUE7RUFDQSxVQUFBOzs7O0NBSUEsV0FBQSxvQkFBQSxVQUFBO0VBQ0EsSUFBQSx1QkFBQTtHQUNBLFlBQUEsVUFBQTtHQUNBLFVBQUEsV0FBQTtHQUNBLGFBQUEsV0FBQTtHQUNBLGVBQUEsV0FBQTs7RUFFQSxtQkFBQSxlQUFBLE9BQUEsc0JBQUEsU0FBQSxLQUFBLFNBQUEsT0FBQTtHQUNBLFVBQUE7R0FDQSxXQUFBLFNBQUEsQ0FBQSxNQUFBLGNBQUEsUUFBQTs7SUFFQSxTQUFBLE9BQUE7R0FDQSxXQUFBLFNBQUE7S0FDQTs7OztBQ3ZCQSxRQUFBLE9BQUE7Q0FDQSxXQUFBLHFIQUFBLFVBQUEsUUFBQSxjQUFBLFFBQUEsTUFBQSxZQUFBLG1CQUFBLFdBQUE7O0VBRUEsSUFBQSxjQUFBO0VBQ0EsWUFBQSxjQUFBO0VBQ0EsT0FBQSxjQUFBOztHQUVBLGFBQUE7SUFDQTtLQUNBLFNBQUE7S0FDQSxRQUFBO0tBQ0EsV0FBQTtLQUNBLFFBQUE7O01BRUE7S0FDQSxTQUFBO0tBQ0EsVUFBQTtLQUNBLFdBQUE7S0FDQSxRQUFBOztNQUVBO0tBQ0EsU0FBQTtLQUNBLFFBQUE7S0FDQSxXQUFBO0tBQ0EsUUFBQTtNQUNBO0tBQ0EsU0FBQTtLQUNBLFFBQUE7S0FDQSxXQUFBO0tBQ0EsUUFBQTtNQUNBO0tBQ0EsU0FBQTtLQUNBLFFBQUE7S0FDQSxXQUFBOzs7WUFHQSxtQkFBQTtZQUNBLGtCQUFBOzs7Q0FHQSxZQUFBLHFCQUFBLFVBQUE7RUFDQSxtQkFBQSxjQUFBLE1BQUEsU0FBQSxLQUFBLFNBQUEsU0FBQTtHQUNBLE9BQUEsWUFBQSxPQUFBLFNBQUE7SUFDQSxTQUFBLE9BQUE7R0FDQTs7OztDQUlBLFlBQUEsZ0JBQUEsU0FBQSxHQUFBO1FBQ0EsVUFBQSxLQUFBO1NBQ0EsT0FBQSxDQUFBLGFBQUEsWUFBQTthQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUE7YUFDQSxhQUFBO2FBQ0EsYUFBQTthQUNBLFlBQUE7YUFDQSxlQUFBO2FBQ0EsV0FBQSxVQUFBO2dCQUNBLFlBQUE7Ozs7OztDQU1BLFlBQUE7Ozs7QUMvREEsUUFBQSxPQUFBO0NBQ0EsUUFBQSxpREFBQSxVQUFBLFVBQUEsV0FBQTtDQUNBLElBQUEsYUFBQTs7Q0FFQSxXQUFBLGlCQUFBLFVBQUEsVUFBQSxTQUFBLFVBQUEsR0FBQTtFQUNBLE9BQUE7R0FDQSxPQUFBOzs7O0NBSUEsV0FBQSxnQkFBQSxVQUFBOztDQUVBLE9BQUE7O0FDWkEsUUFBQSxPQUFBO0NBQ0EsV0FBQSxvSEFBQSxVQUFBLFFBQUEsTUFBQSxZQUFBLFVBQUEsbUJBQUEsVUFBQSxhQUFBOztJQUVBLElBQUEsVUFBQTtJQUNBLFFBQUEsV0FBQSxVQUFBO0VBQ0EsVUFBQTs7Q0FFQSxRQUFBLGdCQUFBOzs7Q0FHQSxRQUFBLGdCQUFBLFVBQUE7RUFDQSxJQUFBLHVCQUFBO0dBQ0EsWUFBQSxVQUFBO0dBQ0EsVUFBQSxRQUFBO0dBQ0EsYUFBQSxRQUFBO0dBQ0EsZUFBQSxRQUFBOztFQUVBLG1CQUFBLGVBQUEsT0FBQSxzQkFBQSxTQUFBLEtBQUEsU0FBQSxPQUFBO0dBQ0EsVUFBQTtHQUNBLFdBQUEsU0FBQSxDQUFBLE1BQUEsY0FBQSxRQUFBOztJQUVBLFNBQUEsT0FBQTtHQUNBLFdBQUEsU0FBQTtLQUNBOzs7O0FDdkJBLFFBQUEsT0FBQTtDQUNBLFdBQUEsdURBQUEsVUFBQSxZQUFBLFdBQUEsT0FBQTs7OztBQ0RBLFFBQUEsT0FBQTtDQUNBLHFFQUFBLFNBQUEsb0JBQUEsZ0JBQUEsa0JBQUE7O0NBRUEsbUJBQUEsVUFBQTs7Q0FFQTtLQUNBLE1BQUEsSUFBQTtRQUNBLElBQUE7OztFQUdBLE1BQUEsU0FBQTtFQUNBLElBQUE7RUFDQSxZQUFBOzs7RUFHQSxNQUFBLGVBQUE7RUFDQSxJQUFBO1FBQ0EsVUFBQTtFQUNBLFlBQUE7O0VBRUEsTUFBQSxxQkFBQTtFQUNBLElBQUE7UUFDQSxVQUFBO0VBQ0EsWUFBQTs7RUFFQSxNQUFBLHNCQUFBO0VBQ0EsSUFBQTtRQUNBLFVBQUE7RUFDQSxZQUFBO0VBQ0EsUUFBQTtHQUNBLFFBQUE7R0FDQSxNQUFBO0dBQ0EsV0FBQTtHQUNBLGFBQUE7Ozs7Ozs7QUNqQ0EsUUFBQSxPQUFBO0NBQ0EsVUFBQSxZQUFBLFlBQUE7SUFDQSxPQUFBO1FBQ0EsVUFBQTtRQUNBLGFBQUE7UUFDQSxNQUFBO1FBQ0EsTUFBQSxVQUFBLE9BQUEsU0FBQSxPQUFBO1lBQ0E7WUFDQSxNQUFBLFVBQUEsTUFBQSxZQUFBO1lBQ0EsTUFBQSxZQUFBLE1BQUEsWUFBQTs7WUFFQSxNQUFBLFFBQUEsU0FBQSxXQUFBO2dCQUNBLE1BQUEsVUFBQSxDQUFBLE1BQUEsY0FBQSxhQUFBLENBQUEsTUFBQSxVQUFBO2dCQUNBLE1BQUEsWUFBQTs7WUFFQSxNQUFBO2dCQUNBLFVBQUEsT0FBQTtvQkFDQSxJQUFBLENBQUEsTUFBQSxhQUFBO3dCQUNBOztvQkFFQSxPQUFBLE1BQUEsWUFBQTs7Z0JBRUEsVUFBQSxVQUFBLFVBQUE7b0JBQ0EsSUFBQSxVQUFBO3dCQUNBLE1BQUEsZ0JBQUE7d0JBQ0EsTUFBQSxzQkFBQSxHQUFBLE9BQUE7Ozs7O1lBS0EsTUFBQSxPQUFBLGNBQUEsVUFBQSxVQUFBLFVBQUE7Z0JBQ0EsSUFBQSxDQUFBLE1BQUEsYUFBQTtvQkFDQTs7Z0JBRUEsSUFBQSxhQUFBLE1BQUEsWUFBQTtnQkFDQSxLQUFBLElBQUEsS0FBQSxZQUFBO29CQUNBLElBQUEsV0FBQSxHQUFBLFVBQUEsSUFBQTtvQkFDQSxLQUFBLElBQUEsUUFBQSxVQUFBO3dCQUNBLElBQUEsU0FBQSxTQUFBLFdBQUEsR0FBQSxRQUFBOzRCQUNBLFdBQUEsR0FBQSxTQUFBLFNBQUE7Ozs7Ozs7O0FDdkNBOztBQUVBLFFBQUEsT0FBQTtDQUNBLE9BQUEsa0JBQUEsU0FBQSxLQUFBO0NBQ0EsT0FBQSxLQUFBOztDQUVBLE9BQUEsd0JBQUEsU0FBQSxNQUFBO0VBQ0EsT0FBQSxTQUFBLFNBQUE7SUFDQSxPQUFBLEtBQUEsWUFBQTs7SUFFQSIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJhbmd1bGFyLm1vZHVsZSgnYWNlcmIyYicsIFtcbiAgICAnbmdSZXNvdXJjZScsXG4gICAgJ3VpLnJvdXRlcicsXG4gICAgJ2FjZXJiMmIuYXBwbGljYXRpb24nLFxuICAgICdhY2VyYjJiLnNoYXJlZC5kaXJlY3RpdmVzJyxcbiAgICAnYWNlcmIyYi5zaGFyZWQuZmlsdGVycycsXG4gICAgJ25nQW5pbWF0ZScsXG4gICAgJ25nTWF0ZXJpYWwnLFxuICAgICduZ0Nvb2tpZXMnLFxuICAgICdzbWFydC10YWJsZSdcbl0pXG4ucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICRzdGF0ZSwgJHRpbWVvdXQsJG1kRGlhbG9nKXtcblxuICAkcm9vdFNjb3BlLmFsZXJ0Qm94ID0gZnVuY3Rpb24gKG9wdGlvbnMpe1xuICAgIHZhciB0aXRsZSA9IG9wdGlvbnMudGl0bGUgfHwgXCJBbGVydFwiO1xuICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IFwiIFwiO1xuICAgIHZhciBva0J0blR4dCA9IG9wdGlvbnMub2tUZXh0IHx8IFwiT2tcIjtcbiAgICAkbWREaWFsb2cuc2hvdyh7XG4gICAgICBjb250cm9sbGVyOmZ1bmN0aW9uKCRzY29wZSwkbWREaWFsb2cpe1xuICAgICAgICAkc2NvcGUuY2xvc2UgPSBmdW5jdGlvbigpe1xuICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICB0ZW1wbGF0ZTogJzxtZC1kaWFsb2cgY2xhc3M9XCJiMmItYWxlcnRCb3hcIiBhcmlhLWxhYmVsPVwiQ3VzdG9tIEFsZXJ0XCI+JyArXG4gICAgICAgJzxtZC10b29sYmFyPicgK1xuICAgICAgICAnPGgyPiAnICt0aXRsZSsgJzwvaDI+JytcbiAgICAgICAgJzwvbWQtdG9vbGJhcj4nK1xuICAgICAgICAgICAnICA8bWQtZGlhbG9nLWNvbnRlbnQ+JytcbiAgICAgICAgICAgICAgbWVzc2FnZSArXG4gICAgICAgICAgICAnICA8L21kLWRpYWxvZy1jb250ZW50PicrXG4gICAgICAgICAgICcgIDxtZC1kaWFsb2ctYWN0aW9ucz4nICtcbiAgICAgICAgICAgJyAgICA8YnV0dG9uIG5nLWNsaWNrPVwiY2xvc2UoKVwiIGNsYXNzPVwiYnRuLXN1Ym1pdFwiPicgK1xuICAgICAgICAgICAgICAgICAgb2tCdG5UeHQrXG4gICAgICAgICAgICcgICAgPC9idXR0b24+JyArXG4gICAgICAgICAgICcgIDwvbWQtZGlhbG9nLWFjdGlvbnM+JyArXG4gICAgICAgICAgICc8L21kLWRpYWxvZz4nLFxuICAgIH0pLmZpbmFsbHkoZnVuY3Rpb24oKXtcbiAgICAgIGlmKG9wdGlvbnMuZnVuY09uQ2xvc2Upe1xuICAgICAgICBvcHRpb25zLmZ1bmNPbkNsb3NlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgJHJvb3RTY29wZS5jb25maXJtQm94ID0gZnVuY3Rpb24gKG9wdGlvbnMpe1xuICAgIHZhciB0aXRsZSA9IG9wdGlvbnMudGl0bGUgfHwgXCJDb25maXJtXCI7XG4gICAgdmFyIG1lc3NhZ2UgPSBvcHRpb25zLm1lc3NhZ2UgfHwgXCIgXCI7XG4gICAgdmFyIGNhbmNlbEJ0blR4dCA9IG9wdGlvbnMuY2FuY2VsTGFiZWwgfHwgXCJDYW5jZWxcIjtcbiAgICB2YXIgY29uZmlybUJ0blR4dCA9IG9wdGlvbnMuY29uZmlybUxhYmVsIHx8IFwiQ29uZmlybVwiO1xuICAgICRtZERpYWxvZy5zaG93KHtcbiAgICAgIGNvbnRyb2xsZXI6ZnVuY3Rpb24oJHNjb3BlLCRtZERpYWxvZyl7XG4gICAgICAgICRzY29wZS5jbG9zZSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgICAgJG1kRGlhbG9nLmNhbmNlbCgpO1xuICAgICAgICB9XG4gICAgICAgICRzY29wZS5jb25maXJtID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xuICAgICAgICB9XG4gICAgICB9LFxuICAgICAgdGVtcGxhdGU6ICc8bWQtZGlhbG9nIGNsYXNzPVwiYjJiLWFsZXJ0Qm94XCIgYXJpYS1sYWJlbD1cIkN1c3RvbSBDb25maXJtXCI+JyArXG4gICAgICAgJzxtZC10b29sYmFyPicgK1xuICAgICAgICAnPGgyPiAnICt0aXRsZSsgJzwvaDI+JytcbiAgICAgICAgJzwvbWQtdG9vbGJhcj4nK1xuICAgICAgICAgICAnICA8bWQtZGlhbG9nLWNvbnRlbnQ+JytcbiAgICAgICAgICAgICAgbWVzc2FnZSArXG4gICAgICAgICAgICAnICA8L21kLWRpYWxvZy1jb250ZW50PicrXG4gICAgICAgICAgICcgIDxtZC1kaWFsb2ctYWN0aW9ucz4nICtcbiAgICAgICAgICAgJyAgICA8YnV0dG9uIGNsYXNzPVwiY29uZmlybUNhbmNlbEJ0biBidG4tY2FuY2VsXCIgbmctY2xpY2s9XCJjbG9zZSgpXCI+JyArXG4gICAgICAgICAgICAgICAgICBjYW5jZWxCdG5UeHQgK1xuICAgICAgICAgICAnICAgIDwvYnV0dG9uPicgK1xuICAgICAgICAgICAnICAgIDxidXR0b24gY2xhc3M9XCJidG4tc3VibWl0XCIgbmctY2xpY2s9XCJjb25maXJtKClcIj4nICtcbiAgICAgICAgICAgICAgICBjb25maXJtQnRuVHh0ICtcbiAgICAgICAgICAgJyAgICA8L2J1dHRvbj4nICtcbiAgICAgICAgICAgJyAgPC9tZC1kaWFsb2ctYWN0aW9ucz4nICtcbiAgICAgICAgICAgJzwvbWQtZGlhbG9nPicsXG4gICAgfSkudGhlbihmdW5jdGlvbigpe1xuICAgICAgaWYob3B0aW9ucy5mdW5jT25Db25maXJtKXtcbiAgICAgICAgb3B0aW9ucy5mdW5jT25Db25maXJtKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgdmFyIGRpYWxvZ1RpbWUgPSBbXTtcbiAgJHJvb3RTY29wZS5lcnJvckJveCA9IGZ1bmN0aW9uKG1zZyl7XG4gICAgICB2YXIgZGlhbG9nT3B0aW9uID0ge1xuICAgICAgICAgIHR5cGU6ICdXJyxcbiAgICAgICAgICBtZXNzYWdlOiAnRVJST1I6ICcgKyBtc2csXG4gICAgICB9XG4gICAgICBkaWFsb2dCb3goZGlhbG9nT3B0aW9uKTtcbiAgfVxuICAkcm9vdFNjb3BlLmluZm9Cb3ggPSBmdW5jdGlvbihtc2cpe1xuICAgICAgdmFyIGRpYWxvZ09wdGlvbiA9IHtcbiAgICAgICAgICB0eXBlOiAnSScsXG4gICAgICAgICAgbWVzc2FnZTogbXNnLFxuICAgICAgfVxuICAgICAgZGlhbG9nQm94KGRpYWxvZ09wdGlvbik7XG4gIH1cbiAgdmFyIGRpYWxvZ0JveCA9IGZ1bmN0aW9uKG9wdGlvbnMpe1xuICAgICAgdmFyIHR5cGUgPSBvcHRpb25zLnR5cGUgfHwgXCIgXCI7IC8vSSBvciBXKEluZm9ybWF0aW9uIC8gV2FybmluZylcbiAgICAgIHZhciBtZXNzYWdlID0gb3B0aW9ucy5tZXNzYWdlIHx8IFwiIFwiO1xuICAgICAgXG4gICAgICAkcm9vdFNjb3BlLnNob3dEaWFsb2cgPSB0cnVlO1xuICAgICAgJHJvb3RTY29wZS5zaG93RGlhbG9nVHlwZSA9IHR5cGU7XG4gICAgICAkcm9vdFNjb3BlLnNob3dEaWFsb2dNc2cgPSBtZXNzYWdlO1xuICAgICAgXG4gICAgICAkdGltZW91dC5jYW5jZWwoZGlhbG9nVGltZSk7XG4gICAgICBkaWFsb2dUaW1lID0gJHRpbWVvdXQoXG4gICAgICAgICAgZnVuY3Rpb24gKCl7IFxuICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNob3dEaWFsb2cgPSBmYWxzZTtcbiAgICAgICAgICB9LCBcbiAgICAgICAgICAzMDAwXG4gICAgICApO1xuICB9XG5cbn0pXG4uY29uc3RhbnRcbihcImIyYkNvbmZpZ1wiLHtcbiAgXCJBUElfVVJMXCI6XCJodHRwczovL3d3dy5kZXZ0b3QuY3RiZy5hY2VyLmNvbS9hcGkvXCIsXG4gIFwiUEFSVE5FUlwiOlwiYWNlcnNcIlxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuYXBwbGljYXRpb24nLCBbXSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhY2VyYjJiLnNoYXJlZC5kaXJlY3RpdmVzXCIsW10pOyIsImFuZ3VsYXIubW9kdWxlKCdhY2VyYjJiLnNoYXJlZC5maWx0ZXJzJyxbXSk7IiwiYW5ndWxhci5tb2R1bGUoXCJhY2VyYjJiLnNoYXJlZC5zZXJ2aWNlc1wiLFtdKTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhY2VyYjJiLmFwcGxpY2F0aW9uJykuZGlyZWN0aXZlKCdhcHBjYXJkVmlldycsZnVuY3Rpb24oJHdpbmRvdyl7XG5cdHJldHVybiB7XG5cdFx0cmVzdHJpY3Q6J0VBJyxcblx0XHRzY29wZTp7XG5cdFx0XHRjYXJkZGF0YTonPScsXG5cdFx0XHRpbmRleDonQCdcblx0XHR9LFxuXHRcdHRlbXBsYXRlOlwiPGRpdiBjbGFzcz0nYjJiLWNhcmRWaWV3Jz48ZGl2PjxpbWcgY2xhc3M9J2IyYi1jYXJkSWNvbicgbGF6eS1pbWc9J2ltYWdlcy9pbWdfYXBwbGljYXRpb25fZGVmYXVsdC5wbmcnPjwvZGl2PjxoMiBjbGFzcz0nY2FyZFZpZXdOYW1lJz48YSB1aS1zcmVmPSdhcHBsaWNhdGlvbkhpc3Rvcnkoe2FwcElkOmNhcmRkYXRhLmFwcElkfSknIHBnLWNsYW1wPScyJz57e2NhcmRkYXRhLm5hbWV9fTwvYT48L2gyPjx0YWJsZT48dGJvZHk+PHRyPjx0ZD57eyRyb290LmxhbmcuU18wMjgxMH19e3tjYXJkZGF0YS5jcmVhdGVEYXRlfX08L3RkPjwvdHI+PHRyPjx0ZD57eyRyb290LmxhbmcuU18wMDAyNn19OiB7e2NhcmRkYXRhLnBsYXRmb3JtfX08L3RkPjwvdHI+PHRyPjx0ZD57eyRyb290LmxhbmcuU18wMDQyMX19OiB7eyRyb290LmxhbmdbY2FyZGRhdGEuc3RhdHVzXX19PC90ZD48L3RyPjwvdGJvZHk+PC90YWJsZT48L2Rpdj5cIixcblx0XHRsaW5rOmZ1bmN0aW9uKHNjb3BlLGVsZW1lbnQsYXR0cnMpe1xuXHRcdH1cblx0fVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuYXBwbGljYXRpb24nKVxuLmNvbnRyb2xsZXIoJ0FwcGxpY2F0aW9uQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkcm9vdFNjb3BlLCAkc2NvcGUsJG1kRGlhbG9nLCBBcHBsaWNhdGlvblNlcnZpY2UsYjJiQ29uZmlnKSB7XG5cbiAgICB2YXIgYXBwQ3RybCA9IHRoaXM7XG4gICAgYXBwQ3RybC5hcHBMaXN0ID0gW107XG5cbiAgICBhcHBDdHJsLmdldEFwcGxpY2F0aW9uTGlzdCA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIEFwcGxpY2F0aW9uU2VydmljZS5hcHBsaWNhdGlvbkFwaS5nZXQoe3BhcnRuZXJJZDpiMmJDb25maWcuUEFSVE5FUn0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xuICAgICAgICAgICAgYXBwQ3RybC5hcHBMaXN0ID0gcmVzcG9uc2UuYXBwTGlzdDtcbiAgICAgICAgfSxmdW5jdGlvbihmYWlsZWQpe1xuICAgICAgICAgICAgJHJvb3RTY29wZS5lcnJvckJveChcInNvbWV0aGluZyB3cm9uZyBoYXBwcGVuZWRcIik7IFxuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBhcHBDdHJsLmFwcENyZWF0ZSA9IGZ1bmN0aW9uKGV2KXtcbiAgICAgICAgJG1kRGlhbG9nLnNob3coe1xuICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxuICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldixcbiAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3ZpZXcvYXBwbGljYXRpb24vYXBwbGljYXRpb25DcmVhdGUuaHRtbCcsXG4gICAgICAgICAgICAgY29udHJvbGxlcjogJ0FwcENyZWF0ZUNvbnRyb2xsZXInLFxuICAgICAgICAgICAgIGNvbnRyb2xsZXJBcyA6ICdhcEN0cmwnLFxuICAgICAgICAgICAgIG9uUmVtb3Zpbmc6ZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBhcHBDdHJsLmdldEFwcGxpY2F0aW9uTGlzdCgpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgIH1cblxuICAgICBhcHBDdHJsLmdldEFwcGxpY2F0aW9uTGlzdCgpO1xuICAgIFxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuYXBwbGljYXRpb24nKVxuLmNvbnRyb2xsZXIoJ0FwcENyZWF0ZUNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9nLCAkcm9vdFNjb3BlLCAkbWREaWFsb2csQXBwbGljYXRpb25TZXJ2aWNlLGIyYkNvbmZpZykge1xuICAgIFxuICAgIHZhciBjcmVhdGVDdHJsID0gdGhpcztcbiAgICBjcmVhdGVDdHJsLmlkID0gJyc7XG4gICAgY3JlYXRlQ3RybC5vbkNhbmNlbCA9IGZ1bmN0aW9uKCl7XG5cdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0fVxuXG5cdFxuXHRjcmVhdGVDdHJsLmNyZWF0ZUFwcGxpY2F0aW9uID0gZnVuY3Rpb24oKXsgXG5cdFx0dmFyIG5ld0FwcGxpY2F0aW9uT2JqZWN0ID0ge1xuXHRcdFx0XCJwYXJ0bmVySWRcIjpiMmJDb25maWcuUEFSVE5FUixcblx0XHRcdFwiYXBwTmFtZVwiOmNyZWF0ZUN0cmwubmFtZSxcblx0XHRcdFwiYXBwU3VtbWFyeVwiOmNyZWF0ZUN0cmwuZGVzY3JpcHRpb24sXG5cdFx0XHRcInBsYXRmb3JtTmFtZVwiOmNyZWF0ZUN0cmwucGxhdGZvcm1cblx0XHR9XG5cdFx0QXBwbGljYXRpb25TZXJ2aWNlLmFwcGxpY2F0aW9uQXBpLmNyZWF0ZShuZXdBcHBsaWNhdGlvbk9iamVjdCkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXN1bHQpe1xuXHRcdFx0JG1kRGlhbG9nLmhpZGUoKTtcblx0XHRcdCRyb290U2NvcGUuYWxlcnRCb3goe3RpdGxlOlwiQXBwbGljYXRpb25cIixtZXNzYWdlOlwiQXBwbGljYXRpb24gQ3JlYXRlZCBTdWNjZXNzZnVsbHlcIn0pOyBcblx0XHRcdFxuXHRcdH0sZnVuY3Rpb24oZmFpbGVkKXtcblx0XHRcdCRyb290U2NvcGUuZXJyb3JCb3goXCJzb21ldGhpbmcgd3JvbmcgaGFwcHBlbmVkXCIpOyBcblx0XHR9KTs7XG5cblx0fVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuYXBwbGljYXRpb24nKVxuLmNvbnRyb2xsZXIoJ0FwcERldGFpbHNDb250cm9sbGVyJyxmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGVQYXJhbXMsICRzdGF0ZSwgJGxvZywgJHJvb3RTY29wZSwgQXBwbGljYXRpb25TZXJ2aWNlLCRtZERpYWxvZykge1xuIFxuIFx0dmFyIGRldGFpbHNDdHJsID0gdGhpcztcbiBcdGRldGFpbHNDdHJsLmFwcERldGFpbHMgID0gJHN0YXRlUGFyYW1zO1x0XG4gXHQkc2NvcGUuY29sdW1uc0luZm8gPSB7XG5cblx0XHRcdFwiY29sdW1uc0RlZlwiOltcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCdoZWFkZXInOidWZXJzaW9uJyxcblx0XHRcdFx0XHQnZmllbGQnOidhcHBWZXJzaW9uTmFtZScsXG5cdFx0XHRcdFx0J3NvcnRhYmxlJzp0cnVlLFxuXHRcdFx0XHRcdCd3aWR0aCc6JzMwJSdcblxuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHQnaGVhZGVyJzonU2l6ZScsXG5cdFx0XHRcdFx0J2ZpZWxkJyA6ICdjb250ZW50U2l6ZUJ5dGVzJyxcblx0XHRcdFx0XHQnc29ydGFibGUnOnRydWUsXG5cdFx0XHRcdFx0J3dpZHRoJzonMzAlJ1xuXG5cdFx0XHRcdH0se1xuXHRcdFx0XHRcdCdoZWFkZXInOidSZWxlYXNlZCcsXG5cdFx0XHRcdFx0J2ZpZWxkJzoncmVsZWFzZWREYXRlJyxcblx0XHRcdFx0XHQnc29ydGFibGUnOmZhbHNlLFxuXHRcdFx0XHRcdCd3aWR0aCc6JzQwJSdcblx0XHRcdFx0fSx7XG5cdFx0XHRcdFx0J2hlYWRlcic6JycsXG5cdFx0XHRcdFx0J2ZpZWxkJzonZG93bmxvYWQnLFxuXHRcdFx0XHRcdCdzb3J0YWJsZSc6ZmFsc2UsXG5cdFx0XHRcdFx0J3dpZHRoJzonNDAlJ1xuXHRcdFx0XHR9LHtcblx0XHRcdFx0XHQnaGVhZGVyJzonJyxcblx0XHRcdFx0XHQnZmllbGQnOicnLFxuXHRcdFx0XHRcdCd0ZW1wbGF0ZSc6J2V4cGFuZCdcblx0XHRcdFx0fVxuXHRcdFx0XSxcbiAgICAgICAgICAgIFwiZGVmYXVsdFByZWRpY2F0ZVwiOidhcHBWZXJzaW9uTmFtZScsXG4gICAgICAgICAgICBcImRlZmF1bHRSZXZlcnNlXCI6IGZhbHNlIFxuXHR9XG5cblx0ZGV0YWlsc0N0cmwuZ2V0QXBwVmVyc2lvbnNEYXRhID0gZnVuY3Rpb24oKXtcblx0XHRBcHBsaWNhdGlvblNlcnZpY2UuYXBwVmVyc2lvbkFwaS5nZXQoKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcblx0XHRcdCRzY29wZS5jb2x1bW5zSW5mby5kYXRhID0gcmVzcG9uc2UuYXBwVmVyc2lvbkxpc3Q7XG5cdFx0fSxmdW5jdGlvbihmYWlsZWQpe1xuXHRcdFx0ZGVidWdnZXI7XG5cdFx0fSlcblx0fVxuXG5cdGRldGFpbHNDdHJsLnZlcnNpb25DcmVhdGUgPSBmdW5jdGlvbihldil7XG4gICAgICAgICRtZERpYWxvZy5zaG93KHtcbiAgICAgICAgXHRsb2NhbHM6e3ZlcnNpb25EYXRhOiBkZXRhaWxzQ3RybC5hcHBEZXRhaWxzfSxcbiAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcbiAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXYsXG4gICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3L2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uVmVyc2lvbi5odG1sJyxcbiAgICAgICAgICAgICBjb250cm9sbGVyOiAnQXBwVmVyQ29udHJvbGxlcicsXG4gICAgICAgICAgICAgY29udHJvbGxlckFzIDogJ2FwVmVyQ3RybCcsXG4gICAgICAgICAgICAgb25SZW1vdmluZzpmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgIGRldGFpbHNDdHJsLmdldEFwcFZlcnNpb25zRGF0YSgpO1xuICAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcblxuICAgIH1cblxuXHRkZXRhaWxzQ3RybC5nZXRBcHBWZXJzaW9uc0RhdGEoKTtcbiB9KTtcblxuIiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuYXBwbGljYXRpb24nKVxuLmZhY3RvcnkoJ0FwcGxpY2F0aW9uU2VydmljZScsIGZ1bmN0aW9uICgkcmVzb3VyY2UsYjJiQ29uZmlnKSB7XG5cdHZhciBhcHBTZXJ2aWNlID0ge307XG5cblx0YXBwU2VydmljZS5hcHBsaWNhdGlvbkFwaSA9ICRyZXNvdXJjZShiMmJDb25maWcuQVBJX1VSTCArJ3YxL2FwcHMnLHt9LHtcblx0XHRjcmVhdGU6e1xuXHRcdFx0bWV0aG9kOidQT1NUJ1xuXHRcdFx0fVxuXHR9KTtcblxuXHRhcHBTZXJ2aWNlLmFwcFZlcnNpb25BcGkgPSAkcmVzb3VyY2UoJ2RhdGEvYXBwVmVyc2lvbnMuanNvbicpO1xuXG5cdHJldHVybiBhcHBTZXJ2aWNlO1xufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuYXBwbGljYXRpb24nKVxuLmNvbnRyb2xsZXIoJ0FwcFZlckNvbnRyb2xsZXInLCBmdW5jdGlvbiAoJHNjb3BlLCAkbG9nLCAkcm9vdFNjb3BlLCAkbWREaWFsb2csQXBwbGljYXRpb25TZXJ2aWNlLGIyYkNvbmZpZyx2ZXJzaW9uRGF0YSkge1xuICAgIFxuICAgIHZhciB2ZXJDdHJsID0gdGhpcztcbiAgICB2ZXJDdHJsLm9uQ2FuY2VsID0gZnVuY3Rpb24oKXtcblx0XHQkbWREaWFsb2cuaGlkZSgpO1xuXHR9XG5cdHZlckN0cmwuYXBwSW1wb3J0YW5jZSA9IFwiTk9STUFMXCI7XG5cblx0XG5cdHZlckN0cmwuY3JlYXRlVmVyc2lvbiA9IGZ1bmN0aW9uKCl7IFxuXHRcdHZhciBuZXdBcHBsaWNhdGlvbk9iamVjdCA9IHtcblx0XHRcdFwicGFydG5lcklkXCI6YjJiQ29uZmlnLlBBUlRORVIsXG5cdFx0XHRcImFwcE5hbWVcIjp2ZXJDdHJsLm5hbWUsXG5cdFx0XHRcImFwcFN1bW1hcnlcIjp2ZXJDdHJsLmRlc2NyaXB0aW9uLFxuXHRcdFx0XCJwbGF0Zm9ybU5hbWVcIjp2ZXJDdHJsLnBsYXRmb3JtXG5cdFx0fVxuXHRcdEFwcGxpY2F0aW9uU2VydmljZS5hcHBsaWNhdGlvbkFwaS5jcmVhdGUobmV3QXBwbGljYXRpb25PYmplY3QpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzdWx0KXtcblx0XHRcdCRtZERpYWxvZy5oaWRlKCk7XG5cdFx0XHQkcm9vdFNjb3BlLmFsZXJ0Qm94KHt0aXRsZTpcIkFwcGxpY2F0aW9uXCIsbWVzc2FnZTpcIlYgQ3JlYXRlZCBTdWNjZXNzZnVsbHlcIn0pOyBcblx0XHRcdFxuXHRcdH0sZnVuY3Rpb24oZmFpbGVkKXtcblx0XHRcdCRyb290U2NvcGUuZXJyb3JCb3goXCJzb21ldGhpbmcgd3JvbmcgaGFwcHBlbmVkXCIpOyBcblx0XHR9KTs7XG5cblx0fVxufSk7IiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmInKVxuLmNvbnRyb2xsZXIoJ01haW5Db250cm9sbGVyJyxmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGxvY2F0aW9uLCAkc3RhdGUpe1xuXG59KTsgICAgICAgICAgICAgICAgICAgXG4iLCJhbmd1bGFyLm1vZHVsZSgnYWNlcmIyYicpXG4uY29uZmlnKGZ1bmN0aW9uKCR1cmxSb3V0ZXJQcm92aWRlciwgJHN0YXRlUHJvdmlkZXIsICRsb2NhdGlvblByb3ZpZGVyKXtcbiAgICBcblx0JHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnLycpO1xuICAgIFxuXHQkc3RhdGVQcm92aWRlclxuICAgIC5zdGF0ZSgnLycse1xuICAgICAgICB1cmw6Jy8nXG4gICAgfSlcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT1sb2dpbiBzdGF0ZT09PT09PT09PT09PT09PT09PT09PT1cblx0LnN0YXRlKCdsb2dpbicsIHtcblx0XHR1cmw6Jy9sb2dpbicsXG5cdFx0dGVtcGxhdGVVcmw6J3ZpZXcvbG9naW4vbG9naW4uaHRtbCcsXG5cdH0pXG5cdC8vPT09PT09PT09PT09PT09PT09PT09PUFwcGxpY2F0aW9ucyBzdGF0ZT09PT09PT09PT09PT09PT1cblx0LnN0YXRlKCdhcHBsaWNhdGlvbicsIHtcblx0XHR1cmw6Jy9hcHBsaWNhdGlvbicsXG4gICAgICAgIHRpdGxlTmFtZTonQXBwbGljYXRpb24nLFxuXHRcdHRlbXBsYXRlVXJsOid2aWV3L2FwcGxpY2F0aW9uL2FwcGxpY2F0aW9uLmh0bWwnXG5cdH0pXG5cdC5zdGF0ZSgnY3JlYXRlQXBwbGljYXRpb24nLCB7XG5cdFx0dXJsOicvTmV3QXBwbGljYXRpb24nLFxuICAgICAgICB0aXRsZU5hbWU6J0FwcGxpY2F0aW9uJyxcblx0XHR0ZW1wbGF0ZVVybDondmlldy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbkNyZWF0ZS5odG1sJ1xuXHR9KVxuXHQuc3RhdGUoJ2FwcGxpY2F0aW9uSGlzdG9yeScsIHtcblx0XHR1cmw6Jy9hcHBsaWNhdGlvbkRldGFpbHMvOmFwcE5hbWUnLFxuICAgICAgICB0aXRsZU5hbWU6J0FwcGxpY2F0aW9uJyxcblx0XHR0ZW1wbGF0ZVVybDondmlldy9hcHBsaWNhdGlvbi9hcHBsaWNhdGlvbkRldGFpbHMuaHRtbCcsXG5cdFx0cGFyYW1zIDp7XG5cdFx0XHRhcHBOYW1lOicnLFxuXHRcdFx0YXBwSWQ6JycsXG5cdFx0XHRhcHBTdW1tYXJ5OicnLFxuXHRcdFx0cGxhdGZvcm1OYW1lOicnXG5cdFx0fVxuXHR9KTtcbn0pXG5cblxuIiwiYW5ndWxhci5tb2R1bGUoJ2FjZXJiMmIuc2hhcmVkLmRpcmVjdGl2ZXMnKVxuLmRpcmVjdGl2ZSgnbGlzdFZpZXcnLCBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgICAgcmVzdHJpY3Q6ICdFQScsXG4gICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXcvc2hhcmVkL2xpc3RWaWV3Lmh0bWxcIixcbiAgICAgICAgc2NvcGU6ZmFsc2UsXG4gICAgICAgIGxpbms6IGZ1bmN0aW9uIChzY29wZSwgZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgICAgIGRlYnVnZ2VyO1xuICAgICAgICAgICAgc2NvcGUucmV2ZXJzZSA9IHNjb3BlLmNvbHVtbnNJbmZvLmRlZmF1bHRSZXZlcnNlO1xuICAgICAgICAgICAgc2NvcGUucHJlZGljYXRlID0gc2NvcGUuY29sdW1uc0luZm8uZGVmYXVsdFByZWRpY2F0ZTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgc2NvcGUub3JkZXIgPSBmdW5jdGlvbihwcmVkaWNhdGUpIHtcbiAgICAgICAgICAgICAgICBzY29wZS5yZXZlcnNlID0gKHNjb3BlLnByZWRpY2F0ZSA9PT0gcHJlZGljYXRlKSA/ICFzY29wZS5yZXZlcnNlIDogZmFsc2U7XG4gICAgICAgICAgICAgICAgc2NvcGUucHJlZGljYXRlID0gcHJlZGljYXRlO1xuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHNjb3BlLiR3YXRjaChcbiAgICAgICAgICAgICAgICBmdW5jdGlvbiAoc2NvcGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFzY29wZS5jb2x1bW5zSW5mbykge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzY29wZS5jb2x1bW5zSW5mby5kYXRhO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLnJvd0NvbGxlY3Rpb24gPSBuZXdWYWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjb3BlLmRpc3BsYXllZENvbGxlY3Rpb24gPSBbXS5jb25jYXQobmV3VmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgICAgc2NvcGUuJHdhdGNoKCckcm9vdC5sYW5nJywgZnVuY3Rpb24gKG5ld1ZhbHVlLCBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgIGlmICghc2NvcGUuY29sdW1uc0luZm8pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB2YXIgY29sdW1uc0RlZiA9IHNjb3BlLmNvbHVtbnNJbmZvLmNvbHVtbnNEZWY7XG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSBpbiBjb2x1bW5zRGVmKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChjb2x1bW5zRGVmW2ldLmhlYWRlciA9PSBcIlwiKSBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgbmFtZSBpbiBvbGRWYWx1ZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9sZFZhbHVlW25hbWVdID09IGNvbHVtbnNEZWZbaV0uaGVhZGVyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29sdW1uc0RlZltpXS5oZWFkZXIgPSBuZXdWYWx1ZVtuYW1lXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pXG4gICAgICAgIH1cbiAgICB9XG59KTsiLCIndXNlIHN0cmljdCc7XG5cbmFuZ3VsYXIubW9kdWxlKCdhY2VyYjJiLnNoYXJlZC5maWx0ZXJzJylcbi5maWx0ZXIoJ3Vuc2FmZScsZnVuY3Rpb24oJHNjZSl7XG5cdHJldHVybiAkc2NlLnRydXN0QXNIdG1sO1xufSlcbi5maWx0ZXIoXCJzY2VUcnVzdEh0bWxcIixmdW5jdGlvbigkc2NlKSB7XG4gIHJldHVybiBmdW5jdGlvbihodG1sQ29kZSl7XG4gICAgcmV0dXJuICRzY2UudHJ1c3RBc0h0bWwoaHRtbENvZGUpO1xuICB9XG59KTsiXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
