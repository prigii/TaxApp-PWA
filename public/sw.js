self.addEventListener("install", (event) => {
  console.log("Service worker installed");
  // Pre-cache important assets here
});

self.addEventListener("activate", (event) => {
  console.log("Service worker activated");
  // Perform cleanup or other tasks here
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return (
        response ||
        fetch(event.request).then((fetchResponse) => {
          return caches.open("dynamic-cache").then((cache) => {
            cache.put(event.request, fetchResponse.clone());
            return fetchResponse;
          });
        })
      );
    })
  );
});
