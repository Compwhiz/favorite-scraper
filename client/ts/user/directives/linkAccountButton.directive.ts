/// <reference path="../../references.d.ts" />

module user {
    interface LinkAccountButtonScope extends ng.IScope {
        type?: string;
        text?: string;
        size?: string;
    }

    export class LinkAccountButtonDirective {
        public template = '<a class="btn btn-primary" href="/login/{{type}}">{{text}}</a>';
        public restrict = 'E';
        public replace = true;
        public scope = { type: '@', size: '@' };
        public link: (scope: LinkAccountButtonScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = ['$rootScope', 'UserService'];

        constructor(private $rootScope: any, private UserService: services.UserService) {
            LinkAccountButtonDirective.prototype.link = (scope: LinkAccountButtonScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                if (scope.size) {
                    switch (scope.size.toUpperCase()) {
                        case 'LARGE':
                            scope.size = 'btn-lg';
                            break;
                        case 'SMALL':
                            scope.size = 'btn-sm';
                            break;
                        case 'XSMALL':
                            scope.size = 'btn-xs';
                            break;
                        case 'BLOCK':
                            scope.size = 'btn-block';
                            break;
                        default:
                            scope.size = '';
                            break;
                    }
                    element.addClass(scope.size);
                }
                element.addClass('btn-' + scope.type);

                updateButtonText();

                $rootScope.$watch('user', (user) => {
                    updateButtonText();
                });

                function updateButtonText() {
                    if ($rootScope.user) {
                        element.toggleClass('ng-hide', $rootScope.user[scope.type]);
                        scope.text = 'Link ' + scope.type[0].toUpperCase() + scope.type.substring(1) + ' account';
                    } else {
                        element.removeClass('ng-hide');
                        scope.text = 'Login with ' + scope.type[0].toUpperCase() + scope.type.substring(1);
                    }
                }
            }
        }

        static factory() {
            var directive = ($rootScope: ng.IRootScopeService, UserService: services.UserService) => new LinkAccountButtonDirective($rootScope, UserService);
            directive.$inject = LinkAccountButtonDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('user').directive('fsLinkAccountButton', user.LinkAccountButtonDirective.factory());
})();