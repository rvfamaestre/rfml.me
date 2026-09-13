export default [
  {
    "id": "traffic",
    "date": "2026-08",
    "title": "Fixing phantom traffic jams",
    "subtitle": "Bachelor's thesis · L2S lab",
    "tools": [
      "Python",
      "Optuna"
    ],
    "summary": "My thesis. An RL controller for self-driving cars that makes traffic flow smoother.",
    "body": [
      "Imagine you're on the highway and a car brakes. The next one brakes a bit more, and a few cars later everyone is stopped. There was no accident. That's a phantom traffic jam, and it's what my thesis is about.",
      "I kept a classic cruise control model and added a small reinforcement learning layer on top. It looks further than just the car ahead and makes small corrections.",
      "In simulation it cut speed variation by 76%, and fuel use and CO₂ by 54%, compared with human drivers. I'm really proud of this one."
    ],
    "links": [
      {
        "label": "L2S lab",
        "url": "https://l2s.centralesupelec.fr/"
      }
    ],
    "frame": "ink",
    "artStyle": "mineral"
  },
  {
    "id": "lattice",
    "date": "2026-04",
    "title": "3D printing, three ways",
    "subtitle": "Additive manufacturing · CentraleSupélec",
    "tools": [
      "COMSOL"
    ],
    "summary": "Three small studies on 3D printed parts: heat, weight and lattices.",
    "body": [
      "Three projects in one course, each one about a different side of 3D printing.",
      "First I used COMSOL to see how induction heating warms up a part. Then I worked on making a part lighter without making it weaker. The last one was about TPMS lattices, those sponge-like shapes that are really hard to make any other way."
    ],
    "formula": "\\sin x \\cos y + \\sin y \\cos z + \\sin z \\cos x = 0",
    "formulaNote": "The gyroid, one of the best-known TPMS shapes.",
    "links": [],
    "frame": "oak",
    "artStyle": "sculpture"
  },
  {
    "id": "scheduler",
    "date": "2026-04",
    "title": "A to-do list that plans itself",
    "subtitle": "Python · Notion",
    "tools": [
      "Python",
      "Notion",
      "Google Calendar"
    ],
    "summary": "It takes tasks from Notion and fits them into the free gaps of the calendar.",
    "body": [
      "The script reads tasks from Notion, sorts them by urgency and priority, and finds free time between calendar events.",
      "Then it writes the plan back to Notion, and to Google Calendar if you want. There's also a small page in the browser to change the settings."
    ],
    "image": "assets/work/scheduler.svg",
    "imageNote": "How it works, from Notion to the calendar. Click to see it big.",
    "links": [
      {
        "label": "Code on GitHub",
        "url": "https://github.com/rvfamaestre/notion-scheduler"
      }
    ],
    "frame": "paper",
    "artStyle": "geometry"
  },
  {
    "id": "azores",
    "date": "2024",
    "title": "Road to Success, Azores",
    "subtitle": "Entrepreneurship bootcamp",
    "summary": "A bootcamp in the Azores about ideas, pitching and people.",
    "body": [
      "Not a technical project for once.",
      "It was all about ideas: how to explain one fast, share it with people you just met, and make it better with their feedback. A very international group, in the middle of the Atlantic."
    ],
    "links": [],
    "frame": "paper",
    "artStyle": "mineral"
  },
  {
    "id": "mit",
    "date": "2026-05",
    "title": "Maths for finance",
    "subtitle": "MITx 15.455x",
    "summary": "MIT's online course on the maths behind quantitative finance.",
    "body": [
      "Probability, stochastic processes, Monte Carlo and optimization, all applied to finance.",
      "What I liked most is how theory and code go together. You write a model, simulate it, and then use it to make a decision."
    ],
    "formula": "dS_t = \\mu S_t \\, dt + \\sigma S_t \\, dW_t",
    "formulaNote": "Geometric Brownian motion, the classic model for a stock price.",
    "links": [],
    "frame": "silver",
    "artStyle": "watercolor"
  },
  {
    "id": "life",
    "date": "2024-11",
    "title": "A puzzle game on the Game of Life",
    "subtitle": "Coding Weeks · CentraleSupélec",
    "tools": [
      "Python",
      "LaTeX"
    ],
    "summary": "Place a few cells, press play and let Conway's rules do the rest.",
    "body": [
      "You get a small zone to draw some living cells. Then you press play and Conway's rules take over. You win when the cells reach every blue target.",
      "We were six and worked in short sprints: first the Game of Life in Pygame, then levels, a menu, a level creator and music. Later I cleaned up the code and wrote the docs."
    ],
    "formula": "s_{t+1} = \\begin{cases} 1 & \\text{if } n = 3 \\text{, or if } s_t = 1 \\text{ and } n = 2 \\\\ 0 & \\text{otherwise} \\end{cases}",
    "formulaNote": "The whole rule. n is the number of living neighbors.",
    "image": "assets/work/life.jpg",
    "imageNote": "The start of a level, and the same level solved.",
    "links": [
      {
        "label": "Code on GitHub",
        "url": "https://github.com/rvfamaestre/cws-jdv"
      },
      {
        "label": "Report (PDF)",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cws-jdv/main/report.pdf"
      },
      {
        "label": "Slides (PDF, French)",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cws-jdv/main/soutenance.pdf"
      }
    ],
    "frame": "ink",
    "artStyle": "cellular"
  },
  {
    "id": "robot",
    "date": "2025-11",
    "title": "A robot that finds its way",
    "subtitle": "Autonomous robot · CentraleSupélec",
    "tools": [
      "Python",
      "OpenCV",
      "Raspberry Pi",
      "Arduino",
      "MATLAB"
    ],
    "summary": "It follows lines, spots crossings and finds the shortest way from A to B.",
    "body": [
      "Five of us built a small robot meant for city deliveries. A camera follows the white lines, it recognizes the crossings and uses BFS to find the shortest way from A to B. If the infrared sensor sees something in the way, it turns around and plans a new route.",
      "My part was the simulation, in MATLAB, Simulink and Stateflow, and the app to control the robot."
    ],
    "image": "assets/work/robot.jpg",
    "imageNote": "Our robot. The team was called Ctrl + Car.",
    "links": [
      {
        "label": "Code on GitHub",
        "url": "https://github.com/rvfamaestre/cvt-vac"
      },
      {
        "label": "Final slides (PDF, French)",
        "url": "https://raw.githubusercontent.com/rvfamaestre/cvt-vac/main/Soutenance%20Finale%20EI%20VAC.pdf"
      }
    ],
    "frame": "oak",
    "artStyle": "relief"
  },
  {
    "id": "portfolio",
    "date": "2025-06",
    "title": "A calm crypto portfolio",
    "subtitle": "Course project · CentraleSupélec",
    "tools": [
      "Python",
      "Jupyter",
      "pandas",
      "NumPy"
    ],
    "summary": "20 cryptos, some maths and strict rules on risk.",
    "body": [
      "Five of us built a portfolio of 20 cryptos plus cash. At each rebalance we estimate returns and risk, then pick the weights with CVXPY. The rules: long only, volatility under 25% and a minimum of diversification.",
      "In the backtest our final strategy made 13.4% with 6.4% volatility. Bitcoin lost 4.4% with 54.9%."
    ],
    "formula": "w^* = \\arg\\min_{w} \\; \\tfrac{1}{2} \\, w^\\top \\Sigma \\, w - \\gamma \\, \\mu^\\top w \\quad \\text{with} \\quad \\textstyle\\sum_i w_i = 1, \\; w_i \\ge 0",
    "formulaNote": "How we chose the weights, balancing risk against expected return.",
    "image": "assets/work/portfolio.jpg",
    "imageNote": "Our portfolio (blue) against Bitcoin (orange), 2022 to 2024.",
    "links": [
      {
        "label": "Code on GitHub",
        "url": "https://github.com/rvfamaestre/mds-pfm"
      },
      {
        "label": "Slides (PDF)",
        "url": "https://raw.githubusercontent.com/rvfamaestre/mds-pfm/main/soutenance.pdf"
      }
    ],
    "frame": "silver",
    "artStyle": "field"
  },
  {
    "id": "reinforcement",
    "date": "2026-03",
    "title": "Stanford's RL course",
    "subtitle": "CS234",
    "summary": "How agents learn by trying things, step by step.",
    "body": [
      "I took it while working on my thesis, and it helped a lot. It goes step by step: how to set up the problem, value methods, policy methods and exploration."
    ],
    "formula": "Q^*(s,a) = \\mathbb{E}\\left[\\, r + \\gamma \\max_{a'} Q^*(s',a') \\,\\right]",
    "formulaNote": "The Bellman equation, where a lot of it starts.",
    "links": [],
    "frame": "paper",
    "artStyle": "sculpture"
  },
  {
    "id": "regions",
    "date": "2026-02",
    "title": "Why some regions stay behind",
    "subtitle": "Literature review",
    "summary": "Why poor regions often stay poor, long after the reasons are gone.",
    "body": [
      "Some regions stay behind for decades, even when the original reasons are long gone. I read around three ideas: institutions that get stuck, transport that keeps giving some places an edge, and cities that grow just because they already grew."
    ],
    "links": [],
    "frame": "oak",
    "artStyle": "relief"
  },
  {
    "id": "databox",
    "date": "2026-01",
    "title": "Factory DataBox",
    "subtitle": "Supply chain training, online",
    "summary": "Bringing a supply chain training course to the web.",
    "body": [
      "Factory DataBox teaches supply chain. I helped bring it online: I reshaped the course for the browser, improved the exercises and got it ready for more languages. Traffic and SEO were part of the job too."
    ],
    "links": [],
    "frame": "ink",
    "artStyle": "geometry"
  },
  {
    "id": "labor",
    "date": "2026-01",
    "title": "Cheaper machines, less for workers?",
    "subtitle": "Research project",
    "tools": [
      "Python",
      "pandas",
      "NumPy",
      "LaTeX"
    ],
    "summary": "I tested a famous economics paper in Python. The answer depends on the years you pick.",
    "body": [
      "Karabarbounis and Neiman showed that as machines got cheaper, workers got a smaller slice of income. I wanted to see how solid that is.",
      "So I rebuilt the core of it in Python and played with countries and time windows. With long, clean data the link shows up. For the Americas it even flips."
    ],
    "formula": "\\beta^{s}_i = a + b \\, \\beta^{\\xi}_i + \\varepsilon_i",
    "formulaNote": "One point per country: its labor share trend against its investment price trend.",
    "image": "assets/work/labor.jpg",
    "imageNote": "From 1980 to 2000. Where investment got cheaper faster, the labor share fell more.",
    "links": [
      {
        "label": "Code on GitHub",
        "url": "https://github.com/rvfamaestre/eci-tp1"
      },
      {
        "label": "My report (PDF)",
        "url": "https://raw.githubusercontent.com/rvfamaestre/eci-tp1/main/eci_kn_rml.pdf"
      },
      {
        "label": "The original paper",
        "url": "https://www.nber.org/papers/w19136"
      }
    ],
    "frame": "paper",
    "artStyle": "cellular"
  },
  {
    "id": "combustion",
    "date": "2026-01",
    "title": "Modeling a hydrogen flame",
    "subtitle": "Combustion course",
    "summary": "Hydrogen and air, modeled step by step until it ignites.",
    "body": [
      "Each step adds a bit more reality: first the thermochemistry, then equilibrium, then how fast reactions really go, and finally ignition helped by plasma."
    ],
    "formula": "k(T) = A \\, T^{b} \\, e^{-E_a / R T}",
    "formulaNote": "The Arrhenius law: how fast a reaction goes depending on temperature.",
    "links": [],
    "frame": "silver",
    "artStyle": "mineral"
  },
  {
    "id": "adn",
    "date": "2025-06",
    "title": "Sorting donated products with AI",
    "subtitle": "Agence du Don en Nature",
    "tools": [
      "n8n"
    ],
    "summary": "An n8n pipeline that fills in product data for an NGO. The team adopted it.",
    "body": [
      "Agence du Don en Nature handles lots of donated products, and each one needs a price, a link, a picture and a category. That was a lot of work by hand.",
      "I compared a small MVP with an n8n pipeline using AI agents. The n8n one is what the team ended up adopting."
    ],
    "links": [
      {
        "label": "Agence du Don en Nature",
        "url": "https://adnfrance.org/"
      }
    ],
    "frame": "paper",
    "artStyle": "field"
  },
  {
    "id": "powertrain",
    "date": "2025-01",
    "title": "Picking an engine for a Mégane",
    "subtitle": "Powertrain study",
    "tools": [
      "Excel"
    ],
    "summary": "Which engine for a Renault Mégane redesign? Compared in Excel and VBA.",
    "body": [
      "Direct injection, turbo, variable valve timing or hybrid? I built a model in Excel and VBA to compare them on performance, fuel use and emissions."
    ],
    "links": [],
    "frame": "ink",
    "artStyle": "sculpture"
  },
  {
    "id": "sound",
    "date": "2024-04",
    "title": "Turning sound into light",
    "subtitle": "Electronics lab",
    "tools": [
      "Arduino"
    ],
    "summary": "A circuit that turns an audio signal into LED light.",
    "body": [
      "The audio goes through analog filters and a rectifier. Then an Arduino decides how bright the LEDs should be."
    ],
    "formula": "f_c = \\frac{1}{2 \\pi R C}",
    "formulaNote": "The cutoff frequency of a simple RC filter.",
    "links": [],
    "frame": "silver",
    "artStyle": "watercolor"
  }
];
