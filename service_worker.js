/*I thought that this will be the easiest part but while coding service_worker.js I had so many
questions and so many errors. My biggest problem was caching all requests. 
At first I tried to do it in the 'install' event, but all static files were not enough to render
the whole website. I could only cache a few static files (the one in the comment in the 'install'
event in the array) while my network log in devTools was showing much more requests being send.
So I abandoned 'install' event and cached everything in the 'fetch' event. I'm quite new to service
workers so I will appreciate any kind of feedback.*/

/*  I named my only cache in the app and stored it in the variable */
var cacheName = 'Global_cache2';
var fileArr = ["data/restaurants.json", "css/styles.css", "css/styles_for_sub_page.css", "index.html", "restaurant.html", "js/dbhelper.js", "js/main.js", "js/restaurant_info.js", "service_worker.js"];


/*When service worker is installing I'm caching all static files */
self.addEventListener('install', function runWhenInstalling(event){
	event.waitUntil(
    caches.open(cacheName).then(function(cache) {
     	 return cache.addAll(fileArr);
    })
  );
});	

/*Here I no longer cache everything. I just check if I
already cached the request and if yes than serve it. If no than I go to the network.*/
self.addEventListener('fetch', function cachingOrServingRequests(event) {
  event.respondWith(
  	caches.match(event.request).then(function checkIfInCache(response){
  		if (response) return response; 
  		return fetch(event.request);
  	})
    )
});

/*Now this bit here is for the future. If I will ever have more caches than one
than I will delete the ones that are not needed*/
self.addEventListener('activate', function cachesCleanUp(event){
	event.waitUntil(
		caches.keys().then(function deleteTheCachesIdontNeed(cacheNames){
			return Promise.all(
				cacheNames.filter(function(cache){
					return cache !== cacheName;
				}).map(function removeFilteredCaches(cache_to_remove){
					return cache.delete(cache_to_remove);
				})
			);
		})
		)
});
/*And that's it. I'm really curious how could I improve that code*/