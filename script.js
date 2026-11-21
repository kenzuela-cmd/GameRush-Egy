
/* ============================================
   GAMERUSH - JAVASCRIPT
============================================ */

document.addEventListener("DOMContentLoaded", () => {

  const $ = selector => document.querySelector(selector);

  const $$ = selector => [
    ...document.querySelectorAll(selector)
  ];

  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;


  /* ========================================
     1. STORE CONTACT INFORMATION
  ======================================== */

  const storeContact = {

    whatsapp: "201127128720",

    facebook:
      "https://www.facebook.com/profile.php?id=61569019379323",

    messenger: "61569019379323"

  };


  function createWhatsAppLink(message) {

    return `https://wa.me/${storeContact.whatsapp}?text=${encodeURIComponent(message)}`;

  }


  function createMessengerLink() {

    return `https://m.me/${storeContact.messenger}`;

  }


  /* CONNECT ALL SOCIAL MEDIA BUTTONS */

  $$("[data-social]").forEach(link => {

    const social = link.dataset.social;

    if (social === "whatsapp") {

      link.href = createWhatsAppLink(
        "Hello GameRush! I would like to inquire about your games."
      );

    }

    if (social === "facebook") {

      link.href = storeContact.facebook;

    }

    if (social === "messenger") {

      link.href = createMessengerLink();

    }

    link.target = "_blank";

    link.rel = "noopener noreferrer";

  });


  /* ========================================
     2. HERO SLIDESHOW
  ======================================== */

  const slides = $$(".hero-slide");

  const indicators = $$(".slide-indicator");

  const hero = $(".hero");

  let currentSlide = 0;

  let slideTimer;


  function showSlide(index) {

    if (!slides.length) return;

    currentSlide =
      (index + slides.length) % slides.length;


    slides.forEach((slide, i) => {

      const active = i === currentSlide;

      slide.classList.toggle("active", active);

      slide.setAttribute(
        "aria-hidden",
        String(!active)
      );

      slide.querySelectorAll("a, button")
        .forEach(control => {

          control.tabIndex = active ? 0 : -1;

        });

    });


    indicators.forEach((indicator, i) => {

      const active = i === currentSlide;

      indicator.classList.toggle("active", active);

      indicator.setAttribute(
        "aria-pressed",
        String(active)
      );

    });


    const slideCounter = $("#currentSlide");

    if (slideCounter) {

      slideCounter.textContent =
        String(currentSlide + 1).padStart(2, "0");

    }

  }


  function stopSlideshow() {

    clearInterval(slideTimer);

  }


  function startSlideshow() {

    stopSlideshow();

    if (
      slides.length < 2 ||
      reducedMotion ||
      document.hidden ||
      hero?.contains(document.activeElement)
    ) {

      return;

    }


    slideTimer = setInterval(() => {

      showSlide(currentSlide + 1);

    }, 5500);

  }


  function changeSlide(index) {

    showSlide(index);

    startSlideshow();

  }


  $("#prevSlide")?.addEventListener("click", () => {

    changeSlide(currentSlide - 1);

  });


  $("#nextSlide")?.addEventListener("click", () => {

    changeSlide(currentSlide + 1);

  });


  indicators.forEach((indicator, index) => {

    indicator.addEventListener("click", () => {

      changeSlide(index);

    });

  });


  hero?.addEventListener(
    "focusin",
    stopSlideshow
  );


  hero?.addEventListener("focusout", event => {

    if (!hero.contains(event.relatedTarget)) {

      requestAnimationFrame(startSlideshow);

    }

  });


  document.addEventListener(
    "visibilitychange",
    () => {

      if (document.hidden) {

        stopSlideshow();

      } else {

        startSlideshow();

      }

    }
  );


  showSlide(0);

  startSlideshow();



  /* ========================================
     4. GAME PRICES

     Images are located in HTML.
  ======================================== */

  const gamePrices = {

    // WOLVERINE

    wolverine: {

      Standard: {

        PS5: {
          Primary: 2000,
          Secondary: 1500
        }

      }

    },


    // GAME 01 - 007

    "007": {

      Standard: {

        PS5: {
          Primary: 1750,
          Secondary: 1500
        }

      }

    },


    // GAME 02 - FC 27

    fc27: {

      Standard: {

        PS5: {
          Primary: 1100,
          Secondary: 700
        },

        PS4: {
          Primary: 450
        }

      }

    },


    // GAME 03 - SPIDER-MAN 2

    spiderman2: {

      Standard: {

        PS5: {
          Primary: 1750,
          Secondary: 1500
        }

      }

    },


    // GAME 04 - MILES MORALES

    milesmorales: {

      Standard: {

        PS5: {
          Primary: 500,
          Secondary: 400
        },

        PS4: {
          Primary: 650
        }

      }

    },


    // GAME 05 - MARVEL'S SPIDER-MAN

    spiderman: {

      Standard: {

        PS5: {
          Primary: 400,
          Secondary: 300
        },

        PS4: {
          Primary: 550
        }

      }

    },


    // GAME 06 - FORZA HORIZON 5

    forza5: {

      Standard: {

        PS5: {
          Primary: 1200,
          Secondary: 800
        }

      }

    },


    // GAME 07 - GOD OF WAR

    godofwar: {

      Standard: {

        PS5: {
          Primary: 500,
          Secondary: 350
        },

        PS4: {
          Primary: 350
        }

      }

    },


    // GAME 08 - RED DEAD REDEMPTION 2

    rdr2: {

      Standard: {

        PS5: {
          Primary: 650,
          Secondary: 350
        },

        PS4: {
          Primary: 450
        }

      }

    },


    // GAME 09 - CRASH TEAM RACING

    crash: {

      Standard: {

        PS5: {
          Primary: 350
        },

        PS4: {
          Primary: 250
        }

      }

    },


    // GAME 10 - GTA V

    gta5: {

      Standard: {

        PS5: {
          Primary: 650,
          Secondary: 350
        },

        PS4: {
          Primary: 450
        }

      }

    }

    

  };


  /* ========================================
     5. CATALOG VARIABLES
  ======================================== */

  const currency = "EGP";

  let activeFilter = "all";

  const cards = $$("#gamesGrid .game-card");

  const cardStates = new Map();


  function formatPrice(price) {

    return price.toLocaleString("en-US")
      + " "
      + currency;

  }


  function normalizeSearch(value) {

    return value

      .toLowerCase()

      .normalize("NFD")

      .replace(/[\u0300-\u036f]/g, "")

      .replace(/spider[-\s]?man/g, "spiderman")

      .replace(/\bgrand theft auto\b/g, "gta")

      .replace(/\bgta\s*5\b/g, "gta v")

      .trim();

  }


  /* ========================================
     6. INITIALIZE GAME CARDS
  ======================================== */

  cards.forEach(card => {

    const id = card.dataset.id;

    const game = gamePrices[id];

    if (!game) return;


    const editions = Object.keys(game);


    const platforms =
      (card.dataset.platforms || "")

        .trim()

        .split(/\s+/)

        .filter(Boolean)

        .map(platform => platform.toUpperCase());


    if (!platforms.length) return;


    cardStates.set(card, {

      platforms,

      editions,

      selectedPlatform: platforms[0],

      selectedEdition: editions[0],

      selectedAccount: "Primary"

    });

  });


  /* ========================================
     7. CREATE CONSOLE AND EDITION BUTTONS
  ======================================== */

  function createButtons(

    card,

    selector,

    values,

    selected,

    onSelect

  ) {

    const target = card.querySelector(selector);

    if (!target) return;

    target.replaceChildren();

    if (values.length < 2) return;


    values.forEach(value => {

      const button =
        document.createElement("button");


      button.type = "button";

      button.textContent = value;


      button.classList.toggle(
        "active",
        value === selected
      );


      button.setAttribute(
        "aria-pressed",
        String(value === selected)
      );


      button.addEventListener("click", () => {

        onSelect(value);

        updateCard(card);


        const selectedButton = [
          ...target.querySelectorAll("button")
        ].find(item => item.textContent === value);


        selectedButton?.focus();

      });


      target.appendChild(button);

    });

  }


  /* ========================================
     8. UPDATE GAME CARD PRICES
  ======================================== */

  function updateCard(card) {

    const id = card.dataset.id;

    const game = gamePrices[id];

    const state = cardStates.get(card);

    if (!game || !state) return;


    // Console selector

    createButtons(

      card,

      ".consoles",

      state.platforms,

      state.selectedPlatform,

      value => {

        state.selectedPlatform = value;

      }

    );


    // Edition selector

    createButtons(

      card,

      ".editions",

      state.editions,

      state.selectedEdition,

      value => {

        state.selectedEdition = value;

      }

    );


    const prices =

      game[state.selectedEdition]?.[
        state.selectedPlatform
      ] || {};


    const priceList =
      card.querySelector(".price-list");


    if (!priceList) return;


    let priceHTML = `

      <small class="price-platform">

        ${state.selectedPlatform}

        ${
          state.editions.length > 1
            ? " · " + state.selectedEdition
            : ""
        }

      </small>

    `;


    Object.entries(prices)
      .forEach(([type, price]) => {

        priceHTML += `

          <div class="price-row">

            <span>${type}</span>

            <strong>
              ${formatPrice(price)}
            </strong>

          </div>

        `;

      });


    // Crash Secondary account

    if (id === "crash") {

      priceHTML += `

        <div class="price-row">

          <span>Secondary*</span>

          <strong>
            ${formatPrice(200)}
          </strong>

        </div>

        <small class="price-platform">

          *Confirm console with store.

        </small>

      `;

    }


    if (
      Object.keys(prices).length === 0 &&
      id !== "crash"
    ) {

      priceHTML += `

        <small class="price-platform">

          Contact us for pricing.

        </small>

      `;

    }


    priceList.innerHTML = priceHTML;


    createGameContactButtons(
      card,
      state,
      prices
    );

  }


  /* ========================================
     9. GAME CARD CONTACT BUTTONS
  ======================================== */

  function createGameContactButtons(
    card,
    state,
    prices
  ) {

    const id = card.dataset.id;


    const gameName =

      card.querySelector("h3")?.textContent.trim()

      || id;


    const details =
      card.querySelector(".catalog-details");


    if (!details) return;


    // Remove old contact buttons

    card.querySelector(
      ".game-contact-buttons"
    )?.remove();


    // Create contact container

    const contactButtons =
      document.createElement("div");


    contactButtons.className =
      "game-contact-buttons";


    // Available accounts

    const accountOptions =
      Object.entries(prices);


    if (id === "crash") {

      accountOptions.push(["Secondary*", 200]);

    }


    // Account label

    const accountLabel =
      document.createElement("label");


    accountLabel.className =
      "contact-account-label";


    accountLabel.textContent =
      "Choose account type:";


    // Account dropdown

    const accountSelect =
      document.createElement("select");


    accountSelect.className =
      "contact-account-select";


    accountSelect.setAttribute(

      "aria-label",

      `Choose account type for ${gameName}`

    );


    accountOptions.forEach(([type, price]) => {

      const option =
        document.createElement("option");


      option.value = type;


      option.textContent =
        `${type} - ${formatPrice(price)}`;


      accountSelect.appendChild(option);

    });


    // Restore the previously selected account

    if (
      accountOptions.some(
        ([type]) => type === state.selectedAccount
      )
    ) {

      accountSelect.value = state.selectedAccount;

    } else if (accountOptions.length) {

      accountSelect.value = accountOptions[0][0];

      state.selectedAccount = accountSelect.value;

    }


    if (accountOptions.length) {

      accountLabel.appendChild(accountSelect);

      contactButtons.appendChild(accountLabel);

    }


    /* WHATSAPP BUTTON */

    const whatsappButton =
      document.createElement("a");


    whatsappButton.className =
      "contact-btn whatsapp-btn";


    whatsappButton.dataset.orderLink =
      "whatsapp";


    whatsappButton.target = "_blank";

    whatsappButton.rel = "noopener noreferrer";


    whatsappButton.innerHTML = `

      <i class="fa-brands fa-whatsapp"></i>

      Order via WhatsApp

    `;


    /* CREATE AUTOMATIC ORDER MESSAGE */

    function updateOrderLink() {

      const accountType = accountSelect.value;


      state.selectedAccount = accountType;


      const selectedAccount =
        accountOptions.find(
          ([type]) => type === accountType
        );


      if (!selectedAccount) {

        whatsappButton.href =
          createWhatsAppLink(

            `Hello GameRush! I would like to inquire about ${gameName} for ${state.selectedPlatform}.`

          );

        return;

      }


      const selectedPrice = selectedAccount[1];


      let message =

        `Hello GameRush!\n\n` +

        `I would like to order the following game:\n\n` +

        `Game: ${gameName}\n` +

        `Console: ${state.selectedPlatform}\n` +

        `Edition: ${state.selectedEdition}\n` +

        `Account Type: ${accountType}\n` +

        `Price: ${formatPrice(selectedPrice)}\n\n` +

        `Is this game available?`;


      if (accountType === "Secondary*") {

        message +=
          "\nPlease confirm the compatible console.";

      }


      whatsappButton.href =
        createWhatsAppLink(message);

    }


    accountSelect.addEventListener(
      "change",
      updateOrderLink
    );


    updateOrderLink();


    /* MESSENGER BUTTON */

    const messengerButton =
      document.createElement("a");


    messengerButton.className =
      "contact-btn messenger-btn";


    messengerButton.dataset.orderLink =
      "messenger";


    messengerButton.target = "_blank";

    messengerButton.rel = "noopener noreferrer";


    messengerButton.href =
      createMessengerLink();


    messengerButton.innerHTML = `

      <i class="fa-brands fa-facebook-messenger"></i>

      Message Us

    `;


    // Add buttons to game card

    contactButtons.appendChild(whatsappButton);

    contactButtons.appendChild(messengerButton);

    details.appendChild(contactButtons);

  }


  /* ========================================
     10. SEARCH AND FILTER GAMES
  ======================================== */

  function renderGames() {

    const query = normalizeSearch(

      $("#catalogSearch")?.value || ""

    );


    let visibleCount = 0;


    cards.forEach(card => {

      const name =
        card.querySelector("h3")?.textContent || "";


      const platforms =

        (card.dataset.platforms || "")

          .toLowerCase()

          .trim()

          .split(/\s+/);


      const matchesPlatform =

        activeFilter === "all" ||

        platforms.includes(activeFilter);


      const matchesSearch =

        normalizeSearch(name).includes(query);


      const visible =

        matchesPlatform && matchesSearch;


      card.hidden = !visible;


      if (visible) {

        card.style.animationDelay =

          `${Math.min(visibleCount * 60, 360)}ms`;


        visibleCount++;

      }

    });


    // Update game counter

    const gameCount = $("#gameCount");


    if (gameCount) {

      gameCount.textContent =

        `${visibleCount} ${
          visibleCount === 1
            ? "GAME"
            : "GAMES"
        } FOUND`;

    }


    // Empty results message

    const emptyResults = $("#emptyResults");


    if (emptyResults) {

      emptyResults.hidden =
        visibleCount > 0;

    }

  }


  /* ========================================
     11. PLATFORM FILTERS
  ======================================== */

  function setFilter(filter) {

    activeFilter = filter;


    $$(".filter-btn").forEach(button => {

      const active =
        button.dataset.filter === filter;


      button.classList.toggle(
        "active",
        active
      );


      button.setAttribute(
        "aria-pressed",
        String(active)
      );

    });


    cards.forEach(card => {

      const state = cardStates.get(card);

      if (!state) return;


      if (
        filter !== "all" &&
        state.platforms.includes(
          filter.toUpperCase()
        )
      ) {

        state.selectedPlatform =
          filter.toUpperCase();

      }


      updateCard(card);

    });


    renderGames();

  }


  $$(".filter-btn").forEach(button => {

    button.addEventListener("click", () => {

      setFilter(button.dataset.filter);

    });

  });


  // Category cards and footer links

  $$("[data-category-filter], [data-footer-filter]")

    .forEach(link => {

      link.addEventListener("click", () => {


        const catalogSearch =
          $("#catalogSearch");


        const headerSearch =
          $("#searchInput");


        if (catalogSearch) {

          catalogSearch.value = "";

        }


        if (headerSearch) {

          headerSearch.value = "";

        }


        setFilter(

          link.dataset.categoryFilter ||

          link.dataset.footerFilter ||

          "all"

        );

      });

    });


  /* ========================================
     12. LIVE SEARCH
  ======================================== */

  function syncSearch(event) {

    const value = event.target.value;


    const catalogSearch = $("#catalogSearch");

    const headerSearch = $("#searchInput");


    if (catalogSearch) {

      catalogSearch.value = value;

    }


    if (headerSearch) {

      headerSearch.value = value;

    }


    renderGames();

  }


  $("#catalogSearch")?.addEventListener(

    "input",

    syncSearch

  );


  $("#searchInput")?.addEventListener(

    "input",

    syncSearch

  );


  $("#searchInput")?.addEventListener(

    "keydown",

    event => {

      if (event.key === "Enter") {

        closeSearch();


        $("#games")?.scrollIntoView({

          behavior:
            reducedMotion ? "auto" : "smooth"

        });

      }

    }

  );


  /* ========================================
     13. HEADER SEARCH PANEL
  ======================================== */

  const searchPanel = $("#searchPanel");


  function openSearch() {

    if (!searchPanel) return;


    searchPanel.hidden = false;


    $("#searchToggle")?.setAttribute(

      "aria-expanded",

      "true"

    );


    $("#searchInput")?.focus();

  }


  function closeSearch() {

    if (!searchPanel) return;


    searchPanel.hidden = true;


    $("#searchToggle")?.setAttribute(

      "aria-expanded",

      "false"

    );

  }


  $("#searchToggle")?.addEventListener(

    "click",

    () => {

      if (!searchPanel) return;


      if (searchPanel.hidden) {

        openSearch();

      } else {

        closeSearch();

      }

    }

  );


  $("#closeSearch")?.addEventListener(

    "click",

    closeSearch

  );


  /* ========================================
     14. MOBILE NAVIGATION
  ======================================== */

  const menuToggle = $("#menuToggle");

  const navLinks = $("#navLinks");


  function closeMenu() {

    navLinks?.classList.remove("open");


    menuToggle?.setAttribute(

      "aria-expanded",

      "false"

    );

  }


  menuToggle?.addEventListener("click", () => {

    if (!navLinks) return;


    const open =
      navLinks.classList.toggle("open");


    menuToggle.setAttribute(

      "aria-expanded",

      String(open)

    );

  });


  $$(".nav-link").forEach(link => {

    link.addEventListener("click", () => {

      closeMenu();


      $$(".nav-link").forEach(item => {

        item.classList.remove("active");

      });


      link.classList.add("active");

    });

  });


  /* ========================================
     15. STICKY HEADER
  ======================================== */

  function updateHeader() {

    $("#header")?.classList.toggle(

      "scrolled",

      window.scrollY > 40

    );

  }


  window.addEventListener(

    "scroll",

    updateHeader,

    { passive: true }

  );


  updateHeader();


  /* ========================================
     16. FAQ ACCORDION
  ======================================== */

  const faqItems = $$(".faq-item");


  faqItems.forEach(item => {

    item.addEventListener("toggle", () => {

      if (item.open) {

        faqItems.forEach(otherItem => {

          if (otherItem !== item) {

            otherItem.open = false;

          }

        });

      }

    });

  });


  /* ========================================
     17. SCROLL REVEAL ANIMATIONS
  ======================================== */

  const revealElements = $$(".reveal");


  if (
    "IntersectionObserver" in window &&
    !reducedMotion
  ) {

    revealElements.forEach(element => {

      element.classList.add("reveal-ready");

    });


    const observer = new IntersectionObserver(

      entries => {

        entries.forEach(entry => {

          if (entry.isIntersecting) {

            entry.target.classList.add("visible");

            observer.unobserve(entry.target);

          }

        });

      },

      {

        threshold: 0.08,

        rootMargin: "0px 0px -20px 0px"

      }

    );


    revealElements.forEach(element => {

      observer.observe(element);

    });


  } else {

    revealElements.forEach(element => {

      element.classList.add("visible");

    });

  }


  /* ========================================
     18. KEYBOARD CONTROLS
  ======================================== */

  document.addEventListener("keydown", event => {

    if (event.key === "Escape") {

      if (searchPanel && !searchPanel.hidden) {

        closeSearch();

      }

      closeMenu();

    }


    if (
      hero?.contains(document.activeElement) &&
      !["INPUT", "TEXTAREA", "SELECT"].includes(
        document.activeElement?.tagName
      )
    ) {

      if (event.key === "ArrowRight") {

        event.preventDefault();

        changeSlide(currentSlide + 1);

      }


      if (event.key === "ArrowLeft") {

        event.preventDefault();

        changeSlide(currentSlide - 1);

      }

    }

  });


  /* ========================================
     19. FOOTER YEAR
  ======================================== */

  const currentYear = $("#currentYear");

  if (currentYear) {

    currentYear.textContent =
      new Date().getFullYear();

  }


  /* ========================================
     20. INITIALIZE WEBSITE
  ======================================== */

  setFilter("all");


  console.log(

    "%c GAMERUSH — READY TO PLAY ",

    "background:#dfff38;" +

    "color:#05070d;" +

    "font-size:16px;" +

    "font-weight:bold;" +

    "padding:10px;"

  );


  console.log(

    "GameRush contact integration initialized."

  );

});
