/// <reference path="../../references.d.ts" />

module common {
    interface InfiniteScrollScope extends ng.IScope {
        fsInfiniteScroll?;
        infiniteScrollContainer?;
        infiniteScrollDistance?;
        infiniteScrollDisabled?;
        infiniteScrollUseDocumentBottom?;
        infiniteScrollListenForEvent?;
    }

    export class InfiniteScrollDirective {
        public restrict = 'A';
        public scope = {
            fsInfiniteScroll: '&',
            infiniteScrollContainer: '=',
            infiniteScrollDistance: '=',
            infiniteScrollDisabled: '=',
            infiniteScrollUseDocumentBottom: '=',
            infiniteScrollListenForEvent: '@'
        };
        static $inject = ['$rootScope', '$window', '$interval', 'INFINITE_SCROLL_THROTTLE_MILLISECONDS'];
        public link: (scope: InfiniteScrollScope, element: ng.IAugmentedJQuery, attrs: any) => void;

        constructor($rootScope, $window, $interval: ng.IIntervalService, INFINITE_SCROLL_THROTTLE_MILLISECONDS) {
            InfiniteScrollDirective.prototype.link = (scope: InfiniteScrollScope, element: ng.IAugmentedJQuery, attrs: any) => {

                var changeContainer, checkWhenEnabled, container, handleInfiniteScrollContainer, handleInfiniteScrollDisabled, handleInfiniteScrollDistance, handleInfiniteScrollUseDocumentBottom, handler, height, immediateCheck, offsetTop, pageYOffset, scrollDistance, scrollEnabled, throttle, unregisterEventListener, useDocumentBottom, windowElement;
                windowElement = angular.element($window);
                scrollDistance = null;
                scrollEnabled = null;
                checkWhenEnabled = null;
                container = null;
                immediateCheck = true;
                useDocumentBottom = false;
                unregisterEventListener = null;
                height = function(elem) {
                    elem = elem[0] || elem;
                    if (isNaN(elem.offsetHeight)) {
                        return elem.document.documentElement.clientHeight;
                    } else {
                        return elem.offsetHeight;
                    }
                };

                offsetTop = function(elem) {
                    if (!elem[0].getBoundingClientRect || elem.css('none')) {
                        return;
                    }
                    return elem[0].getBoundingClientRect().top + pageYOffset(elem);
                };

                pageYOffset = function(elem) {
                    elem = elem[0] || elem;
                    if (isNaN(window.pageYOffset)) {
                        return elem.document.documentElement.scrollTop;
                    } else {
                        return elem.ownerDocument.defaultView.pageYOffset;
                    }
                };

                handler = function() {
                    var containerBottom, containerTopOffset, elementBottom, remaining, shouldScroll;
                    if (container === windowElement) {
                        containerBottom = height(container) + pageYOffset(container[0].document.documentElement);
                        elementBottom = offsetTop(element) + height(element);
                    } else {
                        containerBottom = height(container);
                        containerTopOffset = 0;
                        if (offsetTop(container) !== void 0) {
                            containerTopOffset = offsetTop(container);
                        }
                        elementBottom = offsetTop(element) - containerTopOffset + height(element);
                    }
                    if (useDocumentBottom) {
                        elementBottom = height((element[0].ownerDocument || element[0]['document']).documentElement);
                    }
                    remaining = elementBottom - containerBottom;
                    shouldScroll = remaining <= height(container) * scrollDistance + 1;
                    if (shouldScroll) {
                        checkWhenEnabled = true;
                        if (scrollEnabled) {
                            if (scope.$$phase || $rootScope.$$phase) {
                                return scope.fsInfiniteScroll();
                            } else {
                                return scope.$apply(scope.fsInfiniteScroll);
                            }
                        }
                    } else {
                        return checkWhenEnabled = false;
                    }
                };

                // throttle = function(func, wait) {
                //     var later, previous, timeout;
                //     timeout = null;
                //     previous = 0;
                //     later = function() {
                //         var context;
                //         previous = new Date().getTime();
                //         $interval.cancel(timeout);
                //         timeout = null;
                //         func.call();
                //         return context = null;
                //     };
                //     return function() {
                //         var now, remaining;
                //         now = new Date().getTime();
                //         remaining = wait - (now - previous);
                //         if (remaining <= 0) {
                //             clearTimeout(timeout);
                //             $interval.cancel(timeout);
                //             timeout = null;
                //             previous = now;
                //             return func.call();
                //         } else {
                //             if (!timeout) {
                //                 return timeout = $interval(later, remaining, 1);
                //             }
                //         }
                //     };
                // };

                if (INFINITE_SCROLL_THROTTLE_MILLISECONDS != null) {
                    handler = _.throttle(handler, INFINITE_SCROLL_THROTTLE_MILLISECONDS);
                }

                scope.$on('$destroy', function() {
                    container.unbind('scroll', handler);
                    if (unregisterEventListener != null) {
                        unregisterEventListener();
                        return unregisterEventListener = null;
                    }
                });

                handleInfiniteScrollDistance = function(v) {
                    return scrollDistance = parseFloat(v) || 0;
                };

                scope.$watch('infiniteScrollDistance', handleInfiniteScrollDistance);

                handleInfiniteScrollDistance(scope.infiniteScrollDistance);

                handleInfiniteScrollDisabled = function(v) {
                    scrollEnabled = !v;
                    if (scrollEnabled && checkWhenEnabled) {
                        checkWhenEnabled = false;
                        return handler();
                    }
                };

                scope.$watch('infiniteScrollDisabled', handleInfiniteScrollDisabled);

                handleInfiniteScrollDisabled(scope.infiniteScrollDisabled);

                handleInfiniteScrollUseDocumentBottom = function(v) {
                    return useDocumentBottom = v;
                };

                scope.$watch('infiniteScrollUseDocumentBottom', handleInfiniteScrollUseDocumentBottom);

                handleInfiniteScrollUseDocumentBottom(scope.infiniteScrollUseDocumentBottom);

                changeContainer = function(newContainer) {
                    if (container != null) {
                        container.unbind('scroll', handler);
                    }
                    container = newContainer;
                    if (newContainer != null) {
                        return container.bind('scroll', handler);
                    }
                };

                changeContainer(windowElement);

                if (scope.infiniteScrollListenForEvent) {
                    unregisterEventListener = $rootScope.$on(scope.infiniteScrollListenForEvent, handler);
                }

                handleInfiniteScrollContainer = function(newContainer) {
                    if ((newContainer == null) || newContainer.length === 0) {
                        return;
                    }
                    if (newContainer instanceof HTMLElement) {
                        newContainer = angular.element(newContainer);
                    } else if (typeof newContainer.append === 'function') {
                        newContainer = angular.element(newContainer[newContainer.length - 1]);
                    } else if (typeof newContainer === 'string') {
                        newContainer = angular.element(document.querySelector(newContainer));
                    }
                    if (newContainer != null) {
                        return changeContainer(newContainer);
                    } else {
                        throw new Error("invalid infinite-scroll-container attribute.");
                    }
                };

                scope.$watch('infiniteScrollContainer', handleInfiniteScrollContainer);

                handleInfiniteScrollContainer(scope.infiniteScrollContainer || []);

                if (attrs.infiniteScrollParent != null) {
                    changeContainer(angular.element(element.parent()));
                }

                if (attrs.infiniteScrollImmediateCheck != null) {
                    immediateCheck = scope.$eval(attrs.infiniteScrollImmediateCheck);
                }

                return $interval((function() {
                    if (immediateCheck) {
                        return handler();
                    }
                }), 0, 1);
            }
        }

        static factory() {
            var directive = ($rootScope, $window, $interval: ng.IIntervalService, INFINITE_SCROLL_THROTTLE_MILLISECONDS) => new InfiniteScrollDirective($rootScope, $window, $interval, INFINITE_SCROLL_THROTTLE_MILLISECONDS);
            directive.$inject = InfiniteScrollDirective.$inject;
            return directive;
        }
    }
}

(() => {
    angular.module('common').directive('fsInfiniteScroll', common.InfiniteScrollDirective.factory());
})();