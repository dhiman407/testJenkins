angular.module('acerb2b.application')
.controller('ApplicationController', function ($rootScope, $scope,$mdDialog, ApplicationService,b2bConfig) {

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
    
});