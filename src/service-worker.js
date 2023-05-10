/**
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
*/

// DO NOT EDIT THIS GENERATED OUTPUT DIRECTLY!
// This file should be overwritten as part of your build process.
// If you need to extend the behavior of the generated service worker, the best approach is to write
// additional code and include it using the importScripts option:
//   https://github.com/GoogleChrome/sw-precache#importscripts-arraystring
//
// Alternatively, it's possible to make changes to the underlying template file and then use that as the
// new base for generating output, via the templateFilePath option:
//   https://github.com/GoogleChrome/sw-precache#templatefilepath-string
//
// If you go that route, make sure that whenever you update your sw-precache dependency, you reconcile any
// changes made to this original template file with your modified copy.

// This generated service worker JavaScript will precache your site's resources.
// The code needs to be saved in a .js file at the top-level of your site, and registered
// from your pages in order to be used. See
// https://github.com/googlechrome/sw-precache/blob/master/demo/app/js/service-worker-registration.js
// for an example of how you can register this script and handle various service worker events.

/* eslint-env worker, serviceworker */
/* eslint-disable indent, no-unused-vars, no-multiple-empty-lines, max-nested-callbacks, space-before-function-paren, quotes, comma-spacing */
'use strict';

var precacheConfig = [["144x144.png","cb14b462ce5a39d250ccf71a5fcbf9d7"],["192x192.png","3ef41b8725ca1031cd3cb59d4623ac66"],["512x512.png","6d7d209a573a50ff3f134022fe99915d"],["app.css","69fabb6b7729b13e0b34d0fedf44599a"],["app.tsx","e28705ef343190f6dfb909f13c707361"],["components/input-area.css","12d6c6282ef534301aea3738a4f555c0"],["components/input-area.tsx","8ce04404ce0428c6414aae27d3f4c20a"],["components/loading-indicator.css","0186fb2893fd5a243ff0ae86dfb51921"],["components/loading-indicator.tsx","2ab3c59d7069fe6834d73c216f1f971b"],["components/message-feed.css","bfbb777b887584b0243bd48be7877d92"],["components/message-feed.tsx","14d449c6e787bb98ca4d8332420d7c53"],["components/settings-button.css","9e7fdd2c410d925da5165be8f8165993"],["components/settings-button.tsx","933b48de40a48de34ac037ec04b6c674"],["components/settings-menu.css","a6966d01685083faf666ecb940391011"],["components/settings-menu.tsx","8b3cb7a574558d869f212b77e6846b2d"],["components/svg/decorative-image-svg.css","0cbcfb2c9649d600446bcf7891e89cfd"],["components/svg/decorative-image-svg.tsx","f0b87d5e160ebd4bf90dade4ebd81cb9"],["components/svg/settings.icon-svg.tsx","b5fefbd4f16ed71a46808868d01f14ad"],["dist/144x144.png","6f9d99ac1ee8652ba5d795d31a619b47"],["dist/assets/app-6e8cd6e0.css","4dcfaba7045842824c3a24ea45d4afb5"],["dist/assets/app-c94c5518.js","347f3f46f60efa8eef1bfb652c4f4114"],["dist/assets/chunk-HNLFKTAJ-06d0cf7f.js","e5fd6a777e9500bb28f615e2c80de595"],["dist/assets/index-08941e6a.js","8651f91d13c54607c63ad848012623d4"],["dist/assets/index-31ca9438.css","8004de93ebe64c44649ede0d4c7553da"],["dist/assets/os-7c1cab05.js","d18504c4c80f5cedc142df542af4ca05"],["dist/assets/tauri-fs-interface-35431745.js","c0f580914d693207a08982beba2a281e"],["dist/assets/web-mock-fs-interface-87362062.js","b663e47b58b7eb96cea38e7d812e71e2"],["dist/index.html","58896cce13ec6232dbd960e30b6960a0"],["helpers/detectSafariOniOS.ts","618af07a846676113a9e6c3d5200569d"],["helpers/format-response.tsx","68eafeabe40c30a7dbf710089c833d7f"],["helpers/fs-interface.ts","38d9dd3df166723fb862643b44f84ba9"],["helpers/osData.ts","7235bf81a53c036ac13864ec116d3204"],["helpers/tauri-fs-interface.ts","4b54589174cb48b1c937c0cb9b2e7d3d"],["helpers/web-mock-fs-interface.ts","5a5e90db4640f64cd3ff9ed8d1ae97b2"],["index.html","73ddac37faa8a6d8417d27c6e8e1d766"],["integrations/chat-gpt-config.ts","ca08e2533b782aa42ec286974ad7a99c"],["integrations/chat-gpt.ts","868cdac0820424de3ad475477ac70974"],["integrations/text-to-speech.ts","b5be8c9fd27e1fa7f7c756a9f56c81c4"],["main.css","525451ccc7934891beabef104399be5f"],["main.tsx","eb0868350dbc4116de58b9222ccae81a"],["manifest.json","378cbeb6fb3a6d10933ba52243b0a826"],["types/message-info.ts","6a424dc2519559620578e6ff4373e489"],["vite-env.d.ts","0352474ba2918efe13895edbc3780d94"]];
var cacheName = 'sw-precache-v3-sw-precache-' + (self.registration ? self.registration.scope : '');


