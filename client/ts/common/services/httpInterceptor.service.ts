/// <reference path="../../references.d.ts" />

module common.services {
    export class HttpInterceptorService {

        static $inject = ['$injector','NotificationService'];

        constructor(private $injector:any, private NotificationService: NotificationService) {
        }

        static factory() {
            var factory = ($injector:any, NotificationService: NotificationService) => new HttpInterceptorService($injector,NotificationService);
            factory.$inject = HttpInterceptorService.$inject;
            return factory;
        }

        public responseError = (response) => {
            if (response.status === 400) {
                this.NotificationService.showError(response.data);
            }
            else if (response.status === 403) {
                this.$injector.get('$state').transitionTo('login');                    
            }
            return response;
        }
    }
}

(() => {
    angular
        .module('common')
        .service('HttpInterceptorService', common.services.HttpInterceptorService.factory());
})();