// Add entries here. Every id gets its own procedural painting.
export default [
  {
    "id": "traffic",
    "date": "2026-02",
    "title": "Learning to flow",
    "subtitle": "Mixed-Autonomy Traffic RL",
    "summary": "Teaching connected vehicles to smooth traffic, using reinforcement learning and classical control.",
    "body": [
      "This ongoing project asks a focused control question: when only part of the fleet is autonomous, can a learned controller improve global traffic behavior without abandoning the interpretability of cooperative cruise control? I kept the work anchored to an inherited baseline rather than rebuilding the entire stack from zero.",
      "The main design choice is a residual policy. Instead of relearning low-level longitudinal behavior, the reinforcement-learning layer sits on top of the classical controller and learns small corrective actions that can smooth stop-and-go waves and improve throughput in ring-road scenarios."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "ink",
    "artStyle": "mineral"
  },
  {
    "id": "lattice",
    "date": "2026-04",
    "title": "Forms of possibility",
    "subtitle": "Additive Manufacturing",
    "summary": "Three studies in additive manufacturing, from induction heating to structural optimisation and TPMS lattices.",
    "body": [
      "Rather than a single artifact, this project is a portfolio of three engineering deliverables completed during the additive-manufacturing sequence at CentraleSupelec. Each piece emphasized a different design layer: multiphysics heating, structural efficiency, and research-oriented lattice geometry.",
      "The induction-heating study used COMSOL to reason about coupled electromagnetic and thermal behavior. The optimization challenge shifted the work toward load paths, weight reduction, and manufacturability tradeoffs under geometric constraints."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "oak",
    "artStyle": "sculpture"
  },
  {
    "id": "scheduler",
    "date": "2026-04",
    "title": "A little more time",
    "subtitle": "Notion Scheduler",
    "summary": "A Python tool that turns Notion tasks and calendar constraints into a workable day.",
    "body": [
      "This project started from a practical operations need: take a backlog living in Notion, combine it with real scheduling constraints, then produce a plan that is structured enough to act on immediately. The result is a Python tool that uses Notion as the source of truth instead of requiring a parallel planning workflow.",
      "The interesting problem was not simple ranking. The scheduler had to interpret task priority, fit work around calendar constraints, and optionally synchronize the resulting schedule outward to Google Calendar without turning the system into a brittle integration maze."
    ],
    "links": [
      {
        "label": "Project repository",
        "url": "https://github.com/rvfamaestre/notion-scheduler"
      },
      {
        "label": "Architecture diagram",
        "url": "https://raw.githubusercontent.com/rvfamaestre/notion-scheduler/main/docs/automation-diagram.svg"
      }
    ],
    "frame": "paper",
    "artStyle": "geometry"
  },
  {
    "id": "azores",
    "date": "2024",
    "title": "Road to Success",
    "subtitle": "Road To Success",
    "summary": "An entrepreneurship bootcamp in the Azores, bringing ideas and people together.",
    "body": [
      "Road To Success Azores sits slightly outside the rest of the technical portfolio, but it matters because it broadened the way I think about problem framing, communication, and initiative. The bootcamp was less about a single deliverable and more about entrepreneurial exposure in an international setting.",
      "That kind of experience is useful because it forces rapid synthesis: clarify an idea, communicate it to others, and improve it through discussion rather than through extended solitary iteration."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "paper",
    "artStyle": "mineral"
  },
  {
    "id": "mit",
    "date": "2026-05",
    "title": "The mathematics of uncertainty",
    "subtitle": "MITx 15.455x",
    "summary": "Probability, stochastic processes and optimisation, applied to quantitative finance.",
    "body": [
      "This course mattered less as a credential than as a compact toolkit. It pulled together the mathematical language needed to reason about uncertainty, dynamic processes, and financial decision making instead of presenting those topics as isolated chapters.",
      "The strongest part of the sequence is how it connects modeling and computation. Probability and stochastic processes motivate the structure, Monte Carlo simulation turns theory into numerical experimentation, and optimization closes the loop by making the decision problem explicit."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "silver",
    "artStyle": "watercolor"
  },
  {
    "id": "life",
    "date": "2024-11",
    "title": "Enigma of Life",
    "subtitle": "Enigma of Life",
    "summary": "A puzzle game where the first move sets a whole world in motion.",
    "body": [
      "Enigma of Life turns Conway's Game of Life into a puzzle-design problem. Instead of watching a simulation passively, the player is asked to engineer the initial pattern so the system evolves toward a target condition.",
      "That makes the game more about reasoning than reflex. The interesting design space comes from balancing the determinism of the rules with level structures that still feel surprising."
    ],
    "links": [
      {
        "label": "Project repository",
        "url": "https://github.com/rvfamaestre/cws-jdv"
      },
      {
        "label": "Report PDF",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cws-jdv/main/report.pdf"
      },
      {
        "label": "Presentation PDF",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cws-jdv/main/soutenance.pdf"
      }
    ],
    "frame": "ink",
    "artStyle": "cellular"
  },
  {
    "id": "robot",
    "date": "2025-11",
    "title": "Finding a way",
    "subtitle": "ST5 VAC-EI Robot",
    "summary": "A line-following robot that sees intersections, plans routes and responds to obstacles.",
    "body": [
      "This project started as a lab robot and became an end-to-end autonomy exercise: detect the line, interpret intersections, plan over a graph, and execute motor commands reliably enough to handle a real course instead of a scripted demo.",
      "I focused on the autonomy side of the stack. In the Python layer, the robot isolates the lower region of the camera frame, extracts a clean track contour, smooths the centroid, and converts lateral error into steering corrections. When the robot reaches an intersection, the planner switches from continuous control to graph navigation and chooses the next turn from a Breadth-First Search path."
    ],
    "links": [
      {
        "label": "Project repository",
        "url": "https://github.com/rvfamaestre/cvt-vac"
      },
      {
        "label": "Final presentation PDF",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cvt-vac/main/Soutenance%20Finale%20EI%20VAC.pdf"
      },
      {
        "label": "Track reference image",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cvt-vac/main/huit_obstacle.jpg"
      }
    ],
    "frame": "oak",
    "image": "assets/robot.jpg",
    "imageNote": "Track image from the project repository.",
    "artStyle": "relief"
  },
  {
    "id": "portfolio",
    "date": "2025-06",
    "title": "Risk & balance",
    "subtitle": "Crypto Portfolio Optimization",
    "summary": "Building and testing a portfolio of 20 crypto assets under realistic constraints.",
    "body": [
      "This project treats crypto portfolio construction as a disciplined backtesting problem rather than a loose optimization exercise. The framework evaluates dynamic allocation rules on a rolling basis so performance is tied to decisions that would have been feasible at the time.",
      "Mean-variance optimization is the central allocation engine, but the useful part is how it is constrained. Risk limits, benchmark comparisons, and transaction costs keep the framework from drifting into a frictionless-paper-result mindset."
    ],
    "links": [
      {
        "label": "Project repository",
        "url": "https://github.com/rvfamaestre/mds-pfm"
      },
      {
        "label": "Presentation PDF",
        "url": "https://raw.githubusercontent.com/rvfamaestre/mds-pfm/main/soutenance.pdf"
      }
    ],
    "frame": "silver",
    "artStyle": "field"
  },
  {
    "id": "reinforcement",
    "date": "2026-03",
    "title": "Learning by doing",
    "subtitle": "Stanford CS234",
    "summary": "Exploring how agents learn to make decisions through interaction.",
    "body": [
      "CS234 was useful because it organizes reinforcement learning as a coherent design language instead of a list of algorithms. The course moves from formal problem setup to value methods, policy methods, exploration, and generalization with a clear sense of why each layer exists.",
      "That structure helped bridge theoretical intuition and practical systems work. It also sharpened how I think about modern RL settings where function approximation and preference-style signals matter as much as the classical tabular story."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "paper",
    "artStyle": "sculpture"
  },
  {
    "id": "regions",
    "date": "2026-02",
    "title": "Why places grow differently",
    "subtitle": "Regional Development Gaps",
    "summary": "A literature review on institutions, infrastructure and the places they shape.",
    "body": [
      "This literature review focuses on a difficult economic-geography question: why do regional development gaps remain so persistent even after the historical conditions that created them have shifted? The review organizes the answer around three mechanisms rather than presenting an undifferentiated reading list.",
      "Extractive institutions explain persistence through political and institutional lock-in. Transport infrastructure emphasizes durable spatial advantage. Urban path dependence highlights the self-reinforcing logic of agglomeration once a city or region has established momentum."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "oak",
    "artStyle": "relief"
  },
  {
    "id": "databox",
    "date": "2026-01",
    "title": "Factory DataBox",
    "subtitle": "Factory DataBox",
    "summary": "Bringing supply-chain training and exercises to the web.",
    "body": [
      "Factory DataBox is a supply-chain training platform, but the work here was closer to product infrastructure than simple content editing. The goal was to redesign how training material, exercises, and navigation work once the learning experience moves to the web.",
      "That meant reformatting course content for browser reading, improving the structure of exercises, and supporting multilingual expansion so the platform could grow beyond a narrow audience. Traffic and SEO were not side concerns; they were part of the project definition."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "ink",
    "artStyle": "geometry"
  },
  {
    "id": "labor",
    "date": "2026-01",
    "title": "The changing share of labour",
    "subtitle": "Labor Share Study",
    "summary": "A reproducible study of how the labour share of national income changes.",
    "body": [
      "This project studies a narrow empirical question with a deliberately compact pipeline: how do investment-good prices relate to labor-share dynamics across countries? The design goal was to build something minimal, readable, and reproducible rather than a large exploratory notebook with diffuse scope.",
      "The workflow covers data preparation, trend estimation, and regression analysis in sequence. That made it possible to move from raw inputs to interpretable results without losing track of the logic behind each transformation."
    ],
    "links": [
      {
        "label": "Project repository",
        "url": "https://github.com/rvfamaestre/eci-tp1"
      },
      {
        "label": "Project brief PDF",
        "url": "https://raw.githubusercontent.com/rvfamaestre/eci-tp1/main/eci_kn_rml.pdf"
      },
      {
        "label": "Labor-share report PDF",
        "url": "https://raw.githubusercontent.com/rvfamaestre/eci-tp1/main/labor_share_2014.pdf"
      }
    ],
    "frame": "paper",
    "artStyle": "cellular"
  },
  {
    "id": "combustion",
    "date": "2026-01",
    "title": "A spark, modelled",
    "subtitle": "Combustion Modeling",
    "summary": "Modelling hydrogen-air combustion, from equilibrium to ignition.",
    "body": [
      "This combustion-modeling coursework is organized as a layered progression rather than a single numerical exercise. The work moves from thermochemical reasoning to equilibrium models, then to finite-rate kinetics and plasma-assisted ignition.",
      "That structure makes the project useful as a modeling map. Each stage adds realism and complexity while preserving a clear sense of what the simpler layer was still able to explain."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "silver",
    "artStyle": "mineral"
  },
  {
    "id": "adn",
    "date": "2025-06",
    "title": "Time for what matters",
    "subtitle": "ADN Workflow Automation",
    "summary": "Automating product-data enrichment for Agence du Don en Nature.",
    "body": [
      "This project focused on operational data enrichment rather than pure automation theater. The goal was to speed up and standardize how Agence du Don en Nature product records are completed by adding pricing, reliability, URL, and image information with less manual effort.",
      "A key part of the work was comparative, not just implementational. I evaluated both a small MVP path and an n8n-based orchestration approach so the team could reason about speed, modularity, maintainability, and integration complexity instead of defaulting to one tooling choice."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "paper",
    "artStyle": "field"
  },
  {
    "id": "powertrain",
    "date": "2025-01",
    "title": "A different kind of drive",
    "subtitle": "Megane Powertrain Study",
    "summary": "Comparing powertrain options for a Renault Megane redesign.",
    "body": [
      "This project uses Excel and VBA as engineering tools rather than office software. The objective was to compare several powertrain architectures for a Renault Megane redesign and understand their consequences on performance, consumption, and emissions.",
      "The value of the work comes from comparative modeling. Direct injection, turbocharging, VVT, and hybrid solutions are evaluated against one another so the final output behaves like a design study instead of a single-configuration calculation."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "ink",
    "artStyle": "sculpture"
  },
  {
    "id": "sound",
    "date": "2024-04",
    "title": "From sound to colour",
    "subtitle": "Sound-to-Color Transducer",
    "summary": "An electronics experiment that turns an audio signal into LED light.",
    "body": [
      "This electronics-lab project is a clean signal-chain exercise: take an audio input, shape it with analog circuitry, and transform the processed signal into visible LED output. The challenge is not only making the effect work, but making each stage of the chain legible.",
      "Filtering and rectification turn the raw audio into something the control logic can use. Arduino then adds a programmable layer for mapping signal behavior to light intensity."
    ],
    "links": [
      {
        "label": "LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "silver",
    "artStyle": "watercolor"
  }
];
