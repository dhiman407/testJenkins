'use strict';

angular.module('acerb2b.application').directive('appcardView',function($window){
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
});