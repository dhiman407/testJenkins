angular.module('acerb2b.application')
.factory('ApplicationService', function ($resource,b2bConfig) {
	var appService = {};

	appService.applicationApi = $resource(b2bConfig.API_URL +'v1/apps',{},{
		create:{
			method:'POST'
			}
	});

	appService.appVersionApi = $resource('data/appVersions.json');

	return appService;
});