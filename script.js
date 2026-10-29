(() => {
  "use strict";

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-nav");

  function closeNavigation() {
    if (!menuToggle || !navigation) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
    document.body.classList.remove("nav-open");
  }

  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", String(!isOpen));
      menuToggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
      navigation.classList.toggle("is-open", !isOpen);
      document.body.classList.toggle("nav-open", !isOpen);
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNavigation);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNavigation();
    });

    window.addEventListener("resize", () => {
      if (window.matchMedia("(min-width: 681px)").matches) closeNavigation();
    });
  }

  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const menuCards = [...document.querySelectorAll(".menu-card[data-category]")];

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.filter;
      filterButtons.forEach((item) => {
        const active = item === button;
        item.classList.toggle("is-active", active);
        item.setAttribute("aria-pressed", String(active));
      });

      menuCards.forEach((card) => {
        const visible = category === "all" || card.dataset.category === category;
        card.classList.toggle("is-hidden", !visible);
        card.setAttribute("aria-hidden", String(!visible));
      });
    });
  });

  const form = document.querySelector("#feedback-form");
  const formMessage = document.querySelector("#form-message");
  if (form && formMessage) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const idea = form.elements.idea.value.trim();
      if (!idea) {
        form.elements.idea.setCustomValidity("Please add your food idea before sharing.");
        form.reportValidity();
        form.elements.idea.setCustomValidity("");
        return;
      }

      const name = form.elements.name.value.trim();
      const email = form.elements.email.value.trim();
      const summary = [
        "Nova Table — menu idea",
        name ? "Name: " + name : "",
        email ? "Email: " + email : "",
        "Idea: " + idea
      ].filter(Boolean).join("\n");

      formMessage.textContent = "Your idea is ready to copy. Nothing has been sent or stored.";
      const existing = form.querySelector(".copy-idea");
      if (existing) existing.remove();

      const copyButton = document.createElement("button");
      copyButton.type = "button";
      copyButton.className = "button button--cream copy-idea";
      copyButton.textContent = "Copy idea";
      copyButton.addEventListener("click", async () => {
        try {
          await navigator.clipboard.writeText(summary);
          formMessage.textContent = "Copied. You can now paste your idea wherever you choose.";
        } catch (error) {
          const helper = document.createElement("textarea");
          helper.value = summary;
          helper.setAttribute("readonly", "");
          helper.style.position = "absolute";
          helper.style.left = "-9999px";
          document.body.appendChild(helper);
          helper.select();
          const copied = document.execCommand("copy");
          helper.remove();
          formMessage.textContent = copied
            ? "Copied. You can now paste your idea wherever you choose."
            : "Copy was blocked by your browser. You can select and copy your text manually.";
        }
      });
      form.querySelector(".button--cream").insertAdjacentElement("afterend", copyButton);
    });
  }

  const year = document.querySelector("#current-year");
  if (year) year.textContent = String(new Date().getFullYear());

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    document.documentElement.classList.add("reduce-motion");
  }
})();