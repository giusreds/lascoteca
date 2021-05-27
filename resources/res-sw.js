// (c)2020 Giuseppe Rossi
// Remote Service Worker

// Set a name for the current cache
const cacheName = 'lascoteca';

// Default files to always cache
var cacheFiles = [];
// Not to be cached
var blackList = [
	'script.google.com',
	'countapi.xyz',        // API Contatore
	'google-analytics',	   // Google Analytics
	'analytics.google.com',
	'googletagmanager.com'
];

// Calc the cacheName
var slh = self.location.href;
var cacheVersion = slh.substring(slh.search("html/") + 5, slh.search("/resources"));
var _cache = cacheName + "_" + cacheVersion;

self.addEventListener('install', function (e) {
	console.log('[RemoteServiceWorker] Installed');

	// e.waitUntil Delays the event until the Promise is resolved
	e.waitUntil(

		// Open the cache
		caches.open(_cache).then(function (cache) {

			// Add all the default files to the cache
			console.log('[RemoteServiceWorker] Caching cacheFiles');
			return cache.addAll(cacheFiles);
		})
	); // end e.waitUntil
});


self.addEventListener('activate', function (e) {
	console.log('[RemoteServiceWorker] Activated');

	e.waitUntil(

		// Get all the cache keys (cacheName)
		caches.keys().then(function (cacheNames) {
			return Promise.all(cacheNames.map(function (thisCacheName) {

				// If a cached item is saved under a previous cacheName
				if (thisCacheName.includes(cacheName) && thisCacheName != _cache) {

					// Delete that cached file
					console.log('[RemoteServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
					return caches.delete(thisCacheName);
				}
			}));
		})
	); // end e.waitUntil

});


self.addEventListener('fetch', function (e) {
	console.log('[RemoteServiceWorker] Fetch', e.request.url);

	if (e.request.method != 'GET' || isBlackListed(e.request.url)) {
		console.log("[RemoteServiceWorker] Request not cached", e.request.url);
		return;
	}

	// e.respondWidth Responds to the fetch event
	e.respondWith(

		// Check in cache for the request being made
		caches.match(e.request)


			.then(function (response) {

				// If the request is in the cache
				if (response) {
					console.log("[RemoteServiceWorker] Found in Cache", e.request.url, response);
					// Return the cached version
					return response;
				}
				// If the request is NOT in the cache, fetch and cache
				return fetch(e.request)
					.then(function (response) {

						if (!response) {
							console.log("[RemoteServiceWorker] No response from fetch ")
							return response;
						}

						//  Open the cache
						return caches.open(_cache).then(function (cache) {

							// Put the fetched response in the cache
							cache.put(e.request, response.clone());
							console.log('[RemoteServiceWorker] New Data Cached', e.request.url);

							// Return the response
							return response;


						}); // end caches.open

					})
					.catch(function (err) {
						console.log('[RemoteServiceWorker] Error Fetching & Caching New Data', err);
					});


			}) // end caches.match(e.request)
	); // end e.respondWith
});


// Detect if URL is blacklisted
function isBlackListed(str) {
	for (var i = 0; i < blackList.length; i++) {
		if (str.indexOf(blackList[i]) != -1)
			return true;
	}
	return false;
}