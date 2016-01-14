/// <reference path="../../references.d.ts" />

module common {
    interface AlertContainerScope extends ng.IScope {
        alerts?: any[];
        closeAlert: (index) => void;
    }

    export class AlertContainerDirective {
        public templateUrl = 'client/views/alert-container.html';
        public restrict = 'E';
        public scope = { alerts: '=' };
        static $inject = [];
        public link: (scope: AlertContainerScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        constructor() {
            AlertContainerDirective.prototype.link = (scope: AlertContainerScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

                scope.closeAlert = index => {
                    scope.alerts.splice(index, 1);
                }
            }
        }

        static factory() {
            var directive = () => new AlertContainerDirective();
            directive.$inject = AlertContainerDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsAlertContainer', common.AlertContainerDirective.factory());
})();