var ignoreUrlParametersMatching = [/^utm_/];



var addDirectoryIndex = function(originalUrl, index) {
    var url = new URL(originalUrl);
    if (url.pathname.slice(-1) === '/') {
      url.pathname += index;
    }
    return url.toString();
  };

var cleanResponse = function(originalResponse) {
    // If this is not a redirected response, then we don't have to do anything.
    if (!originalResponse.redirected) {
      return Promise.resolve(originalResponse);
    }

    // Firefox 50 and below doesn't support the Response.body stream, so we may
    // need to read the entire body to memory as a Blob.
    var bodyPromise = 'body' in originalResponse ?
      Promise.resolve(originalResponse.body) :
      originalResponse.blob();

    return bodyPromise.then(function(body) {
      // new Response() is happy when passed either a stream or a Blob.
      return new Response(body, {
        headers: originalResponse.headers,
        status: originalResponse.status,
        statusText: originalResponse.statusText
      });
    });
  };

var createCacheKey = function(originalUrl, paramName, paramValue,
                           dontCacheBustUrlsMatching) {
    // Create a new URL object to avoid modifying originalUrl.
    var url = new URL(originalUrl);

    // If dontCacheBustUrlsMatching is not set, or if we don't have a match,
    // then add in the extra cache-busting URL parameter.
    if (!dontCacheBustUrlsMatching ||
        !(url.pathname.match(dontCacheBustUrlsMatching))) {
      url.search += (url.search ? '&' : '') +
        encodeURIComponent(paramName) + '=' + encodeURIComponent(paramValue);
    }

    return url.toString();
  };

var isPathWhitelisted = function(whitelist, absoluteUrlString) {
    // If the whitelist is empty, then consider all URLs to be whitelisted.
    if (whitelist.length === 0) {
      return true;
    }

    // Otherwise compare each path regex to the path of the URL passed in.
    var path = (new URL(absoluteUrlString)).pathname;
    return whitelist.some(function(whitelistedPathRegex) {
      return path.match(whitelistedPathRegex);
    });
  };

var stripIgnoredUrlParameters = function(originalUrl,
    ignoreUrlParametersMatching) {
    var url = new URL(originalUrl);
    // Remove the hash; see https://github.com/GoogleChrome/sw-precache/issues/290
    url.hash = '';

    url.search = url.search.slice(1) // Exclude initial '?'
      .split('&') // Split into an array of 'key=value' strings
      .map(function(kv) {
        return kv.split('='); // Split each 'key=value' string into a [key, value] array
      })
      .filter(function(kv) {
        return ignoreUrlParametersMatching.every(function(ignoredRegex) {
          return !ignoredRegex.test(kv[0]); // Return true iff the key doesn't match any of the regexes.
        });
      })
      .map(function(kv) {
        return kv.join('='); // Join each [key, value] array into a 'key=value' string
      })
      .join('&'); // Join the array of 'key=value' strings into a string with '&' in between each

    return url.toString();
  };


