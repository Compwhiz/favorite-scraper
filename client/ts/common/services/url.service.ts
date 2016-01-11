/// <reference path="../../references.d.ts" />

module common.services {
    export class UrlService {

        static $inject = ['$window'];
        _isWindowLocationChanging = false;

        constructor(private $window: ng.IWindowService) { }

        static factory() {
            var factory = ($window: ng.IWindowService) => new UrlService($window);
            factory.$inject = UrlService.$inject;
            return factory;
        }

        getFragment() {
            if (this.$window.location.hash.indexOf("#") === 0) {
                return this.parseQueryString(this.$window.location.hash.substr(1));
            } else {
                return {};
            }
        }

        getQueryString() :any {
            if (this.$window.location.search.indexOf("?") === 0) {
                return this.parseQueryString(this.$window.location.search.substr(1));
            }
            else {
                return null;
            }
        }

        parseQueryString(queryString) {
            var data = {},
                pairs, pair, separatorIndex, escapedKey, escapedValue, key, value;

            if (queryString === null) {
                return data;
            }

            pairs = queryString.split("&");

            for (var i = 0; i < pairs.length; i++) {
                pair = pairs[i];
                separatorIndex = pair.indexOf("=");

                if (separatorIndex === -1) {
                    escapedKey = pair;
                    escapedValue = null;
                } else {
                    escapedKey = pair.substr(0, separatorIndex).replace('/', '');
                    escapedValue = pair.substr(separatorIndex + 1);
                }

                key = decodeURIComponent(escapedKey).toLowerCase();
                value = decodeURIComponent(escapedValue);

                data[key] = value;
            }

            return data;
        }

        encodeQueryString(data) {
            var ret = [];
            for (var d in data) {
                if (data[d]) {
                    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                }
            }
            return ret.join("&");
        }

        resetQueryStringWindow(data?) {
            var qs = this.encodeQueryString(data);
            if (qs) {
                qs = '?' + qs;
            }

            // TODO: Somehow the question mark won't go away when we clear the query string.
            // Not a big deal, but maybe worth looking into at some point.
            this.$window.location.search = qs || '';
            this._isWindowLocationChanging = true;
        }

        isWindowLocationChanging() {
            return this._isWindowLocationChanging;
        }
    }
}

(() => {
    angular
        .module('common')
        .service('UrlService', common.services.UrlService.factory());
})();
    