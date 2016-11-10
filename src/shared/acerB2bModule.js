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
.run(function($rootScope, $state, $timeout,$mdDialog){

  $rootScope.alertBox = function (options){
    var title = options.title || "Alert";
    var message = options.message || " ";
    var okBtnTxt = options.okText || "Ok";
    $mdDialog.show({
      controller:function($scope,$mdDialog){
        $scope.close = function(){
          $mdDialog.hide();
        }
      },
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
      controller:function($scope,$mdDialog){
        $scope.close = function(){
          $mdDialog.cancel();
        }
        $scope.confirm = function(){
          $mdDialog.hide();
        }
      },
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

})
.constant
("b2bConfig",{
  "API_URL":"https://www.devtot.ctbg.acer.com/api/",
  "PARTNER":"acers"
});