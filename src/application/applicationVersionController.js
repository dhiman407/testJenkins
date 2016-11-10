angular.module('acerb2b.application')
.controller('AppVerController', function ($scope, $log, $rootScope, $mdDialog,ApplicationService,b2bConfig,versionData) {
    
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
});