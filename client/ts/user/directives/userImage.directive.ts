/// <reference path="../../references.d.ts" />

module user {
    export class UserImageDirective {
        public template = '<img src="" alt="UserImage"/>';
        public restrict = 'E';
        public replace = true;
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;
        static $inject = ['$rootScope'];

        constructor(private $rootScope: any) {
            UserImageDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                // updateImage();
                
                $rootScope.$watch('user', () => {
                    updateImage();
                });

                function updateImage() {
                    if ($rootScope.user) {
                        element.attr('src', $rootScope.user.profile.picture);
                    }
                }
            }
        }

        static factory() {
            var directive = ($rootScope: ng.IRootScopeService) => new UserImageDirective($rootScope);
            directive.$inject = UserImageDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('user').directive('fsUserImage', user.UserImageDirective.factory());
})();