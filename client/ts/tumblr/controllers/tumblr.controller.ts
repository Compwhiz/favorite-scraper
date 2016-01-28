/// <reference path="../../references" />

module tumblr {
    export class TumblrController {
        static $inject = ['TumblrService'];

        constructor(private TumblrService: TumblrService) {

        }
    }
}

(() => {
    angular.module('tumblr').controller('TumblrController', tumblr.TumblrController);
})();