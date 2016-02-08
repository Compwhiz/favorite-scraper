/// <reference path="../references.d.ts" />

module common {
    
    export function Run(UserService:user.services.UserService){
        UserService.getCurrentUser();
    }
}

(()=>{
    let commonModule = angular.module('common',[]);
    
    commonModule.run(['UserService', common.Run]);
    
    commonModule.value('INFINITE_SCROLL_THROTTLE_MILLISECONDS', 1000);
})();