/**
 * Velvet Autocomplete
 * Custom Google Places dropdown that matches the landing page dark luxury aesthetic.
 * Uses AutocompleteService + PlacesService instead of the default Autocomplete widget.
 */

export interface AutocompleteOptions {
  input: HTMLInputElement;
  onSelect: (place: google.maps.places.PlaceResult) => void;
  onClear?: () => void;
  /** When false, dropdown does not fetch (e.g. field is repurposed as a readonly picker target). */
  allowed?: () => boolean;
  country?: string;
  types?: string[];
  placeholderQuery?: string;
}

interface PredictionItem {
  prediction: google.maps.places.AutocompletePrediction;
  element: HTMLElement;
}

let globalService: google.maps.places.AutocompleteService | null = null;
let globalDetailsService: google.maps.places.PlacesService | null = null;

function getServices(): {
  autocomplete: google.maps.places.AutocompleteService;
  details: google.maps.places.PlacesService;
} | null {
  const g = (window as any).google;
  if (!g?.maps?.places) return null;
  if (!globalService) {
    globalService = new g.maps.places.AutocompleteService();
  }
  if (!globalDetailsService) {
    // Dummy map element for PlacesService constructor
    const dummy = document.createElement("div");
    globalDetailsService = new g.maps.places.PlacesService(dummy);
  }
  return { autocomplete: globalService!, details: globalDetailsService! };
}

