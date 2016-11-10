angular.module('acerb2b')
.config(function($urlRouterProvider, $stateProvider, $locationProvider){
    
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
})


