# IITG ODP Coding Club Website

Welcome to the official repository for the IITG ODP Coding Club website. This project is a modern, responsive, and accessible site for the IITG Online Degree Coding Club, built with HTML, CSS, and JavaScript.

---

## 🚀 Project Overview
- **Purpose:** Showcase club activities, events, resources, and team members for the IITG ODP Coding Club.
- **Features:**
  - Modern dark-themed design
  - Fully responsive and mobile-first
  - Modular, maintainable codebase
  - Accessibility and SEO best practices

---

## 🛠️ Tech Stack
- **HTML5** (semantic, modular pages)
- **CSS3** (modular, per section/page, CSS variables for theming)
- **JavaScript** (vanilla, modular per section/page)
- **Font Awesome** (for icons)

---

## 📁 Folder Structure
```
codingclub/
├── assets/           # Images, logos, and profile photos
├── css/              # CSS files (one per section/page)
├── js/               # JavaScript files (one per section/page)
├── events/           # Events page and related files
├── resources/        # Resources page and related files
├── team/             # Team page and related files
├── index.html        # Homepage
├── README.md         # This file
└── ...
```

---

## 🧑‍💻 How to Update Content

### Events
- **File:** `events/index.html`
- **Add/Remove Events:** Edit the event cards inside the `.cards-grid` section. Each event is a `<div class="card">...</div>`.
- **Event Images:** Place any event images in `assets/` and reference them with the correct path.

### Resources
- **File:** `resources/index.html`
- **Add/Remove Resources:** Edit the resource cards inside the `.cards-grid` section.

### General Instructions
- **Navigation:** Update navigation links in the `<nav>` section of each HTML file if you add new pages.
- **Assets:** Place all images, logos, and profile photos in the `assets/` folder. Use descriptive, lowercase filenames.
- **CSS/JS:** For new sections, create a new CSS/JS file in the respective folder and link it in your HTML.
- **External CSS Only:** Always use external CSS files for all styles. **Do not use inline `style` attributes or `<style>` blocks in HTML.** This is required for Content Security Policy (CSP) compliance, improved security, and consistent cross-browser behavior. Define all custom styles in the appropriate CSS file and use class or ID selectors in your HTML.

---

## ♿ Accessibility & SEO
- ARIA labels and skip links for navigation
- High color contrast and keyboard accessibility
- Meta description, Open Graph, and Twitter Card tags on all pages
- Semantic HTML5 tags throughout

---

## ⚡ Performance
- Responsive and mobile-first design
- CSS variables for easy theming
- Scroll-to-top button and smooth scroll
- Lazy loading for images (add `loading="lazy"` to `<img>` tags as needed)

---

## 🧩 Contribution Guidelines
- Keep code modular and well-commented
- Use consistent naming conventions
- Test changes on mobile, tablet, and desktop
- Follow accessibility and SEO best practices
- Remove unused code and assets

---

## 🙏 Credits
- IITG ODP Coding Club core team and contributors
- [Font Awesome](https://fontawesome.com/) for icons
- All images and content © IITG ODP Coding Club


---

## 📢 Need Help?
For questions or contributions, open an issue or contact the Coding Club team.
