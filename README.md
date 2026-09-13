# A small collection

Personal gallery and journal for [rfml.me](https://rfml.me). Plain HTML, CSS and JavaScript, without a build step or runtime dependencies.

On a computer, every frame hangs on one single board, sort of like the app grid of an Apple Watch. Drag to move around and use the mouse wheel (or pinch) to zoom, up to a limit. Frames get smaller towards the edges of the screen, and each one floats and tilts a bit on its own rhythm. Hover or keyboard focus opens a small side preview. Focusing a frame with the keyboard also brings it to the centre.

On phones the gallery keeps its pages of four frames. On touch screens, tap once to preview, then again to read. The book icon opens the same collection in date order.

## Run locally

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. Serve over HTTP, rather than opening `index.html` directly. Publish the folder through the existing GitHub Pages setup when ready. `CNAME`, `/gh` and `/in` are preserved.

## Add a note, project or milestone

Add an object to `src/posts.js` for a life update, or `src/projects.js` for existing project content. Both files appear in the same gallery and journal. There are no public categories.

```js
{
  id: 'a-day-worth-keeping', // Unique, permanent URL and painting seed.
  date: '2026-09-13',       // YYYY, YYYY-MM or YYYY-MM-DD.
  title: 'A day worth keeping',
  summary: 'One short sentence for the preview.',
  body: ['A paragraph.', 'Another paragraph.'],
  frame: 'oak',            // oak, ink, silver or paper.
  links: []
}
```

This is a format example, not a published life event. Add real sporting milestones exactly the same way. `body` accepts plain-text paragraphs. Optional `image` and `imageNote` add a photograph inside the entry; the cover stays abstract. Optional `artSeed` changes the painting without changing its URL.

Every entry gets a procedural cover from `src/paintings.js`. The same seed gives the same painting, including after refresh or when adding more entries. No AI images, no external image service and no manual artwork step. There are seven techniques:

- `mineral`: warped noise, like agate or marble
- `watercolor`: translucent washes that bleed and dry unevenly
- `field`: soft stacked colour fields
- `geometry`: printed tiles of circles, arcs and stripes
- `sculpture`: soft clay forms lit from a height map
- `relief`: stacked paper layers with cast shadows
- `cellular`: bevelled glass tiles

Optional `artStyle` picks one of them. Omit it and the seed picks one. The current entries set it by hand so that two neighbouring frames never share a technique. Paintings are drawn one after the other once the page loads, so the gallery keeps responding while they appear.

`featured` in `src/main.js` decides the centre of the board and the six frames around it. The remaining entries fill the next rings. Frame shapes, the lens and the zoom limits are right below it. Phone wall positions are in `styles/main.css`.

Entries have shareable addresses such as `/#entry/traffic`. `/#journal` opens the chronological view. The pause button and the system's reduced-motion preference stop frame movement. The reader uses a native dialog with keyboard focus containment and Escape to close.

## Content and references

- [GitHub](https://github.com/rvfamaestre): project descriptions checked against public repository READMEs. Existing local project text was retained and shortened.
- [LinkedIn](https://es.linkedin.com/in/rafael-maestre-lopez/es): public indexed profile information. Direct access required sign-in. No private profile content was accessed.
- Visual references: [Dennis Snellenberg](https://dennissnellenberg.com/) for spacing and restrained interaction, and [Bruno Simon](https://bruno-simon.com/) for the portfolio-as-a-place idea. The draggable board takes its idea from the Apple Watch app grid.
- The two life entries use publicly documented education and volunteering. No sporting achievements or personal reflections have been invented.
- `assets/robot.jpg` is an original track image from [cvt-vac](https://github.com/rvfamaestre/cvt-vac), shown inside that project's entry.
- Icons: [Lucide](https://lucide.dev/), ISC licence in `assets/icons/LICENSE`.

This redesign is a local working version. Publishing requires the normal repository deployment. A copy of the pre-existing local changes was saved outside the repository before the rewrite.
