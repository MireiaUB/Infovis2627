(() => {
  "use strict";

  const VIEWPORT_WIDTH = 800;
  const VIEWPORT_HEIGHT = 450;

  function normaliseBaseUrl(url) {
    return url.endsWith("/") ? url : `${url}/`;
  }

  function pageUrl(baseUrl, taskNumber, view) {
    const suffix = view === "explanation" ? "-explanation" : "";
    return `${normaliseBaseUrl(baseUrl)}task${taskNumber}${suffix}.html`;
  }

  function createButton(label, view, pressed) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.dataset.view = view;
    button.setAttribute("aria-pressed", pressed ? "true" : "false");
    return button;
  }

  function updateScale(shell, stage) {
    const widthScale = shell.clientWidth / VIEWPORT_WIDTH;
    const heightScale = shell.clientHeight / VIEWPORT_HEIGHT;
    const scale = Math.min(widthScale, heightScale);
    stage.style.transform = `scale(${Math.max(scale, 0.01)})`;
  }

  function buildGroupCard(group, taskNumber) {
    const card = document.createElement("section");
    card.className = "group-card";
    card.setAttribute("aria-labelledby", `title-${group.id}`);

    const header = document.createElement("div");
    header.className = "group-card-header";

    const title = document.createElement("h2");
    title.className = "group-title";
    title.id = `title-${group.id}`;
    title.textContent = group.id;

    const switcher = document.createElement("div");
    switcher.className = "view-switch";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", `View for ${group.id}`);

    const visualisationButton = createButton("Visualisation", "visualisation", true);
    const explanationButton = createButton("Explanation", "explanation", false);
    switcher.append(visualisationButton, explanationButton);

    const openLink = document.createElement("a");
    openLink.className = "open-original";
    openLink.target = "_blank";
    openLink.rel = "noopener noreferrer";
    openLink.textContent = "Open";
    openLink.setAttribute("aria-label", `Open ${group.id} visualisation in a new tab`);

    header.append(title, switcher, openLink);

    const shell = document.createElement("div");
    shell.className = "preview-shell";

    const stage = document.createElement("div");
    stage.className = "preview-stage";

    const iframe = document.createElement("iframe");
    iframe.loading = "eager";
    iframe.title = `${group.id}, Task ${Number(taskNumber)}, visualisation`;
    stage.append(iframe);
    shell.append(stage);

    card.append(header, shell);

    function setView(view) {
      const isExplanation = view === "explanation";
      visualisationButton.setAttribute("aria-pressed", String(!isExplanation));
      explanationButton.setAttribute("aria-pressed", String(isExplanation));

      const url = pageUrl(group.baseUrl, taskNumber, view);
      iframe.src = url;
      iframe.title = `${group.id}, Task ${Number(taskNumber)}, ${isExplanation ? "explanation" : "visualisation"}`;
      openLink.href = url;
      openLink.setAttribute(
        "aria-label",
        `Open ${group.id} ${isExplanation ? "explanation" : "visualisation"} in a new tab`
      );
    }

    visualisationButton.addEventListener("click", () => setView("visualisation"));
    explanationButton.addEventListener("click", () => setView("explanation"));

    const resizeObserver = new ResizeObserver(() => updateScale(shell, stage));
    resizeObserver.observe(shell);

    setView("visualisation");
    requestAnimationFrame(() => updateScale(shell, stage));

    return card;
  }

  function initialise() {
    const grid = document.querySelector("#group-grid");
    const taskNumber = document.body.dataset.task;
    const allGroups = Array.isArray(window.GROUPS) ? window.GROUPS : [];
    const range = /^(\d+)-(\d+)$/.exec(document.body.dataset.groups || "");
    const groups = range ? allGroups.slice(Number(range[1]) - 1, Number(range[2])) : allGroups;

    if (!grid || !taskNumber) return;

    if (groups.length === 0) {
      const message = document.createElement("p");
      message.className = "status-message";
      message.textContent = "Configuration error: at least one group is required.";
      grid.replaceWith(message);
      return;
    }

    const cols = Math.min(5, Math.ceil(groups.length / 2));
    grid.style.setProperty("--cols", cols);
    grid.style.setProperty("--rows", Math.ceil(groups.length / cols));
    groups.forEach((group) => grid.append(buildGroupCard(group, taskNumber)));
  }

  document.addEventListener("DOMContentLoaded", initialise);
})();
