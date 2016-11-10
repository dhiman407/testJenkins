'use strict';

angular.module('acerb2b.shared.filters')
.filter('unsafe',function($sce){
	return $sce.trustAsHtml;
})
.filter("sceTrustHtml",function($sce) {
  return function(htmlCode){
    return $sce.trustAsHtml(htmlCode);
  }
});