/**
 * Update this array to add, remove, or edit projects in the gallery.
 * Each project should include:
 *  - title: short name displayed under the frame
 *  - date: year or descriptor shown in the label
 *  - category: optional tag shown in the project overlay
 *  - image: full URL to an image (served over HTTPS and CORS-friendly)
 *
 * The gallery layout and orbit dynamics automatically adapt to the number
 * of projects supplied, so you only need to maintain this list.
 */
export default [
  {
    title: "Parametric Skyline",
    date: "Mar 2024 | 6 wks",
    category: "3D Design",
    variant: "visual",
    image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=90",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1400&q=85",
        caption: "Daylight study over the northern atrium"
      },
      {
        src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1400&q=85",
        caption: "Algorithmic massing iterations"
      }
    ],
    description: [
      "A parametric tower system exploring orbital setbacks and civic terraces suspended above Madrid. The scheme balances structural rhythm with a hushed glass envelope tuned to the city’s diffuse light.",
      "The final composition was iterated live with stakeholders, allowing the skyline to emerge as a conversational act rather than a frozen render."
    ],
    technologies: ["Rhino", "Grasshopper", "Unreal Engine", "Enscape"],
    highlights: [
      "Generated 280+ volumetric options in real time during client workshops.",
      "Reduced facade material takeoff by 14% through adaptive panel aggregation."
    ],
    links: [
      { label: "Process Journal", url: "https://example.com/parametric-skyline" },
      { label: "Interactive Prototype", url: "https://example.com/skyline-live" }
    ]
  },
  {
    title: "Circuit Ballet",
    date: "Nov 2023 | 5 wks",
    category: "Electronics",
    variant: "technical",
    image: "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1400&q=90",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=90",
        caption: "Realtime visualization of control curves"
      },
      {
        src: "https://images.unsplash.com/photo-1526481280695-3c4693fc3241?auto=format&fit=crop&w=1400&q=90",
        caption: "Stage rig wiring diagram"
      }
    ],
    description: [
      "An immersive performance where modular synths drive a fleet of kinetic light fixtures. Each sequence is routed through a custom PCB that translates MIDI dynamics into voltage whispers across the stage.",
      "The piece champions precision and restraint—motion emerges only when the score invites it."
    ],
    technologies: ["Max/MSP", "Custom PCB", "Teensy 4.1", "DMX512"],
    highlights: [
      "Latency trimmed to 11 ms end-to-end across audio, control, and luminaire response.",
      "Hot-swappable driver cards allow full rig reconfiguration between acts."
    ],
    links: [
      { label: "Performance Cut", url: "https://example.com/circuit-ballet" }
    ]
  },
  {
    title: "Volatility Atlas",
    date: "Jul 2022 | 7 wks",
    category: "Quant Finance",
    variant: "technical",
    image: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1400&q=90",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1556740749-887f6717d7e4?auto=format&fit=crop&w=1200&q=70&sat=-40",
        caption: "Option surface topography rendered as light"
      },
      {
        src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80",
        caption: "Stress scenario weave for Federal index clients"
      }
    ],
    description: [
      "A living cartography of implied volatility surfaces across 38 global indices. The atlas renders risk as spatial gradients, letting investment committees intuit how liquidity shifts ripple through time.",
      "Every panel is tuned for quiet cognition: no heat maps, no alarm bells—just calm, legible change."
    ],
    technologies: ["Python", "Dask", "Plotly", "AWS Lambda"],
    highlights: [
      "Cut daily surface generation time from 46 minutes to 6 minutes via vectorized calibration.",
      "Embedded explainability layer documents signal provenance for audit trails."
    ],
    links: [
      { label: "Whitepaper", url: "https://example.com/volatility-atlas" },
      { label: "Data Schema", url: "https://example.com/atlas-schema" }
    ]
  },
  {
    title: "Tactile Compiler",
    date: "May 2024 | 8 wks",
    category: "Software",
    variant: "technical",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1400&q=88",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1527430253228-e93688616381?auto=format&fit=crop&w=1200&q=85",
        caption: "Haptic feedback horizons mapped across code blocks"
      },
      {
        src: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=85",
        caption: "Interactive syntax annotations for studio critiques"
      }
    ],
    description: [
      "An experimental compiler that renders code structure as physical feedback, translating parser states into subtle vibrations across a slate-like device.",
      "Designed for blind and low-vision engineers, the interface surfaces scope, errors, and control flow without reliance on a visual tree."
    ],
    technologies: ["Rust", "WebAssembly", "LibUSB", "SwiftUI"],
    highlights: [
      "Achieved 98% parity with clang on LLVM IR output for supported constructs.",
      "Haptic library exposes a 240Hz modulation channel for expressive cues."
    ],
    links: [
      { label: "Source", url: "https://example.com/tactile-compiler" },
      { label: "Accessibility Notes", url: "https://example.com/tactile-a11y" }
    ]
  },
  {
    title: "Adaptive Control Field",
    date: "Feb 2023 | 6 wks",
    category: "Control Systems",
    variant: "technical",
    image: "https://images.unsplash.com/photo-1482192597420-4817fdd7e8b0?auto=format&fit=crop&w=1400&q=88",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1500535708195-a5fc1a0fb4c4?auto=format&fit=crop&w=1200&q=80",
        caption: "Mid-air drone choreography under adaptive PID tuning"
      },
      {
        src: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=82",
        caption: "Supervisory console with confidence bands"
      }
    ],
    description: [
      "A responsive control environment for coordinating autonomous drones during disaster assessment. The field engine learns from pilot overrides to retune PID gains in-flight.",
      "The experience stays quiet—operators see only gentle confidence envelopes and receive a subtle nudge when a manual intervention improves stability."
    ],
    technologies: ["ROS2", "C++20", "PX4", "TensorFlow Lite"],
    highlights: [
      "Reduced oscillation amplitude by 37% in gusty conditions during field trials.",
      "Two-way telemetry compression lowers spectrum usage by 28% compared to baseline."
    ],
    links: [
      { label: "Flight Log", url: "https://example.com/adaptive-control-field" }
    ]
  },
  {
    title: "Automaton Chorus",
    date: "Jan 2024 | 4 wks",
    category: "Automation",
    variant: "concept",
    image: "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=88",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=85",
        caption: "Lighting halos responding to choral harmonics"
      },
      {
        src: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=85",
        caption: "Mechanical throat prototype with acoustic sensors"
      }
    ],
    description: [
      "A speculative installation where robotic throats echo human singers in real time. Each sculpted larynx listens, interprets, and returns a shimmer of harmonics—never identical, always empathetic.",
      "The room behaves like a sanctuary: dim, hushed, and attuned to the micro-behaviors of breath."
    ],
    technologies: ["TouchDesigner", "Ableton Live", "Embedded DSP"],
    highlights: [
      "Calibrated feedback paths to keep mechanical resonance below 2% THD.",
      "Light field responds within 40 ms to blend human and machine vibrato."
    ],
    links: [
      { label: "Installation Film", url: "https://example.com/automaton-chorus" }
    ]
  },
  { title: "Nonlinear Poem", date: "Sep 2022 | 5 wks", category: "Mathematics", image: "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?auto=format&fit=crop&w=1200&q=80" },
  { title: "Monochrome Atelier", date: "Jun 2021 | 8 wks", category: "Fashion", image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80" },
  { title: "Silver Halide Study", date: "Oct 2020 | 6 wks", category: "Photography", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80" },
  { title: "Quiet Relief", date: "Dec 2022 | 3 wks", category: "Charity", image: "https://images.unsplash.com/photo-1495159659121-2e3f43d3ee1b?auto=format&fit=crop&w=1200&q=80" },
  { title: "Playfield 2049", date: "Aug 2024 | 7 wks", category: "Videogames", image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80" },
  { title: "Flux Vignette", date: "Apr 2023 | 4 wks", category: "Experimental", image: "https://images.unsplash.com/photo-1533587851505-d119e13fa0d9?auto=format&fit=crop&w=1200&q=80" },
  { title: "Quantum Loom", date: "Jan 2025 | 10 wks", category: "AI Research", image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80" },
  { title: "Luminous Archive", date: "Feb 2024 | 6 wks", category: "Digital Heritage", image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80" },
  { title: "Kinetic Façade", date: "Jun 2024 | 9 wks", category: "Architecture", image: "https://images.unsplash.com/photo-1535920527002-b35e96722eb9?auto=format&fit=crop&w=1200&q=80" },
  { title: "Harmonic Plasma", date: "Aug 2023 | 5 wks", category: "Plasma Systems", image: "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=1200&q=80" },
  { title: "Nebula Loom", date: "Mar 2025 | 8 wks", category: "Generative Art", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80" },
  { title: "Cerulean Circuit", date: "May 2023 | 6 wks", category: "Wearables", image: "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80" },
  { title: "Fractal Choir", date: "Apr 2024 | 5 wks", category: "Audio Synthesis", image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80" },
  { title: "Carbon Lattice Lab", date: "Jul 2023 | 7 wks", category: "Material Science", image: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=1200&q=80" },
  { title: "Euclid Drift", date: "Sep 2024 | 6 wks", category: "Robotics", image: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?auto=format&fit=crop&w=1200&q=80" },
  { title: "Velvet Tensor", date: "May 2025 | 9 wks", category: "Deep Learning", image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80" },
  { title: "Prism Caravan", date: "Oct 2023 | 5 wks", category: "Immersive Media", image: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1200&q=80" },
  { title: "Polar Graphite", date: "Mar 2022 | 6 wks", category: "Art Installation", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1200&q=80" },
  { title: "Aero Tapestry", date: "Nov 2024 | 8 wks", category: "Aerospace", image: "https://images.unsplash.com/photo-1514381676171-86c99fdd0d19?auto=format&fit=crop&w=1200&q=80" },
  { title: "Verdant Mesh", date: "Jan 2023 | 7 wks", category: "Sustainability", image: "https://images.unsplash.com/photo-1529312266912-b2e0f2030bba?auto=format&fit=crop&w=1200&q=80" },
  { title: "Sepia Signal", date: "Apr 2021 | 4 wks", category: "Analog Revival", image: "https://images.unsplash.com/photo-1517142089942-ba376ce32a0b?auto=format&fit=crop&w=1200&q=80" },
  { title: "Stochastic Bloom", date: "Jul 2024 | 6 wks", category: "Bioinformatics", image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80" },
  { title: "Meridian Array", date: "Feb 2025 | 8 wks", category: "Satellite Systems", image: "https://images.unsplash.com/photo-1470240731273-7821a6eeb6bd?auto=format&fit=crop&w=1200&q=80" },
  { title: "Chromatic Prism", date: "Dec 2023 | 6 wks", category: "Lighting Design", image: "https://images.unsplash.com/photo-1500535708195-a5fc1a0fb4c4?auto=format&fit=crop&w=1200&q=80" },
  { title: "Basilisk Relay", date: "May 2022 | 5 wks", category: "Security", image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80" },
  { title: "Reverie Loom", date: "Oct 2024 | 4 wks", category: "Storytelling", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=1200&q=80" },
  { title: "Cascade Indigo", date: "Jun 2023 | 5 wks", category: "Water Systems", image: "https://images.unsplash.com/photo-1526481280695-3c4693fc3241?auto=format&fit=crop&w=1200&q=80" },
  { title: "Ripple Field", date: "Apr 2025 | 7 wks", category: "IoT", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=1200&q=80" },
  { title: "Lunar Relay", date: "Feb 2024 | 5 wks", category: "Space Comms", image: "https://images.unsplash.com/photo-1473929151137-1c7e7efc61b2?auto=format&fit=crop&w=1200&q=80" },
  { title: "Echo Silk", date: "Aug 2022 | 3 wks", category: "Textiles", image: "https://images.unsplash.com/photo-1521572267360-ee0c2909ff34?auto=format&fit=crop&w=1200&q=80" },
  { title: "Glacial Vector", date: "Jun 2025 | 9 wks", category: "Climate Analytics", image: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=1200&q=80" },
  { title: "Orchid Dynamo", date: "Mar 2023 | 6 wks", category: "Energy Systems", image: "https://images.unsplash.com/photo-1516117172878-fd2c41f4a759?auto=format&fit=crop&w=1200&q=80" }
];
