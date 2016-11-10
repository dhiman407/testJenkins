angular.module('acerb2b.application')
.controller('AppDetailsController',function ($scope, $stateParams, $state, $log, $rootScope, ApplicationService,$mdDialog) {
 
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
 });

