/// <reference path="../../references" />

module common {
    export class ImageToggleSizeDirective {
        public restrict = 'A';
        public scope = false;
        static $inject = [];
        public link: (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        constructor() {
            ImageToggleSizeDirective.prototype.link = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                element.css({
                    '-webkit-transition': 'max-width 1s',
                    '-moz-transition': 'max-width 1s',
                    '-ms-transition': 'max-width 1s',
                    '-o-transition': 'max-width 1s',
                    'transition': 'max-width 1s',
                    'max-width':'300px'
                });

                element.bind('click', () => {
                    var mw = element.css('max-width');
                    console.log(mw);
                    if(mw ==='300px'){
                        element.css('max-width', '680px');                        
                    }else{
                        element.css('max-width', '300px');
                    }
                });

                scope.$on('$destroy', () => {
                    element.unbind('click');
                });
            }
        }

        static factory() {
            var directive = () => new ImageToggleSizeDirective();
            directive.$inject = ImageToggleSizeDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsImgToggleSize', common.ImageToggleSizeDirective.factory())
})();