// Vang de drie standaard events op: install, activate en fetch.

// TODO: versie veranderen.
const STATIC_CACHE_NAME = "static-version-6";
const DYNAMIC_CACHE_NAME = "dynamic-version-6";

// TODO: links aanpassen.
// Array met alle static files die gecached moeten worden.
const staticFiles = [
    '../ConnectorApp%20V6%20-%20firestore%20database/',
    'index.html',
    'pages/about.html',
    'styles/mystyle.css',
    'scripts/myscript.js',
    'scripts/app.js',
    'images/db9.jpg',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
    'manifest.json',
    'pages/fallback.html'
];

// Vang het 'install' event op en laat iets weten.
self.addEventListener("install", (event) => {
    console.log("Service worker installed: ", event);

    event.waitUntil(
        caches.open(STATIC_CACHE_NAME).then(cache => {
            console.log("Caching static files.");
            cache.addAll(staticFiles);
        })
    );
});

// Vang het 'activate' event op.
self.addEventListener("activate", (event) => {
    console.log("Service worker activated: ", event);

    event.waitUntil(
        caches.keys().then(keys => {
            console.log("Cache keys: ", keys);

            // Wacht tot alle promises 'resolved' zijn.
            return Promise.all(
                // Gebruik de filter functie, om een nieuw array aan te maken dat enkel de cache names
                // bevat die niet tot de huidige versie behoren.
                keys.filter(key => ((key !== STATIC_CACHE_NAME) && (key !== DYNAMIC_CACHE_NAME)))
                // Gebruik het gefilterd array, om de oude caches te wissen.
                .map(key => caches.delete(key))


                // Zie: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
                // Zie: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
            )
        })
    );
});

// TODO: fetch event even in commentaar zetten, om eerst ervaring op te doen met Firestore.
// Vang het 'fetch' event op.
self.addEventListener("fetch", (event) => {
    // console.log("Fetch event: ", event);

    // event.respondWith(
    //     caches.match(event.request).then(cacheResponse => {
    //         return cacheResponse || fetch(event.request).then(fetchResponse => {
    //             return caches.open(DYNAMIC_CACHE_NAME).then(cache => {
    //                 cache.put(event.request.url, fetchResponse.clone());
    //                 return fetchResponse;
    //             })
    //         })
    //         // Voeg hier het catch-gedeelte toe... Om te verwijzen naar een fallback.html.
    //         .catch(() => {
    //             // Stel een extra voorwaarde in, zodat je de fallback enkel toont indien
    //             // je een html-bestand opvraagt.
    //             if(event.request.url.indexOf('.html') >= 0)
    //                 return caches.match('pages/fallback.html');
    //         });
    //     })
    // );
});