export function initVelvetAutocomplete(opts: AutocompleteOptions) {
  const { input, onSelect, onClear, allowed, country = "in", types } = opts;
  const canUse = () => allowed?.() !== false;
  const services = getServices();
  if (!services) return { destroy: () => {} };

  let predictions: PredictionItem[] = [];
  let activeIndex = -1;
  let debounceTimer: ReturnType<typeof setTimeout> | null = null;
  let sessionToken: google.maps.places.AutocompleteSessionToken | null = null;

  // Container sits right after the input's label/parent
  const container = document.createElement("div");
  container.className = "velvet-autocomplete";
  container.setAttribute("role", "listbox");
  container.setAttribute("aria-label", "Location suggestions");
  container.style.display = "none";

  const isMobile = () => window.matchMedia("(max-width: 899px)").matches;

  function mount() {
    if (isMobile()) {
      document.body.appendChild(container);
      return;
    }
    input.parentElement?.appendChild(container);
  }
  mount();

  function position() {
    if (!isMobile()) {
      container.style.position = "absolute";
      container.style.left = "0";
      container.style.top = "calc(100% + 10px)";
      container.style.bottom = "auto";
      container.style.width = "min(30rem, calc(100vw - 3rem))";
      container.style.zIndex = "30";

      const panelHeight = container.offsetHeight;
      const inputRect = input.getBoundingClientRect();
      const viewportPad = 10;
      const spaceBelow = window.innerHeight - inputRect.bottom - viewportPad;
      const spaceAbove = inputRect.top - viewportPad;
      if (spaceBelow < panelHeight && spaceAbove > panelHeight) {
        container.style.top = "auto";
        container.style.bottom = "calc(100% + 10px)";
      }
      return;
    }

    const rect = input.getBoundingClientRect();
    const panelHeight = container.offsetHeight;
    const viewportPad = 8;
    let top = rect.bottom + 8;
    if (top + panelHeight > window.innerHeight - viewportPad) {
      top = Math.max(viewportPad, rect.top - panelHeight - 8);
    }
    container.style.position = "fixed";
    container.style.left = `${rect.left}px`;
    container.style.top = `${top}px`;
    container.style.width = `${rect.width}px`;
    container.style.zIndex = "900";
  }

  function ensureSessionToken() {
    const g = (window as any).google;
    if (!sessionToken && g?.maps?.places?.AutocompleteSessionToken) {
      sessionToken = new g.maps.places.AutocompleteSessionToken();
    }
    return sessionToken;
  }

  function fetchPredictions(query: string) {
    if (!canUse() || !services || !query.trim()) {
      close();
      return;
    }
    services.autocomplete.getPlacePredictions(
      {
        input: query,
        componentRestrictions: { country },
        types: types as any,
        sessionToken: ensureSessionToken() as any,
      },
      (results, status) => {
        if (
          status !== (window as any).google.maps.places.PlacesServiceStatus.OK ||
          !results ||
          results.length === 0
        ) {
          close();
          return;
        }
        render(results);
      }
    );
  }

  function render(results: google.maps.places.AutocompletePrediction[]) {
    predictions = [];
    activeIndex = -1;
    container.innerHTML = "";

    const list = document.createElement("ul");
    list.className = "velvet-autocomplete__list";

    results.forEach((prediction, index) => {
      const li = document.createElement("li");
      li.className = "velvet-autocomplete__item";
      li.setAttribute("role", "option");
      li.setAttribute("data-index", String(index));

      const copy = document.createElement("span");
      copy.className = "velvet-autocomplete__copy";

      const mainText = document.createElement("span");
      mainText.className = "velvet-autocomplete__main";
      appendMatchedText(
        mainText,
        prediction.structured_formatting.main_text,
        prediction.structured_formatting.main_text_matched_substrings
      );

      const secondaryText = document.createElement("span");
      secondaryText.className = "velvet-autocomplete__secondary";
      secondaryText.textContent = prediction.structured_formatting.secondary_text || "";

      copy.appendChild(mainText);
      if (secondaryText.textContent) {
        copy.appendChild(secondaryText);
      }
      li.appendChild(copy);

      li.addEventListener("mousedown", (e) => {
        e.preventDefault(); // prevent input blur
        selectPrediction(prediction);
      });

      list.appendChild(li);
      predictions.push({ prediction, element: li });
    });

    // Powered by Google attribution
    const attribution = document.createElement("div");
    attribution.className = "velvet-autocomplete__attribution";
    const googleLogo = document.createElement("img");
    googleLogo.src = "https://maps.gstatic.com/mapfiles/api-3/images/powered-by-google-on-non-white3_hdpi.png";
    googleLogo.alt = "Powered by Google";
    googleLogo.height = 12;
    attribution.appendChild(googleLogo);
    list.appendChild(attribution);

    container.appendChild(list);
    container.style.display = "block";
    position();
    input.setAttribute("aria-expanded", "true");
  }

  function appendMatchedText(
    target: HTMLElement,
    text: string,
    matches?: google.maps.places.PredictionSubstring[]
  ) {
    if (!matches?.length) {
      target.textContent = text;
      return;
    }

    let cursor = 0;
    matches.forEach((match) => {
      const offset = match.offset;
      const end = offset + match.length;
      if (offset > cursor) target.append(document.createTextNode(text.slice(cursor, offset)));
      const mark = document.createElement("mark");
      mark.textContent = text.slice(offset, end);
      target.append(mark);
      cursor = end;
    });
    if (cursor < text.length) target.append(document.createTextNode(text.slice(cursor)));
  }

  function selectPrediction(prediction: google.maps.places.AutocompletePrediction) {
    if (!services) return;
    services.details.getDetails(
      {
        placeId: prediction.place_id,
        fields: ["formatted_address", "name", "place_id", "geometry"],
        sessionToken: sessionToken as any,
      },
      (place, status) => {
        if (
          status === (window as any).google.maps.places.PlacesServiceStatus.OK &&
          place
        ) {
          input.value = place.formatted_address || place.name || prediction.description;
          onSelect(place);
          // Refresh session token after a place is selected
          const g = (window as any).google;
          if (g?.maps?.places?.AutocompleteSessionToken) {
            sessionToken = new g.maps.places.AutocompleteSessionToken();
          }
        }
        close();
      }
    );
  }

  function highlight(index: number) {
    predictions.forEach((p, i) => {
      p.element.classList.toggle("is-active", i === index);
      p.element.setAttribute("aria-selected", String(i === index));
    });
    activeIndex = index;
    if (index >= 0) {
      predictions[index].element.scrollIntoView({ block: "nearest" });
    }
  }

  function close() {
    container.style.display = "none";
    input.setAttribute("aria-expanded", "false");
    activeIndex = -1;
    predictions = [];
  }

  function openIfQuery() {
    const query = input.value.trim();
    if (query.length >= 2) {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => fetchPredictions(query), 200);
    }
  }

  // --- Event listeners ---

  input.addEventListener("input", () => {
    if (!canUse()) {
      close();
      return;
    }
    if (debounceTimer) clearTimeout(debounceTimer);
    const query = input.value.trim();
    if (query.length < 2) {
      close();
      onClear?.();
      return;
    }
    debounceTimer = setTimeout(() => fetchPredictions(query), 200);
  });

  input.addEventListener("focus", () => {
    if (!canUse()) return;
    openIfQuery();
  });

  input.addEventListener("keydown", (e) => {
    if (container.style.display === "none") return;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        highlight(Math.min(activeIndex + 1, predictions.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        highlight(Math.max(activeIndex - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && predictions[activeIndex]) {
          selectPrediction(predictions[activeIndex].prediction);
        }
        break;
      case "Escape":
        e.preventDefault();
        close();
        break;
      case "Tab":
        close();
        break;
    }
  });

  // Close on outside click
  document.addEventListener("click", (e) => {
    if (!input.contains(e.target as Node) && !container.contains(e.target as Node)) {
      close();
    }
  });

  // Reposition on resize/scroll
  window.addEventListener("resize", () => {
    if (container.style.display !== "none") position();
  });
  window.addEventListener("scroll", () => {
    if (container.style.display !== "none") position();
  }, { passive: true });

  function destroy() {
    if (debounceTimer) clearTimeout(debounceTimer);
    close();
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }

  return { destroy };
}
