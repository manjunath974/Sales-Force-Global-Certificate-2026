# 💡 Smart Adaptive Street Light System

A modern, responsive **Smart City IoT Dashboard** built with pure HTML5, CSS3, and Vanilla JavaScript. This project simulates an AI-assisted street light scheduling system that automatically adapts to holidays and displays real-time status information through a sleek, glassmorphic dashboard.

---

## 📁 Project Structure

```
Smart-Street-Light-System/
│
├── index.html              # Main HTML file (structure & markup)
├── css/
│   └── style.css           # All styling, animations, responsive rules
├── js/
│   └── app.js               # Application logic and scheduling engine
├── assets/
│   ├── images/               # Reserved for future image assets
│   └── icons/                 # Reserved for future icon assets
└── README.md                # Project documentation (this file)
```

---

## 🚀 Getting Started

No installation, build tools, or dependencies are required.

1. Download or clone the `Smart-Street-Light-System` folder.
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Edge, Safari).
3. The dashboard will load instantly with a live clock, street light panel, and full scheduling controls.

---

## 🎨 Design Theme

Styled as a **Modern Smart City IoT Dashboard** using:

| Element | Color |
|---|---|
| Background | Dark Navy `#0B132B` |
| Primary Accent | Electric Blue `#3A86FF` |
| Highlight / Glow | Yellow `#FFD60A` |
| Text | White |
| Light ON Indicator | Green / Glowing Yellow |
| Light OFF Indicator | Grey |

Visual features include glassmorphism cards, soft shadows, rounded corners, smooth hover transitions, and animated bulb glow effects.

---

## 🧭 Features

### Navigation
- Sticky top navigation bar with logo, section links (Dashboard, Weekly Schedule, About), and a responsive hamburger menu for mobile.

### Hero Section
- Live-updating current date, time (HH:MM:SS), and day of the week.

### Control Dashboard
- Displays the current day.
- **Holiday toggle switch** — mark today as a holiday.
- **Apply Schedule** button — executes the scheduling logic.
- **Reset** button — clears all lights and log messages back to default state.

### Street Light Panel
- Six custom circular bulb indicators (not plain checkboxes).
- **ON** → glowing yellow bulb with a pulsing animation.
- **OFF** → dim grey bulb.

### Scheduling Logic
| Day | Lights ON |
|---|---|
| Monday | 1, 3, 5 |
| Tuesday | 2, 4, 6 |
| Wednesday | 1, 3, 5 |
| Thursday | 2, 4, 6 |
| Friday | 1, 3, 5 |
| Saturday | 2, 4, 6 |
| Sunday | No Scheduled Lights |

### Holiday Auto-Shift Logic
If the **Holiday** checkbox is checked, the schedule automatically shifts to the **next valid day** (Sunday is always skipped as a target):

- Monday Holiday → Tuesday's schedule runs → Lights ON: 2, 4, 6
- Friday Holiday → Saturday's schedule runs → Lights ON: 2, 4, 6
- Saturday Holiday → Monday's schedule runs → Lights ON: 1, 3, 5 (Sunday is skipped)

### Status Card
Live activity log showing messages such as:
- `Schedule Executed Successfully`
- `Holiday Detected on Monday.`
- `Schedule Shifted to Tuesday.`
- `Lights Activated: 2,4,6`
- A "Last Updated" timestamp

### Weekly Schedule Table
A clean, sortable-style table listing every day's scheduled lights, with the current day visually highlighted.

### Statistics Cards
- Current Active Lights (e.g. `3 / 6`)
- Current Day
- Holiday Status (Yes/No)
- Electricity Saved (demo percentage)
- Power Consumption (demo wattage estimate)

### Animations
- Fade-in reveal for cards and sections on scroll (IntersectionObserver).
- Button hover and press animations.
- Pulsing glow animation for active bulbs.
- Smooth toggle switch transition.
- Page loading animation on initial load.

### Responsive Design
Fully responsive layouts optimized for:
- **Desktop** (multi-column dashboard & stats grid)
- **Tablet** (adaptive grid collapsing)
- **Mobile** (hamburger navigation, stacked cards, 2-column light grid)

---

## 🧩 JavaScript Architecture

All logic lives in `js/app.js`, organized into clearly commented functions:

| Function | Purpose |
|---|---|
| `getCurrentDay()` | Returns today's day name |
| `getNextDay(day)` | Returns the next valid day (skips Sunday) |
| `shiftSchedule(day, isHoliday)` | Computes the effective day to schedule |
| `getScheduledLights(day)` | Returns the lights array for a given day |
| `updateLights(lights)` | Updates bulb visuals (ON/OFF) |
| `updateStatus(message, type)` | Appends a message to the status log |
| `updateStatistics()` | Refreshes all statistic card values |
| `displayCurrentTime()` | Updates the live date/time/day display |
| `applySchedule()` | Main handler for the Apply Schedule button |
| `resetDashboard()` | Resets the entire dashboard to default state |
| `buildLightsPanel()` | Dynamically generates the 6 bulb indicators |
| `buildScheduleTable()` | Dynamically generates the weekly schedule table |

---

## 🛠️ Technology Stack

- **HTML5** — Semantic structure
- **CSS3** — Custom properties, Flexbox, Grid, animations, glassmorphism
- **Vanilla JavaScript (ES6+)** — No frameworks or external libraries

---

## 📌 Notes

- All electricity savings and power consumption values are **demo/simulated figures** intended to illustrate dashboard functionality, not real IoT sensor readings.
- The system uses the browser's local date/time (`Date` object) to determine the current day.

---

## 👨‍💻 Developed For

**Smart City Innovation Project**

---

## 📄 License

This project is free to use for educational and demonstration purposes.
