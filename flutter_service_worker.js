'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "867de327dcdd4d7efe7b51735a142bb4",
"manifest.json": "c0cf6f60f41ea8e9cf846e8b0cad5a80",
"assets/NOTICES": "8acb62942edfdd75ee016056eac48011",
"assets/FontManifest.json": "b30a0ed7ff2d8828e42d7cb4edeba977",
"assets/fonts/MaterialIcons-Regular.otf": "4e6447691c9509f7acdbf8a931a85ca1",
"assets/AssetManifest.json": "8c6eac20edc7d0adf9085e656e19f33b",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/assets/fonts/Montserrat-Bold.ttf": "ade91f473255991f410f61857696434b",
"assets/assets/fonts/Montserrat-BoldItalic.ttf": "1b38414956c666bd1df78fe5b9c84756",
"assets/assets/fonts/Montserrat-Medium.ttf": "c8b6e083af3f94009801989c3739425e",
"assets/assets/fonts/Montserrat-Regular.ttf": "ee6539921d713482b8ccd4d0d23961bb",
"assets/assets/fonts/Montserrat-SemiBold.ttf": "c641dbee1d75892e4d88bdc31560c91b",
"assets/assets/fonts/Montserrat-Italic.ttf": "a7063e0c0f0cb546ad45e9e24b27bd3b",
"assets/assets/images/download_app_store.png": "2fee1a53dae55720065b8a280ab5d41b",
"assets/assets/images/camera_logo.png": "d427e6159c2e3662513c10a8c84b95b9",
"assets/assets/images/background_secao3_landing_page.png": "a4727b65eb1b4435cac6a1a5de2d364a",
"assets/assets/images/reg_med_glicemia.png": "defd66f91905d5a2a782e542d909640e",
"assets/assets/images/reg_med_temperatura.png": "4afeeade8e8681499a767fd33e6751ea",
"assets/assets/images/thina_logo.png": "b15fc5c14a69e9dc9cd273fcbbeea4d3",
"assets/assets/images/reg_med_altura.png": "ddaf015288a51cfcffc28691d1d56fcd",
"assets/assets/images/instagram_logo.png": "4e5b3f8fec6cf03c2d781751cd407693",
"assets/assets/images/reg_med_frequencia_respiratoria.png": "d40ff22d02a541d237153a0324019e79",
"assets/assets/images/facebook_logo.png": "853286ab66077bcbbd8ad5ad33fc9487",
"assets/assets/images/reg_med_saturacao.png": "c90e06fdca572d739cb582bc4c5b29dc",
"assets/assets/images/background_onda.png": "d8d7afbb6a0c698bbb5802f1f9d6b629",
"assets/assets/images/reg_med_frequencia_cardiaca.png": "9d118183d723a2ab5489a336d5a6e605",
"assets/assets/images/download_google_play_store.png": "b03527fa5f1405cfb82285238e2599ec",
"assets/assets/images/alvo.png": "e6a69467d87a8adf7ae958abd58bbe51",
"assets/assets/images/medico.png": "2df39e35859e157c4201fb05c55ce933",
"assets/assets/images/thina_logo_branca.png": "a29c43ab6a0f0c42553de6e150bfcc6d",
"assets/assets/images/reg_med_pressao_arterial.png": "5cab18ec924fcb66a502f0ef5024e3b7",
"assets/assets/images/whats_app_logo.png": "e04602e76426bc030e8ea07312e4acf8",
"assets/assets/images/seguro.png": "f02358a7108131d6255529f3ce8ad52c",
"assets/assets/images/thina_logo_azul_claro.png": "9285e1cb8047ce9ae37e1e1feb731240",
"assets/assets/images/arrow_down_logo.png": "9830059edb448a957115f08381b36b1d",
"assets/assets/images/reg_med_peso.png": "3b2ea96f9624153310d6e42f98080c11",
"assets/assets/images/descomplicado.png": "f30bf07293d3356e5a0c935a19fffed5",
"main.dart.js": "ca6da8d0cd41ead49bb597f814e662aa",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"index.html": "12bba4ed738295686bc68c22d261f077",
"/": "12bba4ed738295686bc68c22d261f077"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
