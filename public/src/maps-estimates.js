(function () {
  var mapsLoadPromise = null;
  var mapsRequested = false;
  var MAPS_KEY_STORAGE = "velvet-google-maps-api-key";
  var lastLoadError = "";
  var breakerOpenUntil = 0;
  var RETRY_DELAYS_MS = [500, 1500];
  var SCRIPT_TIMEOUT_MS = 15000;

  function setLoadError(code, details) {
    lastLoadError = code + (details ? (": " + details) : "");
    try {
      console.warn("[VelvetMaps] " + lastLoadError);
    } catch (e) {}
  }

  function getConfig() {
    var base = window.VELVET_MAPS_CONFIG || {};
    var secureKey = window.__VELVET_GOOGLE_MAPS_API_KEY || getStoredApiKey();
    if (secureKey) base.apiKey = secureKey;
    return base;
  }
  function getStoredApiKey() {
    try {
      return localStorage.getItem(MAPS_KEY_STORAGE) || "";
    } catch (e) {
      return "";
    }
  }
  function setStoredApiKey(key) {
    try {
      if (key) localStorage.setItem(MAPS_KEY_STORAGE, key);
      else localStorage.removeItem(MAPS_KEY_STORAGE);
      return true;
    } catch (e) {
      return false;
    }
  }

  function parseDateTime(dateStr, timeStr) {
    if (!dateStr || !timeStr) return null;
    var dt = new Date(dateStr + "T" + timeStr);
    if (isNaN(dt.getTime())) return null;
    return dt;
  }

  function formatDuration(minutes) {
    if (!minutes || minutes <= 0) return "";
    var h = Math.floor(minutes / 60);
    var m = Math.round(minutes % 60);
    if (!h) return m + " min";
    if (!m) return h + " hr";
    return h + " hr " + m + " min";
  }

  function formatTime(date) {
    if (!date || isNaN(date.getTime())) return "";
    return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false });
  }

  function sleep(ms) {
    return new Promise(function (resolve) { window.setTimeout(resolve, ms); });
  }

  function resetMapsScriptTag() {
    try {
      var tags = document.querySelectorAll("script[src*='maps.googleapis.com/maps/api/js']");
      tags.forEach(function (tag) {
        if (tag && tag.parentNode) tag.parentNode.removeChild(tag);
      });
    } catch (e) {}
  }

  function renderMapFallback(targetEl, message) {
    if (!targetEl) return;
    targetEl.innerHTML =
      '<div style="display:flex;align-items:center;justify-content:center;height:100%;padding:1rem;text-align:center;color:rgba(247,242,232,0.72);font-size:0.82rem;line-height:1.5;background:rgba(10,9,14,0.42);border:1px solid rgba(255,255,255,0.08);border-radius:8px;">' +
      (message || "Map is temporarily unavailable. Route pricing and booking continue as normal.") +
      "</div>";
  }

  function installGoogleErrorOverlayGuard(targetEl) {
    if (!targetEl || typeof MutationObserver === "undefined") return function () {};
    var inactive = false;
    var detectAndReplace = function () {
      if (inactive || !targetEl) return;
      var text = (targetEl.textContent || "").toLowerCase();
      if (
        text.indexOf("oops! something went wrong") !== -1 &&
        text.indexOf("this page didn't load google maps correctly") !== -1
      ) {
        inactive = true;
        renderMapFallback(
          targetEl,
          "Map is unavailable on this deployment due to Google Maps domain restrictions. Booking and fare estimates continue normally."
        );
      }
    };
    var observer = new MutationObserver(detectAndReplace);
    observer.observe(targetEl, { childList: true, subtree: true, characterData: true });
    window.setTimeout(detectAndReplace, 0);
    window.setTimeout(detectAndReplace, 1200);
    window.setTimeout(detectAndReplace, 2600);
    return function () {
      inactive = true;
      try { observer.disconnect(); } catch (e) {}
    };
  }

  function shouldRetry(errorCode) {
    return errorCode === "script_load_failed" || errorCode === "script_load_timeout";
  }

  function loadMapsApi() {
    var cfg = getConfig();
    if (window.google && window.google.maps) return Promise.resolve(window.google.maps);
    if (!cfg.apiKey) {
      setLoadError("missing_api_key");
      return Promise.reject(new Error("Google Maps API key missing. Set via VelvetMapsEstimator.setApiKey('YOUR_KEY')"));
    }
    if (Date.now() < breakerOpenUntil) {
      setLoadError("circuit_open", "Maps loader temporarily paused after repeated failures.");
      return Promise.reject(new Error("Google Maps loader temporarily paused. Retry shortly."));
    }
    if (mapsLoadPromise) return mapsLoadPromise;

    mapsLoadPromise = (async function () {
      var attempt = 0;
      while (attempt <= RETRY_DELAYS_MS.length) {
        try {
          var result = await new Promise(function (resolve, reject) {
            var cbName = "__velvetMapsReady_" + Date.now() + "_" + Math.floor(Math.random() * 10000);
            var timeoutId = null;
            var settled = false;
            var cleanup = function () {
              if (timeoutId) {
                window.clearTimeout(timeoutId);
                timeoutId = null;
              }
              try { delete window[cbName]; } catch (e) {}
            };
            var fail = function (errorCode, message) {
              if (settled) return;
              settled = true;
              cleanup();
              resetMapsScriptTag();
              setLoadError(errorCode, message || "");
              reject(new Error(errorCode));
            };

            resetMapsScriptTag();
            window[cbName] = function () {
              settled = true;
              cleanup();
              resolve(window.google.maps);
            };
            window.gm_authFailure = function () {
              fail("auth_failure", "Google Maps auth failure (key/referrer restriction).");
            };
            var script = document.createElement("script");
            var src = "https://maps.googleapis.com/maps/api/js?key=" + encodeURIComponent(cfg.apiKey) +
              "&libraries=places&region=" + encodeURIComponent(cfg.region || "IN") +
              "&language=" + encodeURIComponent(cfg.language || "en") +
              "&callback=" + cbName;
            script.src = src;
            script.async = true;
            script.defer = true;
            script.onerror = function () { fail("script_load_failed", "Failed to load Google Maps API script."); };
            timeoutId = window.setTimeout(function () {
              fail("script_load_timeout", "Google Maps script timed out.");
            }, SCRIPT_TIMEOUT_MS);
            document.head.appendChild(script);
          });
          lastLoadError = "";
          mapsLoadPromise = Promise.resolve(result);
          return result;
        } catch (err) {
          var code = String((err && err.message) || "");
          if (!shouldRetry(code) || attempt >= RETRY_DELAYS_MS.length) {
            if (!shouldRetry(code)) breakerOpenUntil = Date.now() + 30000;
            mapsLoadPromise = null;
            throw err;
          }
          await sleep(RETRY_DELAYS_MS[attempt]);
        }
        attempt += 1;
      }
      mapsLoadPromise = null;
      throw new Error("script_load_failed");
    })();

    return mapsLoadPromise;
  }

  function estimateTrip(payload) {
    return loadMapsApi().then(function () {
      return new Promise(function (resolve, reject) {
        if (!payload || !payload.origin || !payload.destination) {
          reject(new Error("Missing origin/destination"));
          return;
        }
        var svc = new google.maps.DistanceMatrixService();
        var departure = parseDateTime(payload.travelDate, payload.travelTime) || new Date();
        svc.getDistanceMatrix({
          origins: [payload.origin],
          destinations: [payload.destination],
          travelMode: google.maps.TravelMode.DRIVING,
          unitSystem: google.maps.UnitSystem.METRIC,
          drivingOptions: { departureTime: departure, trafficModel: "bestguess" }
        }, function (res, status) {
          if (status !== "OK" || !res || !res.rows || !res.rows[0] || !res.rows[0].elements || !res.rows[0].elements[0]) {
            reject(new Error("Distance Matrix request failed"));
            return;
          }
          var el = res.rows[0].elements[0];
          if (el.status !== "OK" || !el.distance || !el.duration) {
            reject(new Error("Route unavailable"));
            return;
          }
          var distanceMeters = el.distance.value || 0;
          var durationSeconds = (el.duration_in_traffic && el.duration_in_traffic.value) || el.duration.value || 0;
          var durationMinutes = Math.max(1, Math.round(durationSeconds / 60));
          var distanceKm = Math.max(0, Math.round((distanceMeters / 1000) * 10) / 10);
          var pickup = parseDateTime(payload.travelDate, payload.travelTime) || new Date();
          var drop = new Date(pickup.getTime() + durationMinutes * 60000);
          resolve({
            distanceKm: distanceKm,
            distanceText: el.distance.text || (distanceKm + " km"),
            durationMinutes: durationMinutes,
            durationText: formatDuration(durationMinutes),
            estimatedDropTime: formatTime(drop)
          });
        });
      });
    });
  }

  function estimateAndStore(store) {
    if (!store || !store.pickupLocation || !store.dropLocation) {
      return Promise.resolve(false);
    }
    return estimateTrip({
      origin: store.pickupLocation,
      destination: store.dropLocation,
      travelDate: store.travelDate,
      travelTime: store.travelTime
    }).then(function (meta) {
      var changed = false;
      ["distanceKm", "distanceText", "durationMinutes", "durationText", "estimatedDropTime"].forEach(function (k) {
        if (store[k] !== meta[k]) {
          store[k] = meta[k];
          changed = true;
        }
      });
      if (changed && typeof store.save === "function") store.save();
      return changed;
    }).catch(function () {
      return false;
    });
  }

  function initStyledMap(targetEl, opts) {
    if (!targetEl) return Promise.resolve(null);
    var cfg = getConfig();
    var cleanupGoogleErrorGuard = installGoogleErrorOverlayGuard(targetEl);
    return loadMapsApi().then(function () {
      var center = cfg.defaultCenter || { lat: 28.6139, lng: 77.2090 };
      var bounds = cfg.delhiNcrBounds || { north: 29.05, south: 28.2, west: 76.55, east: 77.65 };
      var VELVET_MAP_STYLE = [
        { elementType: "geometry", stylers: [{ color: "#09080d" }] },
        { elementType: "labels", stylers: [{ visibility: "off" }] },
        { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
        { featureType: "administrative", elementType: "geometry", stylers: [{ visibility: "off" }] },
        { featureType: "administrative.country", elementType: "geometry.stroke", stylers: [{ color: "#1a1525" }] },
        { featureType: "administrative.locality", elementType: "geometry.stroke", stylers: [{ visibility: "off" }] },
        { featureType: "poi", stylers: [{ visibility: "off" }] },
        { featureType: "road", elementType: "geometry", stylers: [{ color: "#14101e" }] },
        { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#1a1525" }] },
        { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#1e1830" }] },
        { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#251e38" }] },
        { featureType: "transit", stylers: [{ visibility: "off" }] },
        { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d0b16" }] }
      ];

      var map = new google.maps.Map(targetEl, {
        center: center,
        zoom: cfg.defaultZoom || 10,
        minZoom: 9,
        maxZoom: 16,
        styles: VELVET_MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        restriction: { latLngBounds: bounds, strictBounds: false }
      });

      if (opts && opts.showHotspots) {
        var hots = (cfg.hotspots || []);
        hots.forEach(function (h) {
          new google.maps.Marker({
            position: { lat: h.lat, lng: h.lng },
            map: map,
            title: h.title || "Hotspot"
          });
        });
      }

      if (opts && opts.origin && opts.destination) {
        var directions = new google.maps.DirectionsService();
        var renderer = new google.maps.DirectionsRenderer({
          map: map,
          suppressMarkers: true,
          polylineOptions: { strokeColor: "#d8b85a", strokeOpacity: 0.9, strokeWeight: 5 }
        });
        directions.route({
          origin: opts.origin,
          destination: opts.destination,
          travelMode: google.maps.TravelMode.DRIVING
        }, function (res, status) {
          if (status !== "OK" || !res || !res.routes || !res.routes[0] || !res.routes[0].legs || !res.routes[0].legs[0]) return;
          renderer.setDirections(res);
          map.fitBounds(res.routes[0].bounds);

          var leg = res.routes[0].legs[0];
          var travelSeconds = (leg.duration_in_traffic && leg.duration_in_traffic.value) || (leg.duration && leg.duration.value) || 0;
          var travelMinutes = Math.max(1, Math.round(travelSeconds / 60));
          var journeyText = opts.durationText || formatDuration(travelMinutes);
          var pickupDate = parseDateTime(opts.travelDate, opts.travelTime) || null;
          var pickupTimeText = opts.travelTime || (pickupDate ? formatTime(pickupDate) : "--:--");
          var dropTimeText = opts.estimatedDropTime || "--:--";
          if (pickupDate && !opts.estimatedDropTime) {
            var dropDate = new Date(pickupDate.getTime() + travelMinutes * 60000);
            dropTimeText = formatTime(dropDate);
          }

          function createCustomOverlay(map, position, html) {
            var overlay = new google.maps.OverlayView();
            overlay.setMap(map);
            var div = null;
            overlay.onAdd = function() {
              div = document.createElement('div');
              div.style.cssText = 'position:absolute;background:#12101a;padding:10px 14px;border-radius:8px;border:1px solid rgba(178,154,240,0.3);color:#f7f2e8;font-family:Outfit,sans-serif;font-size:13px;line-height:1.5;box-shadow:0 10px 30px rgba(0,0,0,0.5);pointer-events:none;z-index:1000;white-space:nowrap;';
              div.innerHTML = html;
              var panes = overlay.getPanes();
              panes.overlayLayer.appendChild(div);
            };
            overlay.draw = function() {
              var projection = overlay.getProjection();
              var pixel = projection.fromLatLngToDivPixel(position);
              if (div && pixel) {
                div.style.left = (pixel.x - div.offsetWidth / 2) + 'px';
                div.style.top = (pixel.y - div.offsetHeight - 14) + 'px';
              }
            };
            overlay.onRemove = function() {
              if (div && div.parentNode) div.parentNode.removeChild(div);
            };
            return overlay;
          }

          var pickupMarker = new google.maps.Marker({
            map: map,
            position: leg.start_location,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#d8b85a",
              fillOpacity: 1,
              strokeColor: "#09080d",
              strokeWeight: 2
            }
          });
          var dropMarker = new google.maps.Marker({
            map: map,
            position: leg.end_location,
            icon: {
              path: google.maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#d8b85a",
              fillOpacity: 1,
              strokeColor: "#09080d",
              strokeWeight: 2
            }
          });

          var distanceMeters = leg.distance ? leg.distance.value : 0;
          var distanceKm = Math.max(0, Math.round((distanceMeters / 1000) * 10) / 10);
          var distanceText = leg.distance ? leg.distance.text : '';
          var store = window.VelvetStore;
          if (store) {
            store.distanceKm = distanceKm;
            store.distanceText = distanceText;
            store.durationText = journeyText;
            store.estimatedDropTime = dropTimeText;
            if (typeof store.save === 'function') store.save();
          }

          var originName = opts.origin || 'Pickup';
          var destName = opts.destination || 'Drop-off';
          var metaLine = '';
          if (distanceText || journeyText || pickupTimeText) {
            metaLine = '<span style="display:block;margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);color:rgba(247,242,232,0.55);font-size:11px;line-height:1.5;">' +
              (distanceText ? distanceText + ' · ' : '') +
              (journeyText ? journeyText + ' · ' : '') +
              'Departing ' + pickupTimeText +
              '</span>';
          }
          var dropMeta = dropTimeText !== '--:--' ? '<span style="display:block;margin-top:6px;padding-top:6px;border-top:1px solid rgba(255,255,255,0.08);color:rgba(247,242,232,0.55);font-size:11px;line-height:1.5;">Arriving ' + dropTimeText + '</span>' : '';
          createCustomOverlay(map, leg.start_location, '<span style="color:#C9A84C;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px;display:block;">Pickup</span><span style="color:#f7f2e8;font-size:13px;font-weight:500;max-width:200px;white-space:normal;word-break:break-word;display:block;line-height:1.4;">' + originName + '</span>' + metaLine);
          createCustomOverlay(map, leg.end_location, '<span style="color:#C9A84C;font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:3px;display:block;">Drop-off</span><span style="color:#f7f2e8;font-size:13px;font-weight:500;max-width:200px;white-space:normal;word-break:break-word;display:block;line-height:1.4;">' + destName + '</span>' + dropMeta);
        });
      }

      return map;
    }).catch(function () {
      if (typeof cleanupGoogleErrorGuard === "function") cleanupGoogleErrorGuard();
      var detail = (typeof lastLoadError === "string" && lastLoadError) ? (" (" + lastLoadError + ")") : "";
      renderMapFallback(targetEl, "Map is temporarily unavailable" + detail + ". Route pricing and booking continue as normal.");
      return null;
    });
  }

  window.VelvetMapsEstimator = {
    loadMapsApi: loadMapsApi,
    estimateTrip: estimateTrip,
    estimateAndStore: estimateAndStore,
    initStyledMap: initStyledMap,
    getApiKey: function () { return getStoredApiKey(); },
    setApiKey: function (key) {
      var ok = setStoredApiKey((key || "").trim());
      if (ok) mapsLoadPromise = null;
      return ok;
    },
    clearApiKey: function () {
      var ok = setStoredApiKey("");
      if (ok) mapsLoadPromise = null;
      return ok;
    },
    getLastLoadError: function () { return lastLoadError; },
    getDebugState: function () {
      return {
        lastLoadError: lastLoadError,
        hasGoogle: !!(window.google && window.google.maps),
        breakerOpenUntil: breakerOpenUntil,
        now: Date.now(),
      };
    }
  };
})();
