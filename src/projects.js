export default [
  {
    "id": "traffic",
    "date": "2026-08",
    "title": "Fixing phantom traffic jams",
    "subtitle": "Bachelor's thesis · L2S lab",
    "tools": [
      "Python",
      "PyTorch",
      "NumPy",
      "SciPy",
      "Matplotlib",
      "Optuna",
      "LaTeX"
    ],
    "summary": "My thesis. An RL controller for self-driving cars that makes traffic flow smoother.",
    "body": [
      "Imagine you're on the highway and a car brakes. The next one brakes a bit more, and a few cars later everyone is stopped. There was no accident. That's a phantom traffic jam, and it's what my thesis is about.",
      "The automated cars keep a classic cooperative cruise control. On top, a small reinforcement learning policy (SAC) looks at the traffic ahead and nudges the time gap the controller asks for, never by more than 10%.",
      "In the main test, a 300 m ring road with 22 cars and half of them automated, the policy cut speed dispersion by 33.4% compared with the rule alone. Estimated fuel use and CO₂ fell 54.3% compared with no control at all."
    ],
    "links": [
      {
        "label": "L2S lab",
        "url": "https://l2s.centralesupelec.fr/"
      }
    ],
    "frame": "ink",
    "artStyle": "squeegee",
    "artPalette": 0,
    "formula": "\\begin{gathered}h_i=\\alpha_i\\,h_0\\\\\\alpha_i=\\operatorname{clip}\\!\\left(\\mathring{\\alpha}_i+\\Delta\\alpha_i,\\ \\alpha_{\\min},\\ \\alpha_{\\max}\\right)\\\\\\left|\\Delta\\alpha_i\\right|\\le 0.1\\end{gathered}",
    "formulaNote": "The time gap each automated car asks for. The rule sets α̊ from the traffic ahead, and the learned policy only adds Δα, capped at 0.1."
  },
  {
    "id": "lattice",
    "date": "2026-04",
    "title": "3D printing, three ways",
    "subtitle": "Additive manufacturing · CentraleSupélec",
    "tools": [
      "COMSOL",
      "MATLAB",
      "Altair Inspire"
    ],
    "summary": "Three small studies on 3D printed parts: heat, weight and lattices.",
    "body": [
      "Three projects in one course, each one about a different side of 3D printing.",
      "First, induction heating in a frying pan, simulated in COMSOL. Then a lighter suspension wishbone, optimized in Altair Inspire. Last, a MATLAB script that builds TPMS lattices like the gyroid."
    ],
    "formula": "\\sin x\\cos y+\\sin y\\cos z+\\sin z\\cos x>t",
    "formulaNote": "The gyroid. My script keeps the solid where this is above t, and changes t to make each part of the lattice denser or lighter.",
    "links": [],
    "frame": "oak",
    "artStyle": "cellular",
    "artPalette": 1
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
    "artStyle": "geometry",
    "artPalette": 15
  },
  {
    "id": "azores",
    "date": "2024",
    "title": "Road to Success, Azores",
    "subtitle": "Entrepreneurship bootcamp",
    "summary": "An entrepreneurship bootcamp in the Azores.",
    "body": [
      "Road to Success was an entrepreneurship bootcamp I took part in, in the Azores."
    ],
    "links": [],
    "frame": "paper",
    "artStyle": "marbling",
    "artPalette": 5
  },
  {
    "id": "mit",
    "date": "2026-05",
    "title": "Maths for finance",
    "subtitle": "MITx 15.455x",
    "summary": "MIT's online course on the maths behind quantitative finance.",
    "body": [
      "Probability, stochastic processes, Monte Carlo and optimization, all applied to finance.",
      "In the R exercises I simulated stock prices and priced options with Monte Carlo."
    ],
    "formula": "\\begin{gathered}C_0\\approx e^{-rT}\\,\\frac{1}{N}\\sum_{i=1}^{N}\\max\\!\\left(S_T^{(i)}-K,\\,0\\right)\\\\S_T^{(i)}=S_0\\,e^{\\left(r-\\sigma^2/2\\right)T+\\sigma\\sqrt{T}\\,Z_i}\\end{gathered}",
    "formulaNote": "How I priced a call option in R: simulate 10,000 final prices, average the payoff and discount it. Z is a standard normal draw.",
    "links": [],
    "frame": "silver",
    "artStyle": "halftone",
    "tools": [
      "R"
    ],
    "artPalette": 4
  },
  {
    "id": "life",
    "date": "2024-11",
    "title": "A puzzle game on the Game of Life",
    "subtitle": "Coding Weeks · CentraleSupélec",
    "tools": [
      "Python",
      "Pygame",
      "LaTeX"
    ],
    "summary": "Place a few cells, press play and let Conway's rules do the rest.",
    "body": [
      "You get a small zone to draw some living cells. Then you press play and Conway's rules take over. You win when the cells reach every blue target.",
      "We were six and worked in short sprints: first the Game of Life in Pygame, then levels, a menu, a level creator and music. Later I put the code on GitHub."
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
    "artStyle": "dither",
    "artPalette": 9
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
      "MATLAB",
      "Simulink",
      "Stateflow"
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
    "artStyle": "folds",
    "artPalette": 8
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
      "NumPy",
      "CVXPY",
      "statsmodels",
      "Matplotlib"
    ],
    "summary": "20 cryptos, some maths and strict rules on risk.",
    "body": [
      "Five of us built a portfolio of 20 cryptos plus cash. At each rebalance we estimate returns with a moving average and risk with a GARCH model, then pick the weights with CVXPY. The rules: no short selling, volatility under 25% and enough diversification.",
      "In our backtest the final strategy returned 13.36% with 6.38% volatility. Bitcoin lost 4.4% with 54.9%."
    ],
    "formula": "\\begin{gathered} \\min_w\\; \\tfrac12 w^\\top\\Sigma w-\\gamma\\mu^\\top w \\\\ \\mathbf1^\\top w=1,\\quad w\\ge0,\\quad w^\\top\\Sigma w\\le\\sigma_{\\max}^2 \\\\ N\\sqrt{d_{\\min}}\\,w_i\\le\\sum_{j\\in\\mathcal R}w_j,\\quad i\\in\\mathcal R \\end{gathered}",
    "formulaNote": "What we solved at each rebalance. μ and Σ are the estimated returns and risk, and γ sets how much we chase return. The last line keeps any single crypto from taking too big a share of the crypto part.",
    "image": "assets/work/portfolio.jpg",
    "imageNote": "Our portfolio (blue) against Bitcoin (orange), from 2022 to 2024.",
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
    "artStyle": "albers",
    "artPalette": 7
  },
  {
    "id": "reinforcement",
    "date": "2026-03",
    "title": "Stanford's RL course",
    "subtitle": "CS234",
    "summary": "How agents learn by trying things, step by step.",
    "body": [
      "I took it while starting my thesis on RL. The assignments go from value and policy iteration to deep RL, PPO, RLHF and DPO."
    ],
    "formula": "Q^*(s,a)=\\mathbb{E}\\!\\left[r+\\gamma\\max_{a\\prime}Q^*(s\\prime,a\\prime)\\mid s,a\\right]",
    "formulaNote": "Bellman optimality, the idea behind value iteration in the first assignment. γ is the discount factor.",
    "links": [],
    "frame": "paper",
    "artStyle": "packing",
    "tools": [
      "Python",
      "PyTorch",
      "NumPy"
    ],
    "artPalette": 6
  },
  {
    "id": "regions",
    "date": "2026-02",
    "title": "Why some regions stay behind",
    "subtitle": "Literature review",
    "summary": "Why poor regions often stay poor, long after the reasons are gone.",
    "body": [
      "I co-wrote a literature review on why some regions stay behind for decades. We compared three explanations, extractive institutions, transport infrastructure and cities that keep growing because they already grew, and what each one means for policy."
    ],
    "links": [
      {
        "label": "Project on LinkedIn",
        "url": "https://www.linkedin.com/in/rafael-maestre-lopez/"
      }
    ],
    "frame": "oak",
    "artStyle": "relief",
    "artPalette": 2
  },
  {
    "id": "databox",
    "date": "2026-01",
    "title": "Factory DataBox",
    "subtitle": "Supply chain training, online",
    "summary": "Bringing a supply chain training course to the web.",
    "body": [
      "Factory DataBox teaches supply chain. We brought the course online with a WordPress plugin: interactive exercises with automatic feedback, a small data lab and room for more languages."
    ],
    "links": [],
    "frame": "ink",
    "artStyle": "collage",
    "tools": [
      "WordPress",
      "JavaScript",
      "PHP"
    ],
    "artPalette": 10
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
      "statsmodels",
      "Matplotlib",
      "LaTeX"
    ],
    "summary": "I tested a famous economics paper in Python. The answer depends on the years you pick.",
    "body": [
      "Karabarbounis and Neiman linked the global fall of the labor share to cheaper investment goods. I rebuilt the core of their test in Python to see how solid that link is.",
      "It depends a lot on the countries and years you pick, and it even flips sign for the Americas. So this is a sensitivity study, not a full replication."
    ],
    "formula": "\\beta_i^{\\log s}=a+b\\,\\beta_i^{\\log\\xi}+\\varepsilon_i",
    "formulaNote": "One dot per country: the trend of its labor share against the trend of investment prices, both in logs.",
    "image": "assets/work/labor.jpg",
    "imageNote": "1980 to 2000, one dot per country. In this window the slope is positive.",
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
    "artStyle": "field",
    "artPalette": 11
  },
  {
    "id": "combustion",
    "date": "2026-01",
    "title": "Igniting hydrogen with plasma",
    "subtitle": "Reactive media course · CentraleSupélec",
    "summary": "A MATLAB model of a hydrogen gas turbine that ignites with tiny plasma pulses.",
    "body": [
      "With a classmate, I modeled a hydrogen–air gas turbine as a perfectly stirred reactor in MATLAB. First we found how hot a spark has to be to ignite it. Then we swapped the spark for nanosecond plasma pulses and counted how many it takes."
    ],
    "formula": "\\begin{gathered}\\frac{dY_k}{dt}=\\frac{Y_k^{FG}-Y_k}{\\tau}+\\frac{M_k}{\\rho}\\left(\\dot\\omega_k^{c}+\\dot\\omega_k^{p}\\right)\\\\\\dot E_p=\\frac{E_d}{V_d\\,\\tau_d}\\end{gathered}",
    "formulaNote": "Each species in the reactor: fresh gas (FG) flows in, and chemistry (ω̇ᶜ) and plasma (ω̇ᵖ) change it. Each pulse also heats the gas at rate Ėₚ.",
    "links": [],
    "frame": "silver",
    "artStyle": "glow",
    "tools": [
      "MATLAB",
      "LaTeX"
    ],
    "artPalette": 12
  },
  {
    "id": "adn",
    "date": "2025-06",
    "title": "Sorting donated products with AI",
    "subtitle": "Agence du Don en Nature",
    "tools": [
      "n8n"
    ],
    "summary": "An n8n pipeline with AI agents that sorts donated products. The team adopted it.",
    "body": [
      "For Agence du Don en Nature, I built an n8n pipeline with AI agents that puts donated products into categories automatically. The team later adopted it internally."
    ],
    "links": [
      {
        "label": "Agence du Don en Nature",
        "url": "https://adnfrance.org/"
      }
    ],
    "frame": "paper",
    "artStyle": "terrazzo",
    "artPalette": 13
  },
  {
    "id": "powertrain",
    "date": "2025-01",
    "title": "Designing a compact car’s powertrain",
    "subtitle": "Powertrain study",
    "tools": [
      "Excel",
      "VBA"
    ],
    "summary": "Excel and VBA models to pick the engine of a made-up carmaker's compact car.",
    "body": [
      "In a group of six, we designed the powertrain of a compact car for a made-up carmaker, with the Mégane and the 308 as rivals. Our Excel and VBA models add direct injection, turbo, variable valve timing and hybrids step by step, and check acceleration, fuel use and CO₂ on the NEDC and WLTP cycles."
    ],
    "links": [],
    "frame": "ink",
    "artStyle": "vasarely",
    "artPalette": 14
  },
  {
    "id": "sound",
    "date": "2024-04",
    "title": "Turning sound into light",
    "subtitle": "Electronics lab",
    "tools": [
      "Arduino",
      "LTspice"
    ],
    "summary": "A circuit that turns an audio signal into LED light.",
    "body": [
      "We built a circuit that splits the sound from a microphone into bass, mids and highs with three band-pass filters, simulated first in LTspice. Each band is rectified, and an Arduino sets the brightness of its LEDs."
    ],
    "formula": "f_0=\\sqrt{f_1 f_2}=\\frac{1}{2\\pi C}\\sqrt{\\frac{R_1+R_3}{R_1R_2R_3}},\\qquad Q=\\frac{f_0}{f_2-f_1}",
    "formulaNote": "The band-pass filter behind each channel. We tuned three, to 100 Hz, 1 kHz and 10 kHz, all with Q = 5.",
    "links": [],
    "frame": "silver",
    "artStyle": "veils",
    "artPalette": 3
  }
];
