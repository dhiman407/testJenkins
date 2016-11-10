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