var hashParamName = '_sw-precache';
var urlsToCacheKeys = new Map(
  precacheConfig.map(function(item) {
    var relativeUrl = item[0];
    var hash = item[1];
    var absoluteUrl = new URL(relativeUrl, self.location);
    var cacheKey = createCacheKey(absoluteUrl, hashParamName, hash, false);
    return [absoluteUrl.toString(), cacheKey];
  })
);

function setOfCachedUrls(cache) {
  return cache.keys().then(function(requests) {
    return requests.map(function(request) {
      return request.url;
    });
  }).then(function(urls) {
    return new Set(urls);
  });
}

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return setOfCachedUrls(cache).then(function(cachedUrls) {
        return Promise.all(
          Array.from(urlsToCacheKeys.values()).map(function(cacheKey) {
            // If we don't have a key matching url in the cache already, add it.
            if (!cachedUrls.has(cacheKey)) {
              var request = new Request(cacheKey, {credentials: 'same-origin'});
              return fetch(request).then(function(response) {
                // Bail out of installation unless we get back a 200 OK for
                // every request.
                if (!response.ok) {
                  throw new Error('Request for ' + cacheKey + ' returned a ' +
                    'response with status ' + response.status);
                }

                return cleanResponse(response).then(function(responseToCache) {
                  return cache.put(cacheKey, responseToCache);
                });
              });
            }
          })
        );
      });
    }).then(function() {
      
      // Force the SW to transition from installing -> active state
      return self.skipWaiting();
      
    })
  );
});

self.addEventListener('activate', function(event) {
  var setOfExpectedUrls = new Set(urlsToCacheKeys.values());

  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.keys().then(function(existingRequests) {
        return Promise.all(
          existingRequests.map(function(existingRequest) {
            if (!setOfExpectedUrls.has(existingRequest.url)) {
              return cache.delete(existingRequest);
            }
          })
        );
      });
    }).then(function() {
      
      return self.clients.claim();
      
    })
  );
});


self.addEventListener('fetch', function(event) {
  if (event.request.method === 'GET') {
    // Should we call event.respondWith() inside this fetch event handler?
    // This needs to be determined synchronously, which will give other fetch
    // handlers a chance to handle the request if need be.
    var shouldRespond;

    // First, remove all the ignored parameters and hash fragment, and see if we
    // have that URL in our cache. If so, great! shouldRespond will be true.
    var url = stripIgnoredUrlParameters(event.request.url, ignoreUrlParametersMatching);
    shouldRespond = urlsToCacheKeys.has(url);

    // If shouldRespond is false, check again, this time with 'index.html'
    // (or whatever the directoryIndex option is set to) at the end.
    var directoryIndex = 'index.html';
    if (!shouldRespond && directoryIndex) {
      url = addDirectoryIndex(url, directoryIndex);
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond is still false, check to see if this is a navigation
    // request, and if so, whether the URL matches navigateFallbackWhitelist.
    var navigateFallback = '';
    if (!shouldRespond &&
        navigateFallback &&
        (event.request.mode === 'navigate') &&
        isPathWhitelisted([], event.request.url)) {
      url = new URL(navigateFallback, self.location).toString();
      shouldRespond = urlsToCacheKeys.has(url);
    }

    // If shouldRespond was set to true at any point, then call
    // event.respondWith(), using the appropriate cache key.
    if (shouldRespond) {
      event.respondWith(
        caches.open(cacheName).then(function(cache) {
          return cache.match(urlsToCacheKeys.get(url)).then(function(response) {
            if (response) {
              return response;
            }
            throw Error('The cached response that was expected is missing.');
          });
        }).catch(function(e) {
          // Fall back to just fetch()ing the request if some unexpected error
          // prevented the cached response from being valid.
          console.warn('Couldn\'t serve response for "%s" from cache: %O', event.request.url, e);
          return fetch(event.request);
        })
      );
    }
  }
});







