# rfml.me immersive gallery

An ultra-minimal portfolio that renders a floating 3D gallery using React 18 and Three.js directly in the browser (no build pipeline required).

## Project layout

```
.
├── index.html           # Lightweight entry point that wires styles + modules
├── styles/
│   └── main.css         # Global typography, overlay, and status styling
└── src/
    ├── main.js          # Boots the React app and injects it into the page
    ├── GalleryApp.js    # React component + Three.js scene logic
    ├── projects.js      # Source of truth for every artwork/frame
    └── utils/
        └── easings.js   # Reusable easing helpers for liquid transitions
```

All code is served as native ES modules. You can open `index.html` directly in a modern browser or host the folder on any static web server (GitHub Pages, Netlify, etc.).

## Editing or adding projects

1. Open `src/projects.js`.
2. Each entry in the exported array becomes a frame in the gallery:

   ```js
   {
     title: "Parametric Skyline",
     date: "May 2025 | 9 wks",
     category: "3D Design",     // optional tag shown in the overlay
     image: "https://…",        // HTTPS image URL with CORS enabled
     gallery: [{ src: "https://…", caption: "Optional detail view" }],
     description: [
       "Short, museum-quality copy (2–4 sentences).",
       "You can supply multiple strings; each becomes a paragraph."
     ],
     technologies: ["Rhino", "Grasshopper", "Unreal Engine"],
     highlights: ["Key challenge solved", "Notable metric or outcome"],
     links: [{ label: "Process Journal", url: "https://…" }],
     variant: "visual"          // optional: visual | technical | concept
   }
   ```

3. Add, remove, or reorder items as needed. The circular layout, floating orbits, lazy loading, and navigation automatically adapt to whatever you supply.

**Tips**
- Prefer high-resolution images served over HTTPS (Unsplash, your CDN, etc.).
- Keep titles concise; anything too wide will be wrapped inside the frame label.
- Supplying optional fields (`gallery`, `description`, `technologies`, `highlights`, `links`) automatically enriches the private viewing room and lightbox experience.
- The gallery is deterministic – no random collisions – so you don’t need to tweak positioning when the list grows.

## Customising the look

- Adjust colours, typography, and overlay styling in `styles/main.css`.
- Update light / motion behaviour inside `src/GalleryApp.js` (search for `const ambientLight` or the orbit configuration block around the top of the file).

## Developing locally

Because everything is pure static assets, you can:

1. Open `index.html` directly in Chrome/Edge/Safari (recommended) **or**
2. Serve the folder with any static file server, e.g.

   ```bash
   npx serve .
   ```

Changes to the JavaScript modules or CSS are picked up on refresh—no bundler, transpiler, or build step required.

## Deployment

Push the repository to any static host (GitHub Pages, Cloudflare Pages, Netlify, Vercel static, S3 + CloudFront…). The `CNAME` file is already configured for `rfml.me`.

## Browser support

The site targets evergreen browsers that support:

- ES module imports
- WebGL / Three.js
- Smooth wheel or trackpad scrolling

Navigation is intentionally simple—hover to highlight, scroll to zoom, click to enter—so no pointer-lock or keyboard controls are required.
