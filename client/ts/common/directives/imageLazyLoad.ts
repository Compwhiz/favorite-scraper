/// <reference path="../../references" />

module common {
    interface ImageLazyLoadScope extends ng.IScope {
        fsLazySrc?;
        animateSpeed?;
        animateVisible?;
    }

    export class LazySrcDirective {
        public restrict = 'A';
        public scope = { fsLazySrc: '@', animateSpeed: '@', animateVisible: '@' };
        static $inject = ['$window', '$document'];
        public link: (scope: ImageLazyLoadScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => void;

        private doc;
        private body;
        private win;
        private $win;
        private uid = 0;
        private elements = {};

        constructor($window: ng.IWindowService, $document: ng.IDocumentService) {
            this.doc = $document[0],
                this.body = this.doc.body,
                this.win = $window,
                this.$win = angular.element(this.win),
                this.uid = 0,
                this.elements = {};

            this.$win.bind('scroll', () => { this.checkImage() });
            this.$win.bind('resize', () => { this.checkImage() });

            LazySrcDirective.prototype.link = (scope: ImageLazyLoadScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
                element.bind('load', (e) => {
                    this.onLoad(e.target);
                });

                scope.$watch('fsLazySrc', () => {
                    var speed = "1s";
                    if (scope.animateSpeed != null) {
                        speed = scope.animateSpeed;
                    }
                    if (this.isVisible(element)) {
                        if (scope.animateVisible) {
                            element.css({
                                'background-color': '#fff',
                                'opacity': 0,
                                '-webkit-transition': 'opacity ' + speed,
                                'transition': 'opacity ' + speed
                            });
                        }
                        element.attr('src', scope.fsLazySrc);
                    } else {
                        var uid = this.getUid(element);
                        element.css({
                            'background-color': '#fff',
                            'opacity': 0,
                            '-webkit-transition': 'opacity ' + speed,
                            'transition': 'opacity ' + speed
                        });
                        this.elements[uid] = {
                            element: element,
                            $scope: scope
                        };
                    }
                });

                scope.$on('$destroy', () => {
                    element.unbind('load');
                    var uid = this.getUid(element);
                    if (this.elements.hasOwnProperty(uid)) {
                        delete this.elements[uid];
                    }
                });
            }
        }

        private getUid(el) {
            let __uid = el.data("__uid");
            if (!__uid) {
                el.data("__uid", (__uid = '' + ++this.uid));
            }
            return __uid;
        }

        private getWindowOffset() {
            var t,
                pageXOffset = (typeof this.win.pageXOffset == 'number') ? this.win.pageXOffset : (((t = this.doc.documentElement) || (t = this.body.parentNode)) && typeof t.ScrollLeft == 'number' ? t : this.body).ScrollLeft,
                pageYOffset = (typeof this.win.pageYOffset == 'number') ? this.win.pageYOffset : (((t = this.doc.documentElement) || (t = this.body.parentNode)) && typeof t.ScrollTop == 'number' ? t : this.body).ScrollTop;
            return {
                offsetX: pageXOffset,
                offsetY: pageYOffset
            };
        }

        private isVisible(iElement) {
            var elem = iElement[0],
                elemRect = elem.getBoundingClientRect(),
                windowOffset = this.getWindowOffset(),
                winOffsetX = windowOffset.offsetX,
                winOffsetY = windowOffset.offsetY,
                elemWidth = elemRect.width,
                elemHeight = elemRect.height,
                elemOffsetX = elemRect.left + winOffsetX,
                elemOffsetY = elemRect.top + winOffsetY,
                viewWidth = Math.max(this.doc.documentElement.clientWidth, this.win.innerWidth || 0),
                viewHeight = Math.max(this.doc.documentElement.clientHeight, this.win.innerHeight || 0),
                xVisible,
                yVisible;

            if (elemOffsetY <= winOffsetY) {
                if (elemOffsetY + elemHeight >= winOffsetY) {
                    yVisible = true;
                }
            } else if (elemOffsetY >= winOffsetY) {
                if (elemOffsetY <= winOffsetY + viewHeight) {
                    yVisible = true;
                }
            }

            if (elemOffsetX <= winOffsetX) {
                if (elemOffsetX + elemWidth >= winOffsetX) {
                    xVisible = true;
                }
            } else if (elemOffsetX >= winOffsetX) {
                if (elemOffsetX <= winOffsetX + viewWidth) {
                    xVisible = true;
                }
            }

            return xVisible && yVisible;
        }

        private checkImage() {
            if (this.elements) {
                Object.keys(this.elements).forEach((key) => {
                    var obj = this.elements[key],
                        iElement = obj.element,
                        $scope = obj.$scope;
                    if (this.isVisible(iElement)) {
                        iElement.attr('src', $scope.fsLazySrc);
                    }
                });
            }
        }

        private onLoad(target) {
            var $el = angular.element(target),
                uid = this.getUid($el);

            $el.css('opacity', 1);

            if (this.elements.hasOwnProperty(uid)) {
                delete this.elements[uid];
            }
        }

        static factory() {
            var directive = ($window, $document) => new LazySrcDirective($window, $document);
            directive.$inject = LazySrcDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsLazySrc', common.LazySrcDirective.factory())
})();