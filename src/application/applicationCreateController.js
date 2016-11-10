angular.module('acerb2b.application')
.controller('AppCreateController', function ($scope, $log, $rootScope, $mdDialog,ApplicationService,b2bConfig) {
    
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
});