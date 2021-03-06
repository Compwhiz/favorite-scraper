/// <reference path="../../references" />

module imgur {
    export class ImgurController {
        static $inject = ['ImgurService'];
        public favorites: any;
        public account: any;

        constructor(private ImgurService: services.ImgurService) {
            this.getFavorites();
        }

        getAccount() {
            this.ImgurService.getAccount().then(response=> {
                this.account = response;
            }).catch(error => {
                console.log(error);
            });
        }

        getFavorites() {
            this.ImgurService.getFavorites().then(response=> {
                this.favorites = response.data;
            }).catch(error => {
                console.log(error);
            });
        }

        getAlbumImages(album) {
            if (album) {
                this.ImgurService.getAlbumInfo(album).then(response => {
                    album.images = response.data.images;
                }).catch(error=> {
                    console.log(error);
                });
            }
        }

        refresh() {
            this.ImgurService.refresh();
        }
    }
}

(() => {
    angular.module('imgur').controller('ImgurController', imgur.ImgurController);
})();