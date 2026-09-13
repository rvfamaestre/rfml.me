# A small collection

Personal gallery and journal for [rfml.me](https://rfml.me). Plain HTML, CSS and JavaScript, no build step. The only thing loaded from outside is KaTeX, and only when an entry has a formula.

On a computer, every frame hangs on one single board, sort of like the app grid of an Apple Watch. Drag to move around and use the mouse wheel (or pinch) to zoom, up to a limit. Frames get smaller towards the edges of the screen, and each one floats and tilts a bit on its own rhythm. Hover or keyboard focus opens a small side preview. Focusing a frame with the keyboard also brings it to the centre.

On phones the gallery keeps its pages of four frames. On touch screens, tap once to preview, then again to read. The book icon opens the same collection in date order, and the person icon opens the about page with the CV. The pause button and the reduced motion setting of the system stop the movement.

## Run locally

```sh
python -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. It has to be served over HTTP, opening `index.html` directly does not work. Push to `main` to publish, GitHub Pages does the rest. `CNAME`, `/gh` and `/in` stay as they are.

## Add a project or a life moment

Add an object to `src/projects.js` or `src/posts.js`. Both show up in the same gallery and journal, there are no public categories.

```js
{
  id: 'a-day-worth-keeping',
  date: '2026-09-13',
  title: 'A day worth keeping',
  subtitle: 'Where, or with who',
  tools: ['Python', 'Notion'],
  summary: 'One short sentence for the preview.',
  body: ['A short paragraph.', 'Another one.'],
  image: 'assets/work/a-day.jpg',
  imageNote: 'What the picture shows.',
  formula: 'E = mc^2',
  formulaNote: 'What the formula means.',
  links: [{ label: 'Code on GitHub', url: 'https://github.com/rvfamaestre' }],
  frame: 'oak'
}
```

- `id` is the permanent address (`/#entry/a-day-worth-keeping`) and the seed of the painting.
- `date` can be `YYYY`, `YYYY-MM` or `YYYY-MM-DD`.
- `tools`, `image`, `formula` and `links` are optional. `formula` is LaTeX, rendered with KaTeX.
- Each tool shows its logo from `assets/tools`. The file name is the tool name in lowercase without spaces, so `Google Calendar` is `assets/tools/googlecalendar.svg`.
- `frame` is `oak`, `ink`, `silver` or `paper`.
- `artSeed` changes the painting without changing the address, and `artStyle` picks the technique.

This is a format example, not a real entry. Sport milestones or anything else go exactly the same way.

## Paintings

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

## About page and CV

The about page shows a small preview of `assets/pdfs/CV_EN_RML.pdf`. When the CV changes, make the preview again:

```sh
pdftoppm -jpeg -singlefile -scale-to-x 560 -scale-to-y -1 assets/pdfs/CV_EN_RML.pdf assets/pdfs/cv-preview
```

## Content and references

- Texts come from the CV, the [GitHub](https://github.com/rvfamaestre) repos, and the reports and slides linked in each entry.
- Pictures in `assets/work` come from those same repos and slides: the Game of Life screenshots, the robot, the portfolio chart, the labor share chart and the scheduler diagram.
- Formulas are rendered with [KaTeX](https://katex.org/) (MIT licence), loaded from jsDelivr.
- Visual references: [Dennis Snellenberg](https://dennissnellenberg.com/) for spacing and restrained interaction, and [Bruno Simon](https://bruno-simon.com/) for the portfolio-as-a-place idea. The draggable board takes its idea from the Apple Watch app grid.
- Icons: [Lucide](https://lucide.dev/), ISC licence in `assets/icons/LICENSE`.
- Tool logos: [Simple Icons](https://simpleicons.org/) (CC0), the MATLAB one from [Devicon](https://devicon.dev/) (MIT), and a Lucide sheet icon for Excel. The logos belong to their brands.
