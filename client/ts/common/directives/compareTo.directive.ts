/// <reference path="../../references" />

module common {
    interface CompareToScope extends ng.IScope {
        fsCompareTo?;
    }

    export class CompareToDirective {
        public restrict = 'A';
        public require = 'ngModel';
        public scope = { fsCompareTo: '=' };
        static $inject = [];
        public link: (scope: CompareToScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => void;

        constructor() {
            CompareToDirective.prototype.link = (scope: CompareToScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes, ngModel: ng.INgModelController) => {
                (<any>ngModel.$validators).compareTo = modelValue => {
                    return modelValue == scope.fsCompareTo;
                };

                scope.$watch("fsCompareTo", () => {
                    ngModel.$validate();
                });
            }
        }

        static factory() {
            var directive = () => new CompareToDirective();
            directive.$inject = CompareToDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsCompareTo', common.CompareToDirective.factory())
})();