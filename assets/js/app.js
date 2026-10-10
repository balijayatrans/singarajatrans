    const menuButton = document.getElementById('menuButton');
    const mobileMenu = document.getElementById('mobileMenu');
    const mobileLanguageSelector = document.getElementById('mobileLanguageSelector');
    const mobileLanguageButton = document.getElementById('mobileLanguageButton');
    const mobileLanguageMenu = document.getElementById('mobileLanguageMenu');

    function closeMobileMenu() {
      if (!mobileMenu || !menuButton) return;
      mobileMenu.classList.add('hidden');
      menuButton.setAttribute('aria-expanded', 'false');
      const icon = menuButton.querySelector('i');
      if (icon) icon.className = 'fas fa-bars';
    }

    function closeMobileLanguageMenu() {
      if (!mobileLanguageMenu || !mobileLanguageButton) return;
      mobileLanguageMenu.classList.add('hidden');
      mobileLanguageButton.setAttribute('aria-expanded', 'false');
    }

    menuButton?.addEventListener('click', () => {
      closeMobileLanguageMenu();
      if (!mobileMenu) return;
      const willOpen = mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden', !willOpen);
      menuButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      const icon = menuButton.querySelector('i');
      if (icon) icon.className = willOpen ? 'fas fa-xmark' : 'fas fa-bars';
    });

    mobileLanguageButton?.addEventListener('click', (event) => {
      event.stopPropagation();
      closeMobileMenu();
      if (!mobileLanguageMenu) return;
      const willOpen = mobileLanguageMenu.classList.contains('hidden');
      mobileLanguageMenu.classList.toggle('hidden', !willOpen);
      mobileLanguageButton.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
    });

    mobileMenu?.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      closeMobileLanguageMenu();
      closeMobileMenu();
    });


    const routeTicketTrack = document.getElementById('routeTicketTrack');
    const routePrev = document.getElementById('routePrev');
    const routeNext = document.getElementById('routeNext');

    function scrollRouteTickets(direction) {
      if (!routeTicketTrack) return;
      const firstCard = routeTicketTrack.querySelector('.st-route-ticket');
      const gap = 20;
      const distance = (firstCard?.getBoundingClientRect().width || 340) + gap;
      routeTicketTrack.scrollBy({ left: direction * distance, behavior: 'smooth' });
    }

    routePrev?.addEventListener('click', () => scrollRouteTickets(-1));
    routeNext?.addEventListener('click', () => scrollRouteTickets(1));

    const utilityTopBar = document.getElementById('utilityTopBar');
    const mainNav = document.getElementById('mainNav');
    const mainNavSpacer = document.getElementById('mainNavSpacer');
    const heroSection = document.getElementById('hero');

    let headerScrollTicking = false;
    let lastHeaderScrollY = Math.max(0, window.scrollY);
    let upwardTravel = 0;
    let downwardTravel = 0;

    const desktopHeaderQuery = window.matchMedia('(min-width: 768px)');
    const NAV_SHOW_AFTER_UP_PX = 6;
    const NAV_HIDE_AFTER_DOWN_PX = 12;
    const NAV_ALWAYS_VISIBLE_TOP_PX = 22;

    function utilityBarHeight() {
      if (!utilityTopBar || !desktopHeaderQuery.matches) return 0;
      return utilityTopBar.getBoundingClientRect().height || utilityTopBar.scrollHeight || 0;
    }

    function heroTopBarThreshold() {
      if (!heroSection || !desktopHeaderQuery.matches) return 0;

      const heroTop = heroSection.offsetTop;
      const heroHeight = heroSection.offsetHeight;

      /* Reveal the utility bar when the viewport is back in the upper
         portion of the hero, instead of showing it across the whole page. */
      return heroTop + Math.min(heroHeight * 0.62, 260);
    }

    function shouldShowUtilityBar(scrollY) {
      return desktopHeaderQuery.matches
        && scrollY <= heroTopBarThreshold();
    }

    function syncHeaderStack() {
      if (!mainNav) return;

      const baseUtilityHeight = utilityBarHeight();
      const utilityIsVisible = Boolean(
        utilityTopBar
        && desktopHeaderQuery.matches
        && !utilityTopBar.classList.contains('is-hidden')
      );

      const visibleUtilityHeight = utilityIsVisible ? baseUtilityHeight : 0;
      const navHeight = mainNav.getBoundingClientRect().height;

      document.documentElement.style.setProperty(
        '--utility-visible-height',
        `${visibleUtilityHeight}px`
      );

      document.documentElement.style.setProperty(
        '--header-stack-height',
        `${baseUtilityHeight + navHeight}px`
      );

      if (mainNavSpacer) {
        mainNavSpacer.style.height = `${baseUtilityHeight + navHeight}px`;
      }

      document.body.classList.toggle('header-has-scrolled', window.scrollY > 4);
    }

    function setUtilityBarVisibility(scrollY) {
      if (!utilityTopBar) return;

      if (!desktopHeaderQuery.matches) {
        utilityTopBar.classList.add('is-hidden');
        return;
      }

      utilityTopBar.classList.toggle(
        'is-hidden',
        !shouldShowUtilityBar(scrollY)
      );
    }

    function showMainNav() {
      mainNav?.classList.remove('nav-hidden');
    }

    function hideMainNav() {
      mainNav?.classList.add('nav-hidden');
    }

    function updateHeaderBehavior() {
      const currentY = Math.max(0, window.scrollY);
      const delta = currentY - lastHeaderScrollY;

      /* Top bar is location-aware: it only returns near the hero. */
      setUtilityBarVisibility(currentY);

      /* Main nav is direction-aware everywhere. */
      if (currentY <= NAV_ALWAYS_VISIBLE_TOP_PX) {
        upwardTravel = 0;
        downwardTravel = 0;
        showMainNav();
      } else if (delta < -1) {
        upwardTravel += Math.abs(delta);
        downwardTravel = 0;

        if (upwardTravel >= NAV_SHOW_AFTER_UP_PX) {
          showMainNav();
          upwardTravel = 0;
        }
      } else if (delta > 1) {
        downwardTravel += delta;
        upwardTravel = 0;

        if (downwardTravel >= NAV_HIDE_AFTER_DOWN_PX) {
          hideMainNav();
          downwardTravel = 0;
        }
      }

      lastHeaderScrollY = currentY;
      syncHeaderStack();
    }

    window.addEventListener('scroll', () => {
      if (headerScrollTicking) return;

      headerScrollTicking = true;
      window.requestAnimationFrame(() => {
        updateHeaderBehavior();
        headerScrollTicking = false;
      });
    }, { passive: true });

    window.addEventListener('resize', () => {
      window.requestAnimationFrame(() => {
        lastHeaderScrollY = Math.max(0, window.scrollY);
        setUtilityBarVisibility(lastHeaderScrollY);
        showMainNav();
        syncHeaderStack();
        if (window.innerWidth >= 1024) {
          closeMobileMenu();
          closeMobileLanguageMenu();
        }
      });
    }, { passive: true });

    desktopHeaderQuery.addEventListener?.('change', () => {
      lastHeaderScrollY = Math.max(0, window.scrollY);
      upwardTravel = 0;
      downwardTravel = 0;
      setUtilityBarVisibility(lastHeaderScrollY);
      showMainNav();
      syncHeaderStack();
    });

    window.addEventListener('load', () => {
      lastHeaderScrollY = Math.max(0, window.scrollY);
      setUtilityBarVisibility(lastHeaderScrollY);
      showMainNav();
      syncHeaderStack();
    });

    updateHeaderBehavior();
    syncHeaderStack();

    const bookingWidget = document.getElementById('bookingExperience');

    /* Smart Booking Widget focus
       First interaction deliberately brings the whole widget beneath the fixed
       header. Subsequent field interactions do not repeatedly move the page. */
    let bookingFocusScrollInFlight = false;
    let bookingWidgetFocusSession = false;
    let bookingFocusReleaseTimer = null;

    function getBookingWidgetFocusOffset() {
      const nav = document.getElementById('mainNav');
      const utility = document.getElementById('utilityTopBar');
      const navHeight = nav?.getBoundingClientRect().height || 0;
      const utilityVisible = utility
        && window.innerWidth >= 768
        && !utility.classList.contains('is-hidden');
      const utilityHeight = utilityVisible ? (utility.getBoundingClientRect().height || 0) : 0;
      return navHeight + utilityHeight + 16;
    }

    function focusBookingWidgetViewport({ force = false } = {}) {
      if (!bookingWidget || bookingFocusScrollInFlight) return;

      const rect = bookingWidget.getBoundingClientRect();
      const desiredTop = getBookingWidgetFocusOffset();
      const delta = rect.top - desiredTop;
      const alreadyComfortable = Math.abs(delta) <= 20;

      bookingWidget.classList.add('is-widget-focused');

      if (!force && bookingWidgetFocusSession && alreadyComfortable) return;
      if (!force && bookingWidgetFocusSession && Math.abs(delta) <= 96) return;

      bookingWidgetFocusSession = true;
      if (Math.abs(delta) <= 4) return;

      bookingFocusScrollInFlight = true;
      const targetTop = Math.max(0, window.scrollY + delta);

      requestAnimationFrame(() => {
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      });

      window.clearTimeout(bookingFocusReleaseTimer);
      bookingFocusReleaseTimer = window.setTimeout(() => {
        bookingFocusScrollInFlight = false;
      }, 650);
    }

    function isBookingInteractionTarget(target) {
      return Boolean(target?.closest?.(
        '.booking-field, .combo-trigger, .combo-inline-search, .trip-mode-label, .airport-direction-label, .st-service-tab, .travel-search-button, .airport-search-button, .charter-search-button'
      ));
    }

    bookingWidget?.addEventListener('pointerdown', (event) => {
      if (!isBookingInteractionTarget(event.target)) return;
      const firstInteraction = !bookingWidgetFocusSession;
      requestAnimationFrame(() => {
        focusBookingWidgetViewport({ force: firstInteraction });
      });
    }, { passive: true });

    bookingWidget?.addEventListener('focusin', (event) => {
      if (!isBookingInteractionTarget(event.target)) return;
      if (bookingWidgetFocusSession) return;
      requestAnimationFrame(() => focusBookingWidgetViewport({ force: true }));
    });

    document.addEventListener('pointerdown', (event) => {
      if (!bookingWidget?.contains(event.target)) {
        bookingWidgetFocusSession = false;
        bookingWidget?.classList.remove('is-widget-focused');
      }
    }, { passive: true });

    function updateTabIcons() {
      document.querySelectorAll('.st-service-tab').forEach(btn => {
        const icon = btn.querySelector('.tab-icon');
        if (!icon || !icon.dataset.iconActive || !icon.dataset.iconInactive) return;
        icon.src = btn.classList.contains('active') ? icon.dataset.iconActive : icon.dataset.iconInactive;
      });
    }
    updateTabIcons();

    if (bookingWidget) bookingWidget.classList.add('travel-active');

    const serviceTabs = Array.from(document.querySelectorAll('.st-service-tab'));

    function syncServiceTabFocusState(activeButton) {
      serviceTabs.forEach(btn => {
        const isActive = btn === activeButton;
        btn.setAttribute('aria-selected', isActive ? 'true' : 'false');
        btn.tabIndex = isActive ? 0 : -1;
      });
    }

    serviceTabs.forEach(button => {
      const initiallyActive = button.classList.contains('active');
      button.setAttribute('aria-selected', initiallyActive ? 'true' : 'false');
      button.tabIndex = initiallyActive ? 0 : -1;

      button.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();

        const currentIndex = serviceTabs.indexOf(button);
        let nextIndex = currentIndex;

        if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % serviceTabs.length;
        if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + serviceTabs.length) % serviceTabs.length;
        if (event.key === 'Home') nextIndex = 0;
        if (event.key === 'End') nextIndex = serviceTabs.length - 1;

        serviceTabs[nextIndex]?.focus();
        serviceTabs[nextIndex]?.click();
      });

      button.addEventListener('click', () => {
        closeAllComboboxes();
        hideDatePicker();
        hideTimePicker();

        document.querySelectorAll('.st-service-tab').forEach(btn => {
          btn.classList.remove('active');
          btn.classList.add('inactive');
          btn.setAttribute('aria-selected', 'false');
        });
        document.querySelectorAll('.st-service-panel').forEach(panel => panel.classList.remove('active'));

        button.classList.remove('inactive');
        button.classList.add('active');
        syncServiceTabFocusState(button);
        document.getElementById('tab-' + button.dataset.tab)?.classList.add('active');

        const activeTab = button.dataset.tab;
        bookingWidget?.classList.toggle('travel-active', activeTab === 'travel');
        bookingWidget?.classList.toggle('airport-active', activeTab === 'airport');
        bookingWidget?.classList.toggle('charter-active', activeTab === 'charter');
        updateTabIcons();
      });
    });

    function setupInlineCitySearchFields() {
      document.querySelectorAll('[data-combobox]:not(.passenger-combobox)').forEach(box => {
        const trigger = box.querySelector('.combo-trigger');
        const legacySearch = box.querySelector('.combo-search');
        const dropdown = box.querySelector('.combo-dropdown');
        if (!trigger || !legacySearch || !dropdown) return;

        box.classList.add('has-inline-city-search');

        const searchShell = document.createElement('div');
        searchShell.className = 'combo-inline-search-shell hidden';

        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search combo-inline-search-icon';
        searchShell.appendChild(searchIcon);

        const inlineSearch = document.createElement('input');
        inlineSearch.type = 'text';
        inlineSearch.className = 'combo-inline-search';
        inlineSearch.placeholder = legacySearch.placeholder || 'Cari kota...';
        inlineSearch.autocomplete = 'off';
        inlineSearch.spellcheck = false;
        inlineSearch.setAttribute('aria-label', inlineSearch.placeholder);
        searchShell.appendChild(inlineSearch);

        const chevron = document.createElement('i');
        chevron.className = 'fas fa-chevron-down combo-inline-search-chevron';
        searchShell.appendChild(chevron);

        trigger.insertAdjacentElement('afterend', searchShell);

        const legacyWrap = legacySearch.parentElement;
        legacyWrap?.classList.add('combo-legacy-search-wrap');

        const header = legacyWrap?.parentElement;
        if (header) {
          const hasLocation = Boolean(header.querySelector('.combo-location'));
          const hasMap = Boolean(header.querySelector('.combo-map-preview'));
          if (!hasLocation && !hasMap) {
            header.classList.add('combo-search-only-header');
          }
        }
      });
    }

    setupInlineCitySearchFields();

    const comboboxes = document.querySelectorAll('[data-combobox]');
    const travelOriginBox = document.getElementById('travelOriginBox')
      || document.querySelector('.travel-origin-field [data-combobox]');
    const travelDestinationBox = document.getElementById('travelDestinationBox')
      || document.querySelector('.travel-destination-field [data-combobox]');
    const travelPassengerBox = document.getElementById('travelPassengerBox');
    const mobilePassengerMinus = document.getElementById('mobilePassengerMinus');
    const mobilePassengerPlus = document.getElementById('mobilePassengerPlus');
    const mobilePassengerValue = document.getElementById('mobilePassengerValue');
    let mobilePassengerCount = 1;

    function syncMobilePassengerCount(nextCount) {
      mobilePassengerCount = Math.min(5, Math.max(1, Number(nextCount) || 1));
      const label = `${mobilePassengerCount} Orang`;
      if (mobilePassengerValue) mobilePassengerValue.textContent = label;
      if (travelPassengerBox) {
        setComboboxValue(travelPassengerBox, label);
      }
      if (mobilePassengerMinus) {
        mobilePassengerMinus.disabled = mobilePassengerCount <= 1;
        mobilePassengerMinus.setAttribute('aria-disabled', String(mobilePassengerCount <= 1));
      }
      if (mobilePassengerPlus) {
        mobilePassengerPlus.disabled = mobilePassengerCount >= 5;
        mobilePassengerPlus.setAttribute('aria-disabled', String(mobilePassengerCount >= 5));
      }
    }

    mobilePassengerMinus?.addEventListener('click', () => {
      syncMobilePassengerCount(mobilePassengerCount - 1);
    });

    mobilePassengerPlus?.addEventListener('click', () => {
      syncMobilePassengerCount(mobilePassengerCount + 1);
    });

    syncMobilePassengerCount(1);
    const travelOriginOptions = travelOriginBox
      ? Array.from(travelOriginBox.querySelectorAll('.combo-item')).map(item => item.dataset.value).filter(Boolean)
      : [];
    const travelDestinationOptions = travelDestinationBox
      ? Array.from(travelDestinationBox.querySelectorAll('.combo-item')).map(item => item.dataset.value).filter(Boolean)
      : [];

    function openCombobox(box) {
      if (!box) return;
      const trigger = box.querySelector('.combo-trigger');
      const dropdown = box.querySelector('.combo-dropdown');
      const inlineShell = box.querySelector('.combo-inline-search-shell');
      const inlineSearch = box.querySelector('.combo-inline-search');
      const legacySearch = box.querySelector('.combo-search');
      if (!trigger || trigger.disabled || !dropdown) return;

      closeAllComboboxes(box);
      resetComboboxSearch(box);

      if (inlineShell && inlineSearch) {
        trigger.classList.add('hidden');
        inlineShell.classList.remove('hidden');
        inlineSearch.value = '';
      }

      dropdown.classList.remove('hidden');
      box.classList.add('is-open');
      trigger.setAttribute?.('aria-expanded', 'true');

      requestAnimationFrame(() => {
        if (inlineSearch) {
          inlineSearch.focus({ preventScroll: true });
        } else {
          trigger.focus({ preventScroll: true });
          legacySearch?.focus({ preventScroll: true });
        }
      });
    }

    function focusActionButton(button) {
      if (!button) return;
      closeAllComboboxes();
      button.focus({ preventScroll: true });
    }

    function isComboboxComplete(box) {
      if (!box) return true;
      const trigger = box.querySelector('.combo-trigger');
      if (trigger?.disabled) return true;

      const value = box.querySelector('.combo-value')?.textContent?.trim() || '';
      if (!value) return false;

      return !/^Pilih\b/i.test(value)
        && !/^Choose\b/i.test(value)
        && !/^Select\b/i.test(value);
    }

    function isFlowFieldRelevant(field) {
      if (!field) return false;
      if (field === travelReturnDate) {
        return Boolean(travelForm?.classList.contains('round-trip'))
          && !travelReturnWrap?.classList.contains('hidden');
      }
      if (field.matches?.('[data-combobox]')) {
        const trigger = field.querySelector('.combo-trigger');
        return !trigger?.disabled;
      }
      return !field.disabled;
    }

    function isFlowFieldComplete(field) {
      if (!field) return true;

      if (field.matches?.('[data-combobox]')) {
        return isComboboxComplete(field);
      }

      if (field === dateInput || field === travelReturnDate || field === airportPickupDate || field === charterPickupDate) {
        return Boolean(field.dataset.value);
      }

      if (field === airportPickupTime || field === charterPickupTime) {
        return /^\d{2}:\d{2}$/.test(field.value || '');
      }

      if (field.tagName === 'INPUT' || field.tagName === 'SELECT' || field.tagName === 'TEXTAREA') {
        return Boolean(String(field.value || '').trim());
      }

      return true;
    }

    function activateFlowField(field) {
      if (!field) return;

      closeAllComboboxes();

      if (field.matches?.('[data-combobox]')) {
        openCombobox(field);
        return;
      }

      if (field === dateInput || field === travelReturnDate || field === airportPickupDate || field === charterPickupDate) {
        showDatePicker(field);
        return;
      }

      if (field === airportPickupTime || field === charterPickupTime) {
        showTimePicker(field);
        return;
      }

      field.focus?.({ preventScroll: true });
    }

    function getFormFlow(currentField) {
      const travelFields = [
        travelOriginBox,
        travelDestinationBox,
        dateInput,
        travelReturnDate,
        travelPassengerBox
      ].filter(Boolean);

      if (
        currentField === travelOriginBox
        || currentField === travelDestinationBox
        || currentField === dateInput
        || currentField === travelReturnDate
        || currentField === travelPassengerBox
        || travelForm?.contains(currentField)
      ) {
        return {
          fields: travelFields,
          action: document.getElementById('travelSearchButton')
        };
      }

      const airportFields = [
        airportPickupBox,
        airportDestinationBox,
        airportPickupDate,
        airportPickupTime
      ].filter(Boolean);

      if (
        currentField === airportPickupBox
        || currentField === airportDestinationBox
        || currentField === airportPickupDate
        || currentField === airportPickupTime
        || airportForm?.contains(currentField)
      ) {
        return {
          fields: airportFields,
          action: document.getElementById('airportSearchButton')
        };
      }

      const charterFields = [
        document.getElementById('charterOriginBox'),
        document.getElementById('charterDestinationBox'),
        charterPickupDate,
        charterPickupTime,
        document.getElementById('charterPassenger')
      ].filter(Boolean);

      if (charterForm?.contains(currentField)) {
        return {
          fields: charterFields,
          action: document.getElementById('charterSearchButton')
        };
      }

      return null;
    }

    function advanceToNextIncomplete(currentField) {
      window.setTimeout(() => {
        const flow = getFormFlow(currentField);
        if (!flow) return;

        const fields = flow.fields.filter(isFlowFieldRelevant);
        const currentIndex = fields.indexOf(currentField);

        const afterCurrent = currentIndex >= 0
          ? fields.slice(currentIndex + 1)
          : fields.slice();

        const beforeCurrent = currentIndex > 0
          ? fields.slice(0, currentIndex)
          : [];

        const nextIncomplete = [...afterCurrent, ...beforeCurrent]
          .find(field => !isFlowFieldComplete(field));

        if (nextIncomplete) {
          activateFlowField(nextIncomplete);
          return;
        }

        focusActionButton(flow.action);
      }, 0);
    }

    function advanceAfterComboboxSelection(box) {
      advanceToNextIncomplete(box);
    }

    function restoreComboboxDisplay(box) {
      const trigger = box.querySelector('.combo-trigger');
      const inlineShell = box.querySelector('.combo-inline-search-shell');
      const inlineSearch = box.querySelector('.combo-inline-search');

      inlineShell?.classList.add('hidden');
      trigger?.classList.remove('hidden');
      if (inlineSearch) inlineSearch.value = '';
      trigger?.setAttribute?.('aria-expanded', 'false');
    }

    const SINGARAJA_AIRPORT_MARKERS = Array.isArray(window.SINGARAJA_AIRPORT_MARKERS)
      ? window.SINGARAJA_AIRPORT_MARKERS
      : [
          {
            id: 'ngurah-rai',
            label: 'Bandara Ngurah Rai',
            lat: -8.748169,
            lng: 115.167172,
            radiusMeters: 1800,
            required: true
          }
        ];

    const SINGARAJA_LOCATION_BREAKPOINTS = Array.isArray(window.SINGARAJA_LOCATION_BREAKPOINTS)
      ? window.SINGARAJA_LOCATION_BREAKPOINTS
      : [];

    function geoToRad(value) {
      return (Number(value) * Math.PI) / 180;
    }

    function geoDistanceMeters(a, b) {
      const lat1 = Number(a?.lat);
      const lng1 = Number(a?.lng);
      const lat2 = Number(b?.lat ?? b?.latitude);
      const lng2 = Number(b?.lng ?? b?.lon ?? b?.longitude);
      if (![lat1, lng1, lat2, lng2].every(Number.isFinite)) return Infinity;

      const radius = 6371000;
      const dLat = geoToRad(lat2 - lat1);
      const dLng = geoToRad(lng2 - lng1);
      const rLat1 = geoToRad(lat1);
      const rLat2 = geoToRad(lat2);
      const sinLat = Math.sin(dLat / 2);
      const sinLng = Math.sin(dLng / 2);
      const h = (sinLat * sinLat) + (Math.cos(rLat1) * Math.cos(rLat2) * sinLng * sinLng);
      return 2 * radius * Math.asin(Math.min(1, Math.sqrt(h)));
    }

    function findNearestGeoMatch(coords, items, fallbackRadiusMeters) {
      let winner = null;
      (Array.isArray(items) ? items : []).forEach(item => {
        if (!item) return;
        const radius = Number(item.radiusMeters ?? item.radius ?? fallbackRadiusMeters);
        const maxDistance = Number.isFinite(radius) && radius >= 0 ? radius : fallbackRadiusMeters;
        const distanceMeters = geoDistanceMeters(coords, item);
        if (distanceMeters <= maxDistance && (!winner || distanceMeters < winner.distanceMeters)) {
          winner = { item, distanceMeters };
        }
      });
      return winner;
    }

    function getGeoItemLabel(item) {
      return item?.label || item?.name || item?.title || item?.displayName || '';
    }

    function getNominatimPoiLabel(result) {
      if (!result?.name) return '';
      const category = String(result.category || result.class || '').toLowerCase();
      if (['boundary', 'place', 'highway'].includes(category)) return '';
      return result.name;
    }

    function getNominatimAddressLabel(result) {
      const address = result?.address || {};
      return (
        address.neighbourhood ||
        address.suburb ||
        address.village ||
        address.town ||
        address.city ||
        address.municipality ||
        address.county ||
        result?.name ||
        ''
      );
    }

    async function reverseLookupDeviceLocation(coords) {
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 2500);

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&namedetails=1&zoom=18&lat=${encodeURIComponent(coords.lat)}&lon=${encodeURIComponent(coords.lng)}`,
          {
            headers: {
              'Accept-Language': currentLang === 'id' ? 'id,en;q=0.8' : 'en,id;q=0.8'
            },
            signal: controller.signal
          }
        );
        if (!response.ok) throw new Error(`Reverse geocoding failed (${response.status})`);
        return response.json();
      } finally {
        window.clearTimeout(timeoutId);
      }
    }

    async function resolveDeviceLocation(position, box) {
      const coords = {
        lat: Number(position.coords.latitude),
        lng: Number(position.coords.longitude),
        accuracy: Number.isFinite(position.coords.accuracy) ? Number(position.coords.accuracy) : null
      };

      // Priority 1: required airport marker/geofence.
      const airportMatch = findNearestGeoMatch(coords, SINGARAJA_AIRPORT_MARKERS, 1800);
      if (airportMatch) {
        return {
          hasLocation: true,
          source: 'airport',
          label: `${getGeoItemLabel(airportMatch.item) || 'Bandara Ngurah Rai'} · lokasi saya`,
          lat: coords.lat,
          lng: coords.lng,
          accuracy: coords.accuracy,
          breakpoint: null,
          airportMarker: airportMatch.item
        };
      }

      // Priority 2: configured operational breakpoint.
      const breakpointMatch = findNearestGeoMatch(coords, SINGARAJA_LOCATION_BREAKPOINTS, 500);
      if (breakpointMatch) {
        return {
          hasLocation: true,
          source: 'breakpoint',
          label: `${getGeoItemLabel(breakpointMatch.item) || 'Titik layanan'} · lokasi saya`,
          lat: coords.lat,
          lng: coords.lng,
          accuracy: coords.accuracy,
          breakpoint: breakpointMatch.item,
          airportMarker: null
        };
      }

      // GPS success is authoritative. Return immediately so the UI does not wait
      // for reverse geocoding. A human-readable place label is enriched afterward.
      return {
        hasLocation: true,
        source: 'coordinates',
        label: `Lokasi saya · ${coords.lat.toFixed(5)}, ${coords.lng.toFixed(5)}`,
        lat: coords.lat,
        lng: coords.lng,
        accuracy: coords.accuracy,
        breakpoint: null,
        airportMarker: null
      };
    }

    async function enrichResolvedLocationLabel(box, resolved) {
      if (!box || resolved?.source !== 'coordinates') return;

      try {
        const place = await reverseLookupDeviceLocation(resolved);
        const label = getNominatimPoiLabel(place) || getNominatimAddressLabel(place);
        if (!label) return;

        const sameLocation =
          box.dataset.locationResolved === 'true' &&
          Number(box.dataset.locationLatitude) === Number(resolved.lat) &&
          Number(box.dataset.locationLongitude) === Number(resolved.lng);

        if (!sameLocation) return;

        const enriched = {
          ...resolved,
          source: getNominatimPoiLabel(place) ? 'poi' : 'address',
          label: `${label} · lokasi saya`,
          place
        };

        applyResolvedLocationToBox(box, enriched);
        updateLocationMapPreview(box, enriched);
      } catch (_) {
        // Keep the already-resolved GPS coordinates when reverse lookup is slow/unavailable.
      }
    }

    function applyResolvedLocationToBox(box, resolved) {
      if (!box || !resolved?.hasLocation) return;

      setComboboxValue(box, resolved.label);
      box.dataset.locationResolved = 'true';
      box.dataset.locationSource = resolved.source || 'coordinates';
      box.dataset.locationLabel = resolved.label || '';
      box.dataset.locationLatitude = String(resolved.lat);
      box.dataset.locationLongitude = String(resolved.lng);
      box.dataset.locationAccuracy = resolved.accuracy == null ? '' : String(Math.round(resolved.accuracy));
      box.dataset.locationBreakpoint = resolved.breakpoint?.id || resolved.breakpoint?.label || '';
      box.dataset.airportMarker = resolved.airportMarker?.id || resolved.airportMarker?.label || '';

      const trigger = box.querySelector('.combo-trigger');
      clearFieldError(trigger);

      window.dispatchEvent(new CustomEvent('singaraja:location-resolved', {
        detail: {
          boxId: box.id || null,
          hasLocation: true,
          source: resolved.source,
          label: resolved.label,
          lat: resolved.lat,
          lng: resolved.lng,
          accuracy: resolved.accuracy,
          breakpoint: resolved.breakpoint || null,
          airportMarker: resolved.airportMarker || null
        }
      }));
    }

    function updateLocationMapPreview() {
      // Map preview intentionally removed from booking dropdowns for a lighter mobile flow.
    }

    function closeAllComboboxes(except) {
      comboboxes.forEach(box => {
        if (box !== except) {
          box.querySelector('.combo-dropdown')?.classList.add('hidden');
          box.classList.remove('is-open');
          restoreComboboxDisplay(box);
          resetComboboxSearch(box);
        }
      });
    }

    function getComboboxItems(box) {
      return Array.from(box.querySelectorAll('.combo-item'));
    }

    function resetComboboxSearch(box) {
      const search = box.querySelector('.combo-search');
      if (search) search.value = '';
      const emptyEl = box.querySelector('.combo-empty');
      const items = getComboboxItems(box);
      items.forEach(item => item.classList.remove('hidden'));
      if (emptyEl) emptyEl.classList.add('hidden');
    }

    function getComboboxSelectedValue(box) {
      return box?.dataset.selectedValue || '';
    }

    function getTravelCityPlaceholder(box) {
      return box === travelOriginBox ? 'Pilih kota asal' : 'Pilih kota tujuan';
    }

    function clearTravelCitySelection(box) {
      if (!box) return;
      delete box.dataset.selectedValue;
      box.classList.remove('has-city-selection', 'is-open');
      const valueEl = box.querySelector('.combo-value');
      if (valueEl) {
        valueEl.textContent = getTravelCityPlaceholder(box);
        valueEl.classList.add('text-slate-500');
        valueEl.classList.remove('text-slate-800');
      }
      const trigger = box.querySelector('.combo-trigger');
      const leadingIcon = trigger?.querySelector('i:first-child');
      if (leadingIcon) {
        leadingIcon.className = 'fas fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400';
      }
      box.querySelector('.combo-dropdown')?.classList.add('hidden');
      restoreComboboxDisplay(box);
      clearFieldError(trigger);
    }

    function refreshTravelCityOptions(changedBox = null) {
      if (!travelOriginBox || !travelDestinationBox) return;

      let originValue = getComboboxSelectedValue(travelOriginBox);
      let destinationValue = getComboboxSelectedValue(travelDestinationBox);

      // Defensive cleanup: a stale equal pair can never remain selected.
      if (originValue && destinationValue && originValue === destinationValue) {
        const boxToClear = changedBox === travelDestinationBox ? travelOriginBox : travelDestinationBox;
        clearTravelCitySelection(boxToClear);
        originValue = getComboboxSelectedValue(travelOriginBox);
        destinationValue = getComboboxSelectedValue(travelDestinationBox);
      }

      setComboboxOptions(
        travelOriginBox,
        travelOriginOptions.filter(value => value !== destinationValue)
      );
      setComboboxOptions(
        travelDestinationBox,
        travelDestinationOptions.filter(value => value !== originValue)
      );
    }

    function setComboboxValue(box, value) {
      const valueEl = box.querySelector('.combo-value');
      const trigger = box.querySelector('.combo-trigger');
      const leadingIcon = trigger?.querySelector('i:first-child');
      const isPassengerBox = box.classList.contains('passenger-combobox');

      if (valueEl) {
        valueEl.textContent = value;
        valueEl.classList.remove('text-slate-500');
        valueEl.classList.add('text-slate-800');
      }

      if (leadingIcon) {
        if (isPassengerBox) {
          const passengerCount = Number.parseInt(value, 10) || 1;
          const passengerIcon = passengerCount > 1 ? 'fa-user-group' : 'fa-user';
          leadingIcon.className = `fas ${passengerIcon} absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400`;
        } else {
          leadingIcon.className = 'fas fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400';
        }
      }

      box.classList.toggle('has-city-selection', !isPassengerBox);
      box.dataset.selectedValue = value;

      if (box === travelOriginBox || box === travelDestinationBox) {
        refreshTravelCityOptions(box);
      }
    }

    function setComboboxOptions(box, values, iconClass = 'fas fa-location-dot text-singaraja-orange') {
      const optionsWrap = box?.querySelector('.combo-options');
      const emptyEl = box?.querySelector('.combo-empty');
      if (!optionsWrap) return;
      const selectedValue = getComboboxSelectedValue(box);
      optionsWrap.innerHTML = values.map(value => {
        const activeClass = value === selectedValue ? ' active' : '';
        return `<button type="button" class="combo-item${activeClass}" data-value="${value}"><i class="${iconClass}"></i><span>${value}</span></button>`;
      }).join('');
      if (emptyEl) emptyEl.classList.add('hidden');
    }

    const LOCATION_CACHE_KEY = 'singaraja:last-location';
    const LOCATION_CACHE_MAX_AGE = 15 * 60 * 1000;

    function readCachedDevicePosition() {
      try {
        const cached = JSON.parse(localStorage.getItem(LOCATION_CACHE_KEY) || 'null');
        const age = cached?.timestamp ? Date.now() - Number(cached.timestamp) : Infinity;
        if (
          Number.isFinite(cached?.latitude) &&
          Number.isFinite(cached?.longitude) &&
          age <= LOCATION_CACHE_MAX_AGE
        ) {
          return {
            coords: {
              latitude: Number(cached.latitude),
              longitude: Number(cached.longitude),
              accuracy: Number.isFinite(cached.accuracy) ? Number(cached.accuracy) : null
            }
          };
        }
      } catch (_) {}
      return null;
    }

    function cacheDevicePosition(position) {
      try {
        localStorage.setItem(LOCATION_CACHE_KEY, JSON.stringify({
          latitude: Number(position.coords.latitude),
          longitude: Number(position.coords.longitude),
          accuracy: Number.isFinite(position.coords.accuracy) ? Number(position.coords.accuracy) : null,
          timestamp: Date.now()
        }));
      } catch (_) {}
    }

    function refreshDevicePositionInBackground() {
      if (!navigator.geolocation) return;
      navigator.geolocation.getCurrentPosition(
        position => cacheDevicePosition(position),
        () => {},
        { enableHighAccuracy: false, timeout: 3000, maximumAge: 10 * 60 * 1000 }
      );
    }

    async function prewarmDeviceLocationCache() {
      if (!navigator.geolocation || !navigator.permissions?.query) return;
      try {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state === 'granted') refreshDevicePositionInBackground();
      } catch (_) {}
    }

    void prewarmDeviceLocationCache();

    comboboxes.forEach(box => {
      const trigger = box.querySelector('.combo-trigger');
      const dropdown = box.querySelector('.combo-dropdown');
      const search = box.querySelector('.combo-search');
      const inlineSearch = box.querySelector('.combo-inline-search');
      const inlineShell = box.querySelector('.combo-inline-search-shell');
      const emptyEl = box.querySelector('.combo-empty');
      const locationBtn = box.querySelector('.combo-location');

      trigger?.setAttribute('aria-expanded', 'false');

      function filterItems(keyword) {
        const query = keyword.trim().toLowerCase();
        const items = getComboboxItems(box);
        let visibleCount = 0;
        items.forEach(item => {
          const match = item.dataset.value.toLowerCase().includes(query);
          item.classList.toggle('hidden', !match);
          if (match) visibleCount += 1;
        });
        if (emptyEl) emptyEl.classList.toggle('hidden', visibleCount > 0);
      }

      trigger?.addEventListener('click', () => {
        if (trigger.disabled) return;
        const isHidden = dropdown?.classList.contains('hidden');
        if (isHidden) {
          openCombobox(box);
        } else {
          dropdown?.classList.add('hidden');
          box.classList.remove('is-open');
          trigger.setAttribute('aria-expanded', 'false');
          restoreComboboxDisplay(box);
          resetComboboxSearch(box);
        }
      });

      if (inlineSearch) {
        inlineSearch.addEventListener('input', () => filterItems(inlineSearch.value));
        inlineSearch.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            event.preventDefault();
            dropdown?.classList.add('hidden');
            box.classList.remove('is-open');
            restoreComboboxDisplay(box);
            resetComboboxSearch(box);
            trigger?.focus({ preventScroll: true });
            return;
          }

          if (event.key === 'ArrowDown') {
            event.preventDefault();
            const firstVisible = getComboboxItems(box).find(item => !item.classList.contains('hidden'));
            firstVisible?.focus();
          }
        });
      } else {
        search?.addEventListener('input', () => filterItems(search.value));
      }

      dropdown?.addEventListener('click', async (event) => {
        const item = event.target.closest('.combo-item');
        const locationBtnClicked = event.target.closest('.combo-location');

        if (item) {
          getComboboxItems(box).forEach(opt => opt.classList.remove('active'));
          item.classList.add('active');
          setComboboxValue(box, item.dataset.value);
          dropdown.classList.add('hidden');
          box.classList.remove('is-open');
          restoreComboboxDisplay(box);
          resetComboboxSearch(box);
          advanceAfterComboboxSelection(box);
          return;
        }

        if (locationBtnClicked) {
          if (window.innerWidth > 768) return;
          if (box.dataset.hasLocation !== 'true') return;
          if (!navigator.geolocation) {
            alert('Perangkat atau browser ini tidak mendukung akses lokasi.');
            return;
          }

          const originalHtml = locationBtnClicked.innerHTML;
          locationBtnClicked.disabled = true;
          locationBtnClicked.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Membaca lokasi...';
          box.dataset.locationResolved = 'false';

          let locationInteractionClosed = false;
          let watchdogId = null;

          const resetLocationDatasets = () => {
            box.dataset.locationResolved = 'false';
            delete box.dataset.locationSource;
            delete box.dataset.locationLatitude;
            delete box.dataset.locationLongitude;
            delete box.dataset.locationAccuracy;
            box.dataset.locationBreakpoint = '';
            box.dataset.airportMarker = '';
          };

          const showLocationRetryState = () => {
            locationBtnClicked.disabled = false;
            locationBtnClicked.innerHTML = '<i class="fas fa-location-crosshairs"></i> Lokasi belum terbaca · coba lagi';
            window.setTimeout(() => {
              if (!locationBtnClicked.disabled) locationBtnClicked.innerHTML = originalHtml;
            }, 1800);
          };

          const finishLocationSuccess = async (position, { silent = false } = {}) => {
            cacheDevicePosition(position);

            if (locationInteractionClosed && !silent) return;

            const resolved = await resolveDeviceLocation(position, box);

            if (locationInteractionClosed && !silent) return;

            applyResolvedLocationToBox(box, resolved);
            void enrichResolvedLocationLabel(box, resolved);

            if (silent) return;

            locationInteractionClosed = true;
            if (watchdogId) window.clearTimeout(watchdogId);

            locationBtnClicked.disabled = false;
            locationBtnClicked.innerHTML = '<i class="fas fa-circle-check"></i> Lokasi terdeteksi';
            dropdown.classList.remove('hidden');
            box.classList.add('is-open');

            window.setTimeout(() => {
              dropdown.classList.add('hidden');
              box.classList.remove('is-open');
              restoreComboboxDisplay(box);
              resetComboboxSearch(box);
              advanceAfterComboboxSelection(box);
            }, 650);

            // Improve only the cache in the background. Do not block or re-open the UI.
            window.setTimeout(() => {
              navigator.geolocation.getCurrentPosition(
                freshPosition => cacheDevicePosition(freshPosition),
                () => {},
                { enableHighAccuracy: true, timeout: 3500, maximumAge: 5 * 60 * 1000 }
              );
            }, 0);
          };

          const handleLocationFailure = error => {
            if (locationInteractionClosed) return;
            locationInteractionClosed = true;
            if (watchdogId) window.clearTimeout(watchdogId);
            resetLocationDatasets();

            if (error?.code === 1) {
              locationBtnClicked.disabled = false;
              locationBtnClicked.innerHTML = originalHtml;
              alert('Izin lokasi ditolak. Aktifkan izin lokasi browser lalu coba lagi.');
              return;
            }

            showLocationRetryState();
          };

          const cachedPosition = readCachedDevicePosition();
          if (cachedPosition) {
            void finishLocationSuccess(cachedPosition);
            refreshDevicePositionInBackground();
            return;
          }

          // UI watchdog: never leave the user staring at a spinner for more than ~3 seconds.
          watchdogId = window.setTimeout(() => {
            if (locationInteractionClosed) return;
            locationInteractionClosed = true;
            resetLocationDatasets();
            showLocationRetryState();
          }, 3000);

          // Fast initial read. Browser GPS may continue internally, but the UI has its own deadline.
          navigator.geolocation.getCurrentPosition(
            position => {
              if (locationInteractionClosed) {
                cacheDevicePosition(position);
                return;
              }
              void finishLocationSuccess(position);
            },
            handleLocationFailure,
            { enableHighAccuracy: false, timeout: 2800, maximumAge: 10 * 60 * 1000 }
          );
        }
      });
    });

    refreshTravelCityOptions();

    const dateInput = document.getElementById('travelDate');
    const travelReturnDate = document.getElementById('travelReturnDate');
    const travelReturnWrap = document.getElementById('travelReturnWrap');
    const travelForm = document.getElementById('travelForm');
    const airportForm = document.getElementById('airportForm');
    const charterForm = document.getElementById('charterForm');
    const tripModeInputs = document.querySelectorAll('.trip-mode');
    const languageToggle = document.getElementById('languageToggle');
    const langIdLabel = document.getElementById('langIdLabel');
    const langEnLabel = document.getElementById('langEnLabel');
    const langIdFlag = document.getElementById('langIdFlag');
    const langEnFlag = document.getElementById('langEnFlag');
    const localizedDateInputs = [
      document.getElementById('travelDate'),
      document.getElementById('travelReturnDate'),
      document.getElementById('airportPickupDate'),
      document.getElementById('charterPickupDate')
    ].filter(Boolean);
    const airportPickupDate = document.getElementById('airportPickupDate');
    const airportPickupTime = document.getElementById('airportPickupTime');
    const charterPickupDate = document.getElementById('charterPickupDate');
    const charterPickupTime = document.getElementById('charterPickupTime');
    let currentLang = 'id';

    function getCurrentTimeString() {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }

    function updateCurrentTimePlaceholder() {
      [airportPickupTime, charterPickupTime].forEach(input => {
        if (input && !input.value) input.placeholder = getCurrentTimeString();
      });
    }

    function applyDateLocale(lang) {
      currentLang = lang;
      const todayPlaceholders = getTodayDateStrings();
      localizedDateInputs.forEach(input => {
        input.dataset.placeholderId = todayPlaceholders.id;
        input.dataset.placeholderEn = todayPlaceholders.en;
        const placeholder = lang === 'id' ? todayPlaceholders.id : todayPlaceholders.en;
        if (!input.dataset.value) input.placeholder = placeholder;
        if (input.dataset.value) {
          input.value = formatSelectedDate(new Date(input.dataset.value + 'T00:00:00'), currentLang);
        }
      });
      if (langIdFlag && langEnFlag) {
        langIdFlag.className = lang === 'id'
          ? 'flex items-center gap-1.5 opacity-100'
          : 'flex items-center gap-1.5 opacity-55';
        langEnFlag.className = lang === 'en'
          ? 'flex items-center gap-1.5 opacity-100'
          : 'flex items-center gap-1.5 opacity-55';
      }
      document.documentElement.lang = lang === 'id' ? 'id' : 'en';
      renderDatePicker();
    }

    function setTripModeUI(activeInput) {
      tripModeInputs.forEach(input => {
        const label = input.closest('.trip-mode-label');
        const dot = label?.querySelector('.trip-radio-dot');
        if (!label || !dot) return;
        if (input === activeInput) {
          label.classList.add('text-singaraja-orange');
          label.classList.remove('text-slate-500');
          dot.classList.remove('opacity-0');
        } else {
          label.classList.remove('text-singaraja-orange');
          label.classList.add('text-slate-500');
          dot.classList.add('opacity-0');
        }
      });
    }

    function applyTripMode(mode) {
      const roundTrip = mode === 'round-trip';
      if (travelReturnWrap) travelReturnWrap.classList.toggle('hidden', !roundTrip);
      if (travelForm) {
        travelForm.classList.toggle('round-trip', roundTrip);
      }
      if (!roundTrip && travelReturnDate) {
        travelReturnDate.value = '';
        delete travelReturnDate.dataset.value;
        clearFieldError(travelReturnDate);
        if (activeDateInput === travelReturnDate) hideDatePicker();
      }
    }

    tripModeInputs.forEach(input => {
      input.addEventListener('change', () => {
        setTripModeUI(input);
        applyTripMode(input.dataset.mode);
      });
    });

    const monthNames = {
      id: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'],
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    };
    const weekdayNames = {
      id: ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'],
      en: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    };

    function formatSelectedDate(date, lang) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = monthNames[lang][date.getMonth()];
      const year = date.getFullYear();
      return lang === 'id' ? `${day} ${month}, ${year}` : `${month} ${day}, ${year}`;
    }
    function getTodayDateStrings() {
      const now = new Date();
      return {
        id: formatSelectedDate(now, 'id'),
        en: formatSelectedDate(now, 'en')
      };
    }

    const sharedDatePicker = document.getElementById('sharedDatePicker');
    const datePickerMonths = document.getElementById('datePickerMonths');
    const datePickerPrev = document.getElementById('datePickerPrev');
    const datePickerNext = document.getElementById('datePickerNext');
    let activeDateInput = null;
    let visibleMonth = (() => { const now = new Date(); return new Date(now.getFullYear(), now.getMonth(), 1); })();

    function getPopoverAnchor(target) {
      return target?.closest('.relative') || target?.parentElement || target;
    }

    function attachPopoverToField(popover, target) {
      const anchor = getPopoverAnchor(target);
      if (!popover || !anchor) return null;
      anchor.classList.add('field-popover-anchor');
      if (popover.parentElement !== anchor) {
        anchor.appendChild(popover);
      }
      popover.classList.add('is-attached-panel');
      return anchor;
    }

    function startOfDay(date) {
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }

    function getMinDateForInput(input) {
      const today = startOfDay(new Date());
      if (input?.id === 'travelReturnDate' && dateInput?.dataset.value) {
        const depart = startOfDay(new Date(dateInput.dataset.value + 'T00:00:00'));
        return depart > today ? depart : today;
      }
      return today;
    }

    function buildMonthCalendar(monthDate) {
      const monthIndex = monthDate.getMonth();
      const year = monthDate.getFullYear();
      const firstDay = new Date(year, monthIndex, 1);
      const lastDay = new Date(year, monthIndex + 1, 0);
      const startWeekday = (firstDay.getDay() + 6) % 7;
      const selectedISO = activeDateInput?.dataset.value || '';
      const today = startOfDay(new Date());
      const minDate = activeDateInput ? getMinDateForInput(activeDateInput) : today;

      const wrapper = document.createElement('div');
      wrapper.className = 'rounded-2xl border border-slate-200 p-3 bg-white';
      wrapper.innerHTML = `<div class="calendar-header-title mb-3">${monthNames[currentLang][monthIndex]} ${year}</div>`;

      const labels = document.createElement('div');
      labels.className = 'calendar-grid';
      weekdayNames[currentLang].forEach(label => {
        const el = document.createElement('div');
        el.className = 'calendar-day-label';
        el.textContent = label;
        labels.appendChild(el);
      });
      wrapper.appendChild(labels);

      const grid = document.createElement('div');
      grid.className = 'calendar-grid';

      for (let i = 0; i < startWeekday; i++) {
        const empty = document.createElement('span');
        empty.className = 'calendar-date is-muted';
        empty.textContent = '';
        grid.appendChild(empty);
      }

      for (let day = 1; day <= lastDay.getDate(); day++) {
        const cellDate = new Date(year, monthIndex, day);
        const iso = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'calendar-date';
        btn.textContent = day;
        if (startOfDay(cellDate).getTime() === today.getTime()) btn.classList.add('is-today');
        if (selectedISO === iso) btn.classList.add('is-selected');
        if (startOfDay(cellDate) < minDate) btn.classList.add('is-disabled');
        btn.addEventListener('click', () => {
          if (!activeDateInput || btn.classList.contains('is-disabled')) return;
          const selectedInput = activeDateInput;
          selectedInput.dataset.value = iso;
          selectedInput.value = formatSelectedDate(cellDate, currentLang);
          clearFieldError(selectedInput);
          selectedInput.placeholder = selectedInput.dataset.placeholderId || selectedInput.placeholder;

          if (selectedInput.id === 'travelDate' && travelReturnDate?.dataset.value && travelReturnDate.dataset.value < iso) {
            travelReturnDate.dataset.value = '';
            travelReturnDate.value = '';
            travelReturnDate.placeholder = currentLang === 'id' ? travelReturnDate.dataset.placeholderId : travelReturnDate.dataset.placeholderEn;
          }

          hideDatePicker();

          advanceToNextIncomplete(selectedInput);
        });
        grid.appendChild(btn);
      }

      wrapper.appendChild(grid);
      return wrapper;
    }

    function renderDatePicker() {
      if (!datePickerMonths) return;
      datePickerMonths.innerHTML = '';
      datePickerMonths.appendChild(buildMonthCalendar(visibleMonth));
      if (window.innerWidth > 768) {
        datePickerMonths.appendChild(buildMonthCalendar(new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1)));
      }
    }

    function positionPopover(popover, target) {
      if (!popover || !target) return;
      const rect = target.getBoundingClientRect();
      const isMobile = window.innerWidth <= 768;
      const isTimePicker = popover.id === 'sharedTimePicker';
      const isDatePicker = popover.id === 'sharedDatePicker';
      const anchor = attachPopoverToField(popover, target);
      if (!anchor) return;

      const anchorRect = anchor.getBoundingClientRect();
      let left = 0;

      if (isTimePicker) {
        document.documentElement.style.setProperty('--active-time-field-width', `${rect.width}px`);
        popover.style.setProperty('width', `${rect.width}px`, 'important');
        popover.style.setProperty('max-width', `${rect.width}px`, 'important');
        popover.style.setProperty('min-width', `${rect.width}px`, 'important');
      } else if (isDatePicker) {
        if (isMobile) {
          const form = target.closest('form');
          const referenceRect = form ? form.getBoundingClientRect() : rect;
          popover.style.setProperty('width', `${referenceRect.width}px`, 'important');
          popover.style.setProperty('max-width', `${referenceRect.width}px`, 'important');
          popover.style.setProperty('min-width', `${referenceRect.width}px`, 'important');
          left = referenceRect.left - anchorRect.left;
        } else {
          const desiredWidth = Math.min(500, Math.max(280, window.innerWidth - 20));
          popover.style.setProperty('width', `${desiredWidth}px`, 'important');
          popover.style.removeProperty('min-width');
          popover.style.removeProperty('max-width');
          const globalLeft = anchorRect.left;
          const viewportRight = window.innerWidth - 10;
          if (globalLeft + desiredWidth > viewportRight) {
            left = viewportRight - (globalLeft + desiredWidth);
          }
          if (globalLeft + left < 10) left = 10 - globalLeft;
        }
      }

      popover.style.setProperty('top', 'calc(100% + var(--booking-panel-gap, 4px))', 'important');
      popover.style.setProperty('left', `${left}px`, 'important');
    }

    function showDatePicker(input) {
      localizedDateInputs.forEach(el => el.classList.remove('is-active'));
      airportPickupTime?.classList.remove('is-active');
      charterPickupTime?.classList.remove('is-active');
      activeDateInput = input;
      input.classList.add('is-active');
      if (input.dataset.value) {
        const selected = new Date(input.dataset.value + 'T00:00:00');
        visibleMonth = new Date(selected.getFullYear(), selected.getMonth(), 1);
      }
      sharedDatePicker.classList.remove('hidden');
      renderDatePicker();
      positionPopover(sharedDatePicker, input);
    }

    function hideDatePicker() {
      sharedDatePicker.classList.add('hidden');
      if (activeDateInput) activeDateInput.classList.remove('is-active');
      activeDateInput = null;
    }

    localizedDateInputs.forEach(input => {
      input.addEventListener('click', () => {
        if (input === travelReturnDate && !dateInput?.dataset.value) {
          dateInput?.focus({ preventScroll: true });
          if (dateInput) showDatePicker(dateInput);
          return;
        }
        showDatePicker(input);
      });
    });

    datePickerPrev?.addEventListener('click', () => {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() - 1, 1);
      renderDatePicker();
    });

    datePickerNext?.addEventListener('click', () => {
      visibleMonth = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth() + 1, 1);
      renderDatePicker();
    });

    const sharedTimePicker = document.getElementById('sharedTimePicker');
    const timeHourList = document.getElementById('timeHourList');
    const timeMinuteList = document.getElementById('timeMinuteList');
    const timePickerDone = document.getElementById('timePickerDone');
    let activeTimeInput = null;
    const initialPickerTime = new Date();
    let selectedHour = String(initialPickerTime.getHours()).padStart(2, '0');
    let selectedMinute = String(Math.floor(initialPickerTime.getMinutes() / 5) * 5).padStart(2, '0');

    function updateTimePreview() {
      if (!activeTimeInput) return;
      activeTimeInput.value = `${selectedHour}:${selectedMinute}`;
      activeTimeInput.dataset.value = activeTimeInput.value;
      clearFieldError(activeTimeInput);
    }

    function setActiveTimeOption(container, selectedValue) {
      if (!container) return;
      container.querySelectorAll('.time-option').forEach(option => {
        option.classList.toggle('active', option.dataset.value === selectedValue);
      });
    }

    function renderTimeColumn(container, values, type) {
      if (!container) return;
      container.innerHTML = '';

      values.forEach(value => {
        const option = document.createElement('button');
        option.type = 'button';
        option.dataset.value = value;
        option.setAttribute('aria-pressed', 'false');
        option.className = 'time-option w-full rounded-lg px-2 py-1.5 text-center text-[13px] text-slate-700 transition';
        option.textContent = value;

        const isSelected = type === 'hour'
          ? value === selectedHour
          : value === selectedMinute;

        if (isSelected) {
          option.classList.add('active');
          option.setAttribute('aria-pressed', 'true');
        }

        option.addEventListener('click', () => {
          if (type === 'hour') {
            selectedHour = value;
            setActiveTimeOption(timeHourList, selectedHour);
          } else {
            selectedMinute = value;
            setActiveTimeOption(timeMinuteList, selectedMinute);
          }

          container.querySelectorAll('.time-option').forEach(item => {
            item.setAttribute('aria-pressed', item.classList.contains('active') ? 'true' : 'false');
          });

          updateTimePreview();
        });

        container.appendChild(option);
      });
    }

    function scrollSelectedTimeIntoView(container) {
      if (!container) return;
      const activeOption = container.querySelector('.time-option.active');
      if (!activeOption) return;

      requestAnimationFrame(() => {
        const targetTop = activeOption.offsetTop - (container.clientHeight / 2) + (activeOption.offsetHeight / 2);
        container.scrollTop = Math.max(0, targetTop);
      });
    }

    function renderTimePicker({ scrollToSelection = false } = {}) {
      renderTimeColumn(
        timeHourList,
        Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')),
        'hour'
      );
      renderTimeColumn(
        timeMinuteList,
        ['00','05','10','15','20','25','30','35','40','45','50','55'],
        'minute'
      );

      if (scrollToSelection) {
        scrollSelectedTimeIntoView(timeHourList);
        scrollSelectedTimeIntoView(timeMinuteList);
      }
    }

    function showTimePicker(input) {
      localizedDateInputs.forEach(el => el.classList.remove('is-active'));
      airportPickupTime?.classList.remove('is-active');
      charterPickupTime?.classList.remove('is-active');
      activeTimeInput = input;
      input.classList.add('is-active');
      if (input.value && /^\d{2}:\d{2}$/.test(input.value)) {
        [selectedHour, selectedMinute] = input.value.split(':');
      } else {
        const now = new Date();
        selectedHour = String(now.getHours()).padStart(2, '0');
        selectedMinute = String(Math.floor(now.getMinutes() / 5) * 5).padStart(2, '0');
      }
      renderTimePicker({ scrollToSelection: true });
      sharedTimePicker.classList.remove('hidden');
      positionPopover(sharedTimePicker, input);
    }

    function hideTimePicker() {
      sharedTimePicker.classList.add('hidden');
      if (activeTimeInput) activeTimeInput.classList.remove('is-active');
      activeTimeInput = null;
    }

    airportPickupTime?.addEventListener('click', () => showTimePicker(airportPickupTime));
    charterPickupTime?.addEventListener('click', () => showTimePicker(charterPickupTime));
    timePickerDone?.addEventListener('click', () => {
      const completedTimeInput = activeTimeInput;
      updateTimePreview();
      hideTimePicker();
      advanceToNextIncomplete(completedTimeInput || airportPickupTime);
    });

    function clearFieldError(element) {
      if (!element) return;
      element.classList.remove('field-error');
      element.removeAttribute('aria-invalid');
    }

    function markFieldError(element) {
      if (!element) return;
      element.classList.add('field-error');
      element.setAttribute('aria-invalid', 'true');
    }

    function comboboxHasValue(box) {
      if (!box) return true;
      const valueEl = box.querySelector('.combo-value');
      if (!valueEl) return true;
      return !valueEl.textContent.trim().toLowerCase().startsWith('pilih');
    }

    function validateTravelForm() {
      let valid = true;
      let firstInvalid = null;
      const requiredCombos = Array.from(travelForm?.querySelectorAll('[data-combobox][data-required="true"]') || []);
      requiredCombos.forEach(box => {
        const trigger = box.querySelector('.combo-trigger');
        clearFieldError(trigger);
        if (!comboboxHasValue(box)) {
          valid = false;
          markFieldError(trigger);
          firstInvalid ||= trigger;
        }
      });

      [dateInput].forEach(input => {
        clearFieldError(input);
        if (!input?.dataset.value) {
          valid = false;
          markFieldError(input);
          firstInvalid ||= input;
        }
      });

      if (travelForm?.classList.contains('round-trip')) {
        clearFieldError(travelReturnDate);
        if (!travelReturnDate?.dataset.value) {
          valid = false;
          markFieldError(travelReturnDate);
          firstInvalid ||= travelReturnDate;
        } else if (dateInput?.dataset.value && travelReturnDate.dataset.value < dateInput.dataset.value) {
          // Same-day PP is valid; only a return date before departure is rejected.
          valid = false;
          markFieldError(travelReturnDate);
          firstInvalid ||= travelReturnDate;
        }
      } else {
        clearFieldError(travelReturnDate);
      }

      firstInvalid?.focus?.();
      return valid;
    }

    function validateAirportForm() {
      let valid = true;
      let firstInvalid = null;
      const requiredCombos = Array.from(airportForm?.querySelectorAll('[data-combobox][data-required="true"]') || []);
      requiredCombos.forEach(box => {
        const trigger = box.querySelector('.combo-trigger');
        clearFieldError(trigger);
        if (!comboboxHasValue(box)) {
          valid = false;
          markFieldError(trigger);
          firstInvalid ||= trigger;
        }
      });

      [airportPickupDate, airportPickupTime].forEach(input => {
        clearFieldError(input);
        const hasValue = input?.id === 'airportPickupDate' ? Boolean(input?.dataset.value) : Boolean(input?.value);
        if (!hasValue) {
          valid = false;
          markFieldError(input);
          firstInvalid ||= input;
        }
      });

      firstInvalid?.focus?.();
      return valid;
    }

    function validateCharterForm() {
      let valid = true;
      let firstInvalid = null;
      const requiredCombos = Array.from(charterForm?.querySelectorAll('[data-combobox][data-required="true"]') || []);
      requiredCombos.forEach(box => {
        const trigger = box.querySelector('.combo-trigger');
        clearFieldError(trigger);
        if (!comboboxHasValue(box)) {
          valid = false;
          markFieldError(trigger);
          firstInvalid ||= trigger;
        }
      });

      [charterPickupDate, charterPickupTime].forEach(input => {
        clearFieldError(input);
        const hasValue = input?.id === 'charterPickupDate' ? Boolean(input?.dataset.value) : Boolean(input?.value);
        if (!hasValue) {
          valid = false;
          markFieldError(input);
          firstInvalid ||= input;
        }
      });

      firstInvalid?.focus?.();
      return valid;
    }

    travelForm?.addEventListener('submit', event => {
      event.preventDefault();
      validateTravelForm();
    });

    airportForm?.addEventListener('submit', event => {
      event.preventDefault();
      validateAirportForm();
    });

    charterForm?.addEventListener('submit', event => {
      event.preventDefault();
      validateCharterForm();
    });

    // One global pointer-close handler for comboboxes, pickers, language menu, and field errors.
    document.addEventListener('click', (event) => {
      const target = event.target;
      const item = target.closest('.combo-item');
      if (item) {
        const trigger = item.closest('[data-combobox]')?.querySelector('.combo-trigger');
        clearFieldError(trigger);
      }

      if (!target.closest('[data-combobox]')) closeAllComboboxes();
      if (!mobileLanguageSelector?.contains(target)) closeMobileLanguageMenu();

      if (sharedDatePicker && !sharedDatePicker.classList.contains('hidden') && activeDateInput && target !== activeDateInput && !sharedDatePicker.contains(target)) {
        hideDatePicker();
      }
      if (sharedTimePicker && !sharedTimePicker.classList.contains('hidden') && activeTimeInput && target !== activeTimeInput && !sharedTimePicker.contains(target)) {
        hideTimePicker();
      }
    });

    window.addEventListener('resize', () => {
      if (sharedDatePicker && !sharedDatePicker.classList.contains('hidden') && activeDateInput) {
        renderDatePicker();
        positionPopover(sharedDatePicker, activeDateInput);
      }
      if (sharedTimePicker && !sharedTimePicker.classList.contains('hidden') && activeTimeInput) {
        positionPopover(sharedTimePicker, activeTimeInput);
      }
    });

    const defaultTripMode = document.querySelector('.trip-mode[data-mode="one-way"]');
    if (defaultTripMode) {
      defaultTripMode.checked = true;
      setTripModeUI(defaultTripMode);
      applyTripMode(defaultTripMode.dataset.mode);
    }

    languageToggle?.addEventListener('click', () => {
      applyDateLocale(currentLang === 'id' ? 'en' : 'id');
    });

    applyDateLocale('id');
    updateCurrentTimePlaceholder();
    setInterval(updateCurrentTimePlaceholder, 60000);

    const airportLocations = [
      'Singaraja / Lovina',
      'Amed',
      'Ubud Centre',
      'Karangasem / Padang Bai',
      'Pemuteran / Tejakula'
    ];

    const airportPickupBox = document.getElementById('airportPickupBox');
    const airportDestinationBox = document.getElementById('airportDestinationBox');
    const airportPickupTrigger = document.getElementById('airportPickupTrigger');
    const airportDestinationTrigger = document.getElementById('airportDestinationTrigger');
    const airportPickupChevron = document.getElementById('airportPickupChevron');
    const airportDestinationChevron = document.getElementById('airportDestinationChevron');
    const airportPickupLabel = document.getElementById('airportPickupLabel');
    const airportDestinationLabel = document.getElementById('airportDestinationLabel');
    const airportPickupIcon = document.getElementById('airportPickupIcon');
    const airportDestinationIcon = document.getElementById('airportDestinationIcon');
    const airportDirectionInputs = document.querySelectorAll('.airport-direction');

    function setAirportDirectionUI(activeInput) {
      airportDirectionInputs.forEach(input => {
        const label = input.closest('.airport-direction-label');
        const dot = label?.querySelector('.airport-radio-dot');
        if (!label || !dot) return;
        if (input === activeInput) {
          label.classList.add('text-singaraja-orange');
          label.classList.remove('text-slate-500');
          dot.classList.remove('opacity-0');
        } else {
          label.classList.remove('text-singaraja-orange');
          label.classList.add('text-slate-500');
          dot.classList.add('opacity-0');
        }
      });
    }

    function setAirportBoxState(box, trigger, chevron, values, displayValue, isFixed, iconClass, placeholder, allowLocation = false) {
      if (!box || !trigger) return;
      setComboboxOptions(box, values, iconClass);
      const valueEl = box.querySelector('.combo-value');
      if (isFixed) {
        setComboboxValue(box, displayValue);
      } else if (valueEl) {
        valueEl.textContent = placeholder;
        valueEl.classList.add('text-slate-500');
        valueEl.classList.remove('text-slate-800');
      }
      trigger.disabled = isFixed;
      trigger.classList.toggle('cursor-default', isFixed);
      trigger.classList.toggle('cursor-pointer', !isFixed);
      chevron?.classList.toggle('hidden', isFixed);
      const locationEnabled = !isFixed && allowLocation;
      box.dataset.hasLocation = String(locationEnabled);
      box.dataset.locationResolved = 'false';
      box.dataset.locationBreakpoint = '';
      box.dataset.airportMarker = '';
      const locationButton = box.querySelector('.combo-location');
      locationButton?.classList.toggle('hidden', !locationEnabled);
      box.querySelectorAll('.combo-item').forEach(item => item.classList.remove('active'));
      box.querySelector('.combo-dropdown')?.classList.add('hidden');
      box.classList.remove('is-open');
    }

    function applyAirportDirection(direction) {
      const fromAirport = direction === 'from-airport';
      const airport = 'Bandara Ngurah Rai';

      if (airportPickupLabel) airportPickupLabel.textContent = 'Asal';
      if (airportDestinationLabel) airportDestinationLabel.textContent = 'Tujuan';
      if (airportPickupBox) airportPickupBox.dataset.locationLabel = 'Asal';
      if (airportDestinationBox) airportDestinationBox.dataset.locationLabel = 'Tujuan';

      setAirportBoxState(
        airportPickupBox,
        airportPickupTrigger,
        airportPickupChevron,
        fromAirport ? [airport] : airportLocations,
        airport,
        fromAirport,
        fromAirport ? 'fas fa-plane-arrival text-slate-400' : 'fas fa-location-dot text-singaraja-orange',
        'Pilih kota asal',
        !fromAirport
      );

      setAirportBoxState(
        airportDestinationBox,
        airportDestinationTrigger,
        airportDestinationChevron,
        fromAirport ? airportLocations : [airport],
        airport,
        !fromAirport,
        fromAirport ? 'fas fa-location-dot text-singaraja-orange' : 'fas fa-plane-departure text-slate-400',
        'Pilih kota tujuan',
        false
      );

      if (airportPickupIcon) {
        airportPickupIcon.className = fromAirport
          ? 'fas fa-plane-arrival absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400'
          : 'fas fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-singaraja-orange';
      }
      if (airportDestinationIcon) {
        airportDestinationIcon.className = fromAirport
          ? 'fas fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-singaraja-orange'
          : 'fas fa-plane-departure absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400';
      }
    }

    function syncAirportDirection(input) {
      if (!input) return;
      input.checked = true;
      setAirportDirectionUI(input);
      applyAirportDirection(input.dataset.direction);
    }

    airportDirectionInputs.forEach(input => {
      input.addEventListener('change', () => syncAirportDirection(input));
    });

    document.querySelectorAll('.airport-direction-label').forEach(label => {
      label.addEventListener('click', () => {
        const input = label.querySelector('.airport-direction');
        requestAnimationFrame(() => syncAirportDirection(input));
      });
    });

    const defaultAirportDirection = document.querySelector('.airport-direction:checked')
      || document.querySelector('.airport-direction[data-direction="from-airport"]');
    syncAirportDirection(defaultAirportDirection);
  
