export default [
  {
    "id": "traffic",
    "date": "2026-08",
    "title": "My thesis on phantom traffic jams",
    "subtitle": "Bachelor's thesis with the L2S lab",
    "tools": [
      "Python",
      "PyTorch",
      "NumPy",
      "SciPy",
      "Matplotlib",
      "Optuna",
      "LaTeX"
    ],
    "summary": "My bachelor's thesis. Reinforcement learning to help self-driving cars smooth out traffic.",
    "body": [
      "So my thesis is about phantom traffic jams. Imagine you're on the highway and a car brakes. The next one brakes a bit more, and a few cars later somebody stops completely. There was no accident, but the traffic stopped anyway.",
      "The automated cars keep a normal cooperative cruise control, with the same safety limits. On top of that I added a small reinforcement learning policy, SAC (Soft Actor-Critic), that looks at the traffic ahead and adjusts the gap each car asks for. It can only move that gap by 10%, so it never really takes over the car.",
      "In the main test, a 300 m ring road with 22 cars where half of them are automated, speed dispersion went down 33.4% compared with the rule alone. Estimated fuel use and CO₂ went down 54.3% compared with no control at all. It was really hard to get there, and I'm very proud of it. But it's not done, there is still a lot to try."
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
    "formulaNote": "The gap each automated car asks for. The rule picks α̊ from the traffic ahead, and the policy only adds a small Δα, never more than 0.1."
  },
  {
    "id": "lattice",
    "date": "2026-04",
    "title": "3D printing projects",
    "subtitle": "Additive manufacturing course at CentraleSupélec",
    "tools": [
      "COMSOL",
      "MATLAB",
      "Altair Inspire"
    ],
    "summary": "Three small projects from my 3D printing course.",
    "body": [
      "This course had three projects, and each one looked at a different side of 3D printing.",
      "First I simulated induction heating in a frying pan with COMSOL. Then I made a suspension wishbone lighter in Altair Inspire. And the last one was a MATLAB script that builds TPMS lattices, like the gyroid."
    ],
    "formula": "\\sin x\\cos y+\\sin y\\cos z+\\sin z\\cos x>t",
    "formulaNote": "The gyroid. My script keeps the solid wherever this is bigger than t, and it changes t to make some parts denser than others.",
    "links": [],
    "frame": "oak",
    "artStyle": "cellular",
    "artPalette": 1
  },
  {
    "id": "scheduler",
    "date": "2026-04",
    "title": "Notion task scheduler",
    "subtitle": "Python and Notion",
    "tools": [
      "Python",
      "Notion",
      "Google Calendar"
    ],
    "summary": "A Python script that takes my Notion tasks and fits them into the free gaps of my calendar.",
    "body": [
      "I wanted my tasks in Notion to turn into an actual plan, without doing it by hand. So the script reads the tasks, sorts them by urgency and priority, and looks for free time between calendar events.",
      "Then it writes the plan back to Notion, and to Google Calendar if you want. There is also a small page in the browser to change the settings."
    ],
    "image": "assets/work/scheduler.svg",
    "imageNote": "How it works, from Notion to the calendar. Click to see it bigger.",
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
      "I took part in Road to Success, an entrepreneurship bootcamp in the Azores."
    ],
    "links": [],
    "frame": "paper",
    "artStyle": "marbling",
    "artPalette": 5
  },
  {
    "id": "mit",
    "date": "2026-05",
    "title": "Math for finance, MITx",
    "subtitle": "MITx 15.455x",
    "summary": "An online MIT course about the math behind quantitative finance.",
    "body": [
      "Probability, stochastic processes, Monte Carlo and optimization, all of it applied to finance.",
      "The exercises were in R. In one of them I priced options with Monte Carlo, which is basically simulating a lot of stock prices and averaging what the option pays."
    ],
    "formula": "\\begin{gathered}C_0\\approx e^{-rT}\\,\\frac{1}{N}\\sum_{i=1}^{N}\\max\\!\\left(S_T^{(i)}-K,\\,0\\right)\\\\S_T^{(i)}=S_0\\,e^{\\left(r-\\sigma^2/2\\right)T+\\sigma\\sqrt{T}\\,Z_i}\\end{gathered}",
    "formulaNote": "How I priced a call option in R. You simulate 10,000 final prices, average the payoff and discount it back to today. Z is a standard normal draw.",
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
    "title": "Game of Life puzzle game",
    "subtitle": "Coding Weeks at CentraleSupélec",
    "tools": [
      "Python",
      "Pygame",
      "LaTeX"
    ],
    "summary": "A puzzle game where you place a few cells and let Conway's rules do the rest.",
    "body": [
      "You get a small zone where you draw some living cells. Then you press play and the Game of Life takes over. You win when the cells reach every blue target.",
      "We were six and we worked in short sprints. First the Game of Life in Pygame, then levels, a menu, a level creator and some music. Later I put the code on GitHub."
    ],
    "formula": "s_{t+1} = \\begin{cases} 1 & \\text{if } n = 3 \\text{, or if } s_t = 1 \\text{ and } n = 2 \\\\ 0 & \\text{otherwise} \\end{cases}",
    "formulaNote": "That's the whole rule. n is the number of living neighbors.",
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
    "title": "Autonomous robot",
    "subtitle": "Group project at CentraleSupélec",
    "tools": [
      "Python",
      "OpenCV",
      "Raspberry Pi",
      "Arduino",
      "MATLAB",
      "Simulink",
      "Stateflow"
    ],
    "summary": "A small robot that follows lines, spots crossings and finds the shortest way from A to B.",
    "body": [
      "Five of us built a small robot meant for deliveries in a city. A camera follows the white lines, the robot recognizes the crossings, and it uses BFS to find the shortest way from A to B. If the infrared sensor sees something in the way, it turns around and plans a new route.",
      "My part was the simulation, in MATLAB, Simulink and Stateflow, and the app we used to control the robot."
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
    "title": "Crypto portfolio optimization",
    "subtitle": "Course project at CentraleSupélec",
    "tools": [
      "Python",
      "Jupyter",
      "pandas",
      "NumPy",
      "CVXPY",
      "statsmodels",
      "Matplotlib"
    ],
    "summary": "A portfolio of 20 cryptos with strict rules on risk.",
    "body": [
      "Five of us built a portfolio of 20 cryptos plus cash. At every rebalance we estimated returns with a moving average and risk with a GARCH model, and then CVXPY picked the weights. The rules were no short selling, volatility under 25% and enough diversification.",
      "In our backtest the final strategy made 13.36% with 6.38% volatility, while Bitcoin lost 4.4% with 54.9%."
    ],
    "formula": "\\begin{gathered} \\min_w\\; \\tfrac12 w^\\top\\Sigma w-\\gamma\\mu^\\top w \\\\ \\mathbf1^\\top w=1,\\quad w\\ge0,\\quad w^\\top\\Sigma w\\le\\sigma_{\\max}^2 \\\\ N\\sqrt{d_{\\min}}\\,w_i\\le\\sum_{j\\in\\mathcal R}w_j,\\quad i\\in\\mathcal R \\end{gathered}",
    "formulaNote": "What we solved at every rebalance. μ and Σ are the estimated returns and risk, and γ is how much we care about return. The last line stops one crypto from taking too much of the crypto part.",
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
    "title": "Stanford CS234",
    "subtitle": "Reinforcement learning course",
    "summary": "Stanford's course on reinforcement learning, which I took while starting my thesis.",
    "body": [
      "I took it while I was starting my thesis on reinforcement learning. The assignments go from value and policy iteration to deep RL, and then PPO, RLHF and DPO."
    ],
    "formula": "Q^*(s,a)=\\mathbb{E}\\!\\left[r+\\gamma\\max_{a'}Q^*(s',a')\\mid s,a\\right]",
    "formulaNote": "The Bellman optimality equation. Value iteration in the first assignment is built on it. γ is the discount factor.",
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
    "title": "Regional development gaps",
    "subtitle": "Literature review",
    "summary": "A literature review on why some regions stay behind for decades.",
    "body": [
      "I co-wrote a literature review on why some regions stay behind for decades, even when the reasons that started the gap are gone. We looked at extractive institutions, transport infrastructure and urban path dependence (cities that keep growing because they already grew), and at what each one means for policy."
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
      "Factory DataBox teaches supply chain. We brought the course online with a WordPress plugin: interactive exercises that give feedback on their own, a small data lab, and room to add more languages later."
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
    "title": "Labor share study",
    "subtitle": "Research project",
    "tools": [
      "Python",
      "pandas",
      "NumPy",
      "statsmodels",
      "Matplotlib",
      "LaTeX"
    ],
    "summary": "I tested a well known economics paper in Python, and the answer depends a lot on the years you pick.",
    "body": [
      "Karabarbounis and Neiman linked the global fall in the labor share to investment goods getting cheaper. I rebuilt the core of their test in Python to see how solid that link really is.",
      "It depends a lot on the countries and years you pick, and for the Americas it even flips sign. So this is more of a sensitivity study than a full replication."
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
    "title": "Hydrogen ignition with plasma",
    "subtitle": "Reactive media course at CentraleSupélec",
    "summary": "A MATLAB model of a hydrogen gas turbine that lights up with tiny plasma pulses.",
    "body": [
      "With a classmate I modeled a hydrogen and air gas turbine as a perfectly stirred reactor, in MATLAB. First we found how hot a spark has to be to light it. Then we swapped the spark for nanosecond plasma pulses and counted how many it takes."
    ],
    "formula": "\\begin{gathered}\\frac{dY_k}{dt}=\\frac{Y_k^{FG}-Y_k}{\\tau}+\\frac{M_k}{\\rho}\\left(\\dot\\omega_k^{c}+\\dot\\omega_k^{p}\\right)\\\\\\dot E_p=\\frac{E_d}{V_d\\,\\tau_d}\\end{gathered}",
    "formulaNote": "What happens to each species in the reactor. Fresh gas (FG) comes in, and chemistry (ω̇ᶜ) and plasma (ω̇ᵖ) change it. Each pulse also heats the gas at a rate Ėₚ.",
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
    "title": "Sorting donated products with n8n",
    "subtitle": "Agence du Don en Nature",
    "tools": [
      "n8n"
    ],
    "summary": "An n8n pipeline with AI agents that sorts donated products. The team ended up using it.",
    "body": [
      "For Agence du Don en Nature I built an n8n pipeline with AI agents that puts donated products into categories automatically. Later the team adopted it internally."
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
    "title": "Compact car powertrain",
    "subtitle": "Powertrain study",
    "tools": [
      "Excel",
      "VBA"
    ],
    "summary": "Excel and VBA models to choose the engine of a compact car for a made up carmaker.",
    "body": [
      "We were a group of six, and we designed the powertrain of a compact car for a made up carmaker, with the Mégane and the 308 as rivals. Our Excel and VBA models add direct injection, turbo, variable valve timing and hybrids one by one, and check acceleration, fuel use and CO₂ on the NEDC and WLTP cycles."
    ],
    "links": [],
    "frame": "ink",
    "artStyle": "vasarely",
    "artPalette": 14
  },
  {
    "id": "sound",
    "date": "2024-04",
    "title": "Sound to light circuit",
    "subtitle": "Electronics lab",
    "tools": [
      "Arduino",
      "LTspice"
    ],
    "summary": "A circuit that turns sound into LED light.",
    "body": [
      "We built a circuit that takes the sound from a microphone and splits it into bass, mids and highs with three band-pass filters. We simulated it first in LTspice. Then each band gets rectified and an Arduino sets how bright its LEDs are."
    ],
    "formula": "\\begin{gathered}f_0=\\sqrt{f_1 f_2}=\\frac{1}{2\\pi C}\\sqrt{\\frac{R_1+R_3}{R_1R_2R_3}}\\\\Q=\\frac{f_0}{f_2-f_1}\\end{gathered}",
    "formulaNote": "The band-pass filter behind each channel. We tuned three of them, to 100 Hz, 1 kHz and 10 kHz, all with Q = 5.",
    "links": [],
    "frame": "silver",
    "artStyle": "veils",
    "artPalette": 3
  }
];
