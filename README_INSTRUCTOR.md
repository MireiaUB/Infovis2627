# Instructor dashboard — setup

This folder contains two comparison dashboards (groups 1–6 and groups 7–11) for each of the 10 tasks.

## 1. Configure the group URLs

Open `group-config.js` and replace the ten placeholder `baseUrl` values.

Example:

```js
{ id: "group1", baseUrl: "https://example.github.io/course-project/" }
```

Keep the final `/` in each URL.

The dashboards assume that every group publishes these files at the root of that base URL:

- `task01.html` and `task01-explanation.html`
- …
- `task10.html` and `task10-explanation.html`

## 2. Open a task dashboard

Use:

- `task01-dashboard-a.html` and `task01-dashboard-b.html`
- …
- `task10-dashboard-a.html` and `task10-dashboard-b.html`

Each dashboard shows the ten groups in a 5 × 2 grid on a typical laptop screen.

For each group you can:

- switch independently between **Visualisation** and **Explanation**;
- select **Open** to open the currently displayed student page in a new tab.

There is deliberately no global switch.

## 3. Publish the instructor folder

The dashboard is fully static: HTML, CSS and JavaScript only. You can publish the `professor` folder using GitHub Pages or any static web server.

## Rendering model

Each student page is loaded in an 800 × 450 iframe. The iframe keeps that virtual viewport size and is visually scaled to fit its card. This avoids triggering narrow-screen responsive layouts merely because the preview is small.

## Accessibility notes for the instructor code

The supplied dashboard uses semantic headings and sections, keyboard-operable controls, visible focus indicators, programmatic button state (`aria-pressed`), descriptive iframe titles and link labels, sufficient default text/background contrast, a skip link, and reduced-motion support. Student-facing instructions do not mention these implementation requirements.

Because the student pages are on separate origins, the dashboard does not inspect or modify their DOM. Their own accessibility and content remain independent of the instructor dashboard.

## Browser/security note

An iframe can only display a student page if that page's server allows framing. Standard GitHub Pages sites normally work for this use case, but test one sample deployment before class.
