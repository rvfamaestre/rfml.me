import { createRoot } from "https://cdn.jsdelivr.net/npm/react-dom@18.2.0/client/+esm";
import { jsx } from "https://cdn.jsdelivr.net/npm/react@18.2.0/jsx-runtime/+esm";
import GalleryApp from "./GalleryApp.js";
import projects from "./projects.js";

const rootNode = document.getElementById("root");
const root = createRoot(rootNode);

root.render(jsx(GalleryApp, { projects }));
