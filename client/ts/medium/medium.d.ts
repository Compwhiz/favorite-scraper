/// <reference path="../common/common.d.ts" />
/// <reference path="./services/medium.service.ts" />

declare module medium {
	interface User {
		id?: string;
		username?: string;
		name?: string;
		url?: string;
		imageUrl?: string;
	}
}