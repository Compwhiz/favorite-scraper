/// <reference path="../../common.d.ts" />

(function () {
    'use strict';

    angular
        .module('common')
        .service('UrlService', UrlService);

    UrlService.$inject = ['$window'];

    function UrlService($window) {
        this.getFragment = getFragment;
        this.parseQueryString = parseQueryString;
        this.getQueryString = getQueryString;
        this.resetQueryStringWindow = resetQueryStringWindow;
        this.setWindowLocation = setWindowLocation;
        this.isWindowLocationChanging = isWindowLocationChanging;

        var _isWindowLocationChanging = false;

        function getFragment() {
            if ($window.location.hash.indexOf("#") === 0) {
                return parseQueryString($window.location.hash.substr(1));
            } else {
                return {};
            }
        }

        function getQueryString() {
            if ($window.location.search.indexOf("?") === 0) {
                return parseQueryString($window.location.search.substr(1));
            }
            else {
                return null;
            }
        }

        function parseQueryString(queryString) {
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

        function encodeQueryString(data) {
            var ret = [];
            for (var d in data) {
                if (data[d]) {
                    ret.push(encodeURIComponent(d) + "=" + encodeURIComponent(data[d]));
                }
            }
            return ret.join("&");
        }

        function resetQueryStringWindow(data) {
            var qs = encodeQueryString(data);
            if (qs) {
                qs = '?' + qs;
            }

            // TODO: Somehow the question mark won't go away when we clear the query string.
            // Not a big deal, but maybe worth looking into at some point.
            $window.location.search = qs || '';
            _isWindowLocationChanging = true;
        }

        function isWindowLocationChanging() {
            return _isWindowLocationChanging;
        }

        function setWindowLocation(url, objectOnly) {
            if (objectOnly) {
                // We are only setting the object on the Facebook signin.
                // Verify if this is correct, but read that setting just the
                // object does not require SAME ORIGIN.
                // http://stackoverflow.com/questions/2383401/javascript-setting-location-href-versus-location
                $window.location = url;
            }
            else {
                $window.location.href = url;
            }

            _isWindowLocationChanging = true;
        }
    }
})();