/// <reference path="../references.d.ts" />

module common {

}

(()=>{
    var commonModule = angular.module('common',[]);
    
    commonModule.value('INFINITE_SCROLL_THROTTLE_MILLISECONDS', 1000);
})();