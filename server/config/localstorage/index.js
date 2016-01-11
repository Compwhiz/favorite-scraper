(function () {
	if (typeof localStorage === 'undefined' || localStorage === null) {
		var LocalStoreage = require('node-localstorage').LocalStorage;
		localStorage = new LocalStoreage('../../store');
	}
	module.exports = localStorage;
})();