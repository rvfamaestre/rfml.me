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
    title: "VAC Robot: Autonomous Navigation",
    date: "Spring 2024 | 10 wks",
    category: "Robotics",
    variant: "technical",
    image: "https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=80",
    gallery: [
      {
        src: "https://images.unsplash.com/photo-1523475472560-d2df97ec485c?auto=format&fit=crop&w=1400&q=80",
        caption: "Vision-guided corrections calculated on the Raspberry Pi before being streamed to Arduino motor control."
      },
      {
        src: "https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=1400&q=80",
        caption: "Tkinter control room showing the 5x5 grid, live sensor logs, and the robot pose as a heading-aware triangle."
      },
      {
        src: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?auto=format&fit=crop&w=1400&q=80",
        caption: "BFS-generated paths overlaid on the grid and re-routed in real time when the IR sensor flags a blocked edge."
      }
    ],
    description: [
      "Team project for the 2SC5300 - Vehicule Autonome et Connecte course, where I co-designed a Raspberry Pi and Arduino based robot that navigates a white-lined track without manual intervention. I coordinated closely with Gabriel Sylvestre Nunez, Matthieu Giraud-Sauveur, Loic Perthuis, and Luqman Proietti to turn a remote-controlled kit into an autonomous platform.",
      "On the hardware layer the Arduino handled dual traction motors, encoders, an infrared rangefinder, and an ultrasonic rig, while a Raspberry Pi orchestrated the high-level autonomy stack. Our serial link at 115200 bauds kept commands and telemetry synchronized between Python scripts and the embedded firmware.",
      "I owned the computer-vision pipeline that keeps the robot centered on the line: a cropped HSV mask isolates the track, morphological operations clean the contour, and a nonlinear PD controller translates the centroid error into smooth, independent wheel speeds. Intersection detection adds temporal cooldowns to avoid false triggers and lets the planner decide when to turn, continue, or execute a demi-tour.",
      "For macro navigation we modeled the floor as a 5x5 graph. Breadth-First Search plans the shortest sequence of nodes, translates them into relative actions, and restarts whenever the IR detector confirms an unexpected obstacle. A desktop Tkinter application mirrors every state change, streams logs, and lets us mark edges, observe re-planning events, and command manual sequences when debugging."
    ],
    technologies: [
      "Raspberry Pi 4",
      "Arduino Mega",
      "Python",
      "OpenCV",
      "Tkinter",
      "C++",
      "PWM motor control",
      "Breadth-First Search"
    ],
    highlights: [
      "Delivered a pure vision line follower with a custom nonlinear PD controller that keeps oscillations below 5 degrees on tight turns.",
      "Implemented multi-frame validation for IR readings and servo sweeps, reducing false obstacle stops by roughly 80 percent.",
      "Built a BFS-based planner with automatic re-routing that can recover from blocked edges in under 200 ms on the Raspberry Pi.",
      "Designed a desktop control room that visualizes the grid, logs, and robot pose, enabling the whole team to iterate without touching the CLI."
    ],
    github: {
      repo: "rvfamaestre/st5-vac-ei",
      url: "https://github.com/rvfamaestre/st5-vac-ei",
      description: "Source for the Arduino firmware, Python orchestration scripts, and Tkinter control room that power the VAC autonomous robot.",
      branch: "main"
    },
    links: [
      {
        label: "Gabriel Sylvestre Nunez - LinkedIn",
        url: "https://www.linkedin.com/in/gabriel-sylvestre-n%C3%BA%C3%B1ez-6810b1294/"
      },
      {
        label: "Matthieu Giraud-Sauveur - LinkedIn",
        url: "https://www.linkedin.com/in/matthieu-giraud-sauveur/"
      },
      {
        label: "Loic Perthuis - LinkedIn",
        url: "https://www.linkedin.com/in/loic-perthuis/"
      },
      {
        label: "Luqman Proietti - LinkedIn",
        url: "https://www.linkedin.com/in/l%C3%BBqman-proietti-49b4442b6/"
      }
    ],
    details: [
      { label: "Course", value: "2SC5300 - Vehicule Autonome et Connecte" },
      { label: "Role", value: "Computer vision and navigation lead" },
      {
        label: "Team",
        value: "Gabriel Sylvestre Nunez, Matthieu Giraud-Sauveur, Loic Perthuis, Luqman Proietti"
      }
    ]
  }
];
