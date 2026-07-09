/* ==========================================================================
   SMART ADAPTIVE STREET LIGHT SYSTEM - MAIN APPLICATION SCRIPT
   Author: Smart City Innovation Project
   Description: Handles clock display, light scheduling, holiday shifting
                logic, dashboard rendering, and UI interactions.
   ========================================================================== */

/* -------------------- GLOBAL CONSTANTS -------------------- */

// Order of days used for holiday-shift calculations (Sunday = index 0)
const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Weekly schedule map: which lights turn ON for each day.
// Sunday intentionally has no scheduled lights.
const WEEKLY_SCHEDULE = {
  Monday: [1, 3, 5],
  Tuesday: [2, 4, 6],
  Wednesday: [1, 3, 5],
  Thursday: [2, 4, 6],
  Friday: [1, 3, 5],
  Saturday: [2, 4, 6],
  Sunday: [], // No Scheduled Lights
};

// Total number of street lights in the panel
const TOTAL_LIGHTS = 6;

// Approximate power draw per active light (Watts) - used for demo stats
const POWER_PER_LIGHT_WATTS = 90;

/* -------------------- APPLICATION STATE -------------------- */

const appState = {
  activeLights: [],     // Array of currently active light numbers, e.g. [1,3,5]
  isHoliday: false,     // Whether the holiday checkbox is checked
  effectiveDay: "",     // The day whose schedule is actually applied (after shift)
  originalDay: "",      // The real current day (before any shift)
};

/* ==========================================================================
   CORE UTILITY FUNCTIONS
   ========================================================================== */

/**
 * getCurrentDay
 * Returns the current day of the week as a full string name (e.g. "Monday").
 * @returns {string} current day name
 */
function getCurrentDay() {
  const today = new Date();
  return DAY_NAMES[today.getDay()];
}

/**
 * getNextDay
 * Given a day name, returns the next day in the weekly cycle.
 * Sunday is skipped when shifting forward due to holidays, per business rule
 * "Do not schedule Sunday" -> if the next day lands on Sunday, continue to Monday.
 * @param {string} dayName - current day name
 * @returns {string} next valid day name (never returns "Sunday")
 */
function getNextDay(dayName) {
  const currentIndex = DAY_NAMES.indexOf(dayName);
  let nextIndex = (currentIndex + 1) % DAY_NAMES.length;

  // Skip Sunday entirely when auto-shifting for holidays
  if (DAY_NAMES[nextIndex] === "Sunday") {
    nextIndex = (nextIndex + 1) % DAY_NAMES.length; // move to Monday
  }

  return DAY_NAMES[nextIndex];
}

/**
 * shiftSchedule
 * Determines the effective day to use for scheduling.
 * If holiday mode is active, the schedule shifts forward to the next valid day.
 * @param {string} realDay - the actual current day
 * @param {boolean} isHoliday - whether today is marked as a holiday
 * @returns {string} the effective day whose schedule should be executed
 */
function shiftSchedule(realDay, isHoliday) {
  if (!isHoliday) {
    return realDay;
  }
  return getNextDay(realDay);
}

/**
 * getScheduledLights
 * Retrieves the list of lights that should be ON for a given day.
 * @param {string} dayName
 * @returns {number[]} array of light numbers
 */
function getScheduledLights(dayName) {
  return WEEKLY_SCHEDULE[dayName] || [];
}

/* ==========================================================================
   DATE & TIME DISPLAY
   ========================================================================== */

/**
 * displayCurrentTime
 * Updates the hero section's date, time, and day displays live.
 * Called once immediately, then every second via setInterval.
 */
function displayCurrentTime() {
  const now = new Date();

  // Format date as "07 July 2026"
  const dateOptions = { day: "2-digit", month: "long", year: "numeric" };
  const formattedDate = now.toLocaleDateString("en-US", dateOptions);

  // Format time as "14:32:07" (24-hour with seconds)
  const formattedTime = now.toLocaleTimeString("en-GB", { hour12: false });

  const dayName = getCurrentDay();

  // Update DOM elements
  document.getElementById("currentDate").textContent = formattedDate;
  document.getElementById("currentTime").textContent = formattedTime;
  document.getElementById("currentDayHero").textContent = dayName;
}

/* ==========================================================================
   LIGHT PANEL RENDERING
   ========================================================================== */

/**
 * buildLightsPanel
 * Dynamically generates the six street light indicator elements inside the
 * lights grid container. Runs once on page load.
 */
function buildLightsPanel() {
  const lightsGrid = document.getElementById("lightsGrid");
  lightsGrid.innerHTML = ""; // Clear any existing content

  for (let lightNumber = 1; lightNumber <= TOTAL_LIGHTS; lightNumber++) {
    // Container for a single light unit
    const lightUnit = document.createElement("div");
    lightUnit.className = "light-unit";
    lightUnit.id = `light-unit-${lightNumber}`;

    // Circular bulb indicator (attractive custom indicator, not a checkbox)
    const bulb = document.createElement("div");
    bulb.className = "bulb off";
    bulb.id = `bulb-${lightNumber}`;
    bulb.setAttribute("role", "img");
    bulb.setAttribute("aria-label", `Light ${lightNumber} status indicator`);

    // Pole beneath the bulb for visual realism
    const pole = document.createElement("div");
    pole.className = "light-pole";

    // Label text e.g. "Light 1"
    const label = document.createElement("span");
    label.className = "light-label";
    label.textContent = `Light ${lightNumber}`;

    // Status pill e.g. "ON" / "OFF"
    const statusText = document.createElement("span");
    statusText.className = "light-status-text off";
    statusText.id = `status-text-${lightNumber}`;
    statusText.textContent = "OFF";

    lightUnit.appendChild(bulb);
    lightUnit.appendChild(pole);
    lightUnit.appendChild(label);
    lightUnit.appendChild(statusText);
    lightsGrid.appendChild(lightUnit);
  }
}

/**
 * updateLights
 * Applies the visual ON/OFF state to each bulb based on the array of
 * active light numbers currently stored in appState.
 * @param {number[]} activeLightNumbers - lights that should glow ON
 */
function updateLights(activeLightNumbers) {
  for (let lightNumber = 1; lightNumber <= TOTAL_LIGHTS; lightNumber++) {
    const bulb = document.getElementById(`bulb-${lightNumber}`);
    const statusText = document.getElementById(`status-text-${lightNumber}`);
    const isOn = activeLightNumbers.includes(lightNumber);

    if (isOn) {
      bulb.classList.remove("off");
      bulb.classList.add("on");
      statusText.classList.remove("off");
      statusText.classList.add("on");
      statusText.textContent = "ON";
    } else {
      bulb.classList.remove("on");
      bulb.classList.add("off");
      statusText.classList.remove("on");
      statusText.classList.add("off");
      statusText.textContent = "OFF";
    }
  }

  // Persist state and refresh statistics after every light update
  appState.activeLights = activeLightNumbers;
  updateStatistics();
}

/* ==========================================================================
   STATUS LOG
   ========================================================================== */

/**
 * updateStatus
 * Appends a new status message to the status log panel.
 * @param {string} message - the text to display
 * @param {string} type - "success" | "warning" | "info"
 */
function updateStatus(message, type = "info") {
  const statusLog = document.getElementById("statusLog");

  const statusMessage = document.createElement("p");
  statusMessage.className = `status-message status-${type}`;
  statusMessage.textContent = message;

  statusLog.appendChild(statusMessage);

  // Auto-scroll to the latest message
  statusLog.scrollTop = statusLog.scrollHeight;

  // Update the "Last Updated" timestamp
  const now = new Date();
  document.getElementById("lastUpdatedTime").textContent =
    now.toLocaleTimeString("en-GB", { hour12: false });
}

/**
 * clearStatusLog
 * Removes all messages from the status log (used during reset).
 */
function clearStatusLog() {
  const statusLog = document.getElementById("statusLog");
  statusLog.innerHTML =
    '<p class="status-message status-info">System initialized. Awaiting schedule execution.</p>';
}

/* ==========================================================================
   STATISTICS PANEL
   ========================================================================== */

/**
 * updateStatistics
 * Refreshes all statistic cards (active light count, current day, holiday
 * status, electricity saved, and power consumption estimate).
 */
function updateStatistics() {
  const activeCount = appState.activeLights.length;

  // Active Lights
  document.getElementById("statActiveLights").textContent = `${activeCount} / ${TOTAL_LIGHTS}`;

  // Current Day
  document.getElementById("statCurrentDay").textContent = appState.originalDay || getCurrentDay();

  // Holiday Status
  document.getElementById("statHolidayStatus").textContent = appState.isHoliday ? "Yes" : "No";

  // Electricity Saved (demo calculation: fewer active lights => higher savings)
  const savingsPercentage = Math.round(((TOTAL_LIGHTS - activeCount) / TOTAL_LIGHTS) * 60 + 20);
  document.getElementById("statElectricitySaved").textContent = `${savingsPercentage}%`;

  // Power Consumption (demo calculation based on active lights)
  const powerConsumption = activeCount * POWER_PER_LIGHT_WATTS;
  document.getElementById("statPowerConsumption").textContent = `${powerConsumption} W`;
}

/* ==========================================================================
   WEEKLY SCHEDULE TABLE
   ========================================================================== */

/**
 * buildScheduleTable
 * Dynamically generates the weekly schedule table rows and highlights
 * the row matching today's actual day.
 */
function buildScheduleTable() {
  const tableBody = document.getElementById("scheduleTableBody");
  tableBody.innerHTML = "";

  const todayName = getCurrentDay();
  const orderedDays = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  orderedDays.forEach((day) => {
    const row = document.createElement("tr");

    if (day === todayName) {
      row.classList.add("current-day-row");
    }

    const lights = WEEKLY_SCHEDULE[day];
    const lightsText = lights.length > 0 ? lights.join(", ") : "No Schedule";
    const isActive = lights.length > 0;

    row.innerHTML = `
      <td>${day}</td>
      <td>${lightsText}</td>
      <td><span class="badge-status ${isActive ? "active" : "inactive"}">
        ${isActive ? "Active" : "No Schedule"}
      </span></td>
    `;

    tableBody.appendChild(row);
  });
}

/* ==========================================================================
   DASHBOARD CONTROL FUNCTIONS
   ========================================================================== */

/**
 * applySchedule
 * Main handler triggered by the "Apply Schedule" button.
 * Determines the real day, checks holiday state, shifts the schedule if
 * necessary, updates lights, and logs status messages.
 */
function applySchedule() {
  const realDay = getCurrentDay();
  const isHoliday = document.getElementById("holidayCheckbox").checked;

  appState.originalDay = realDay;
  appState.isHoliday = isHoliday;

  // Sunday should never be scheduled, holiday or not
  if (realDay === "Sunday" && !isHoliday) {
    appState.effectiveDay = "Sunday";
    updateLights([]);
    updateStatus("Today is Sunday. No Scheduled Lights.", "warning");
    return;
  }

  if (isHoliday) {
    updateStatus(`Holiday Detected on ${realDay}.`, "warning");

    const shiftedDay = shiftSchedule(realDay, true);
    appState.effectiveDay = shiftedDay;

    updateStatus(`Schedule Shifted to ${shiftedDay}.`, "info");

    const scheduledLights = getScheduledLights(shiftedDay);
    updateLights(scheduledLights);

    if (scheduledLights.length > 0) {
      updateStatus(`Lights Activated: ${scheduledLights.join(",")}`, "success");
    } else {
      updateStatus("No Scheduled Lights for shifted day.", "warning");
    }

    updateStatus("Schedule Executed Successfully", "success");
  } else {
    // Normal day - no holiday shift needed
    appState.effectiveDay = realDay;
    const scheduledLights = getScheduledLights(realDay);
    updateLights(scheduledLights);

    if (scheduledLights.length > 0) {
      updateStatus(`Lights Activated: ${scheduledLights.join(",")}`, "success");
    } else {
      updateStatus("No Scheduled Lights for today.", "warning");
    }

    updateStatus("Schedule Executed Successfully", "success");
  }

  // Refresh the "Today" display value in the control card
  document.getElementById("todayDisplay").textContent = realDay;
}

/**
 * resetDashboard
 * Resets the dashboard to its default state: turns off all lights,
 * unchecks the holiday box, clears the status log, and resets statistics.
 */
function resetDashboard() {
  // Uncheck holiday checkbox
  document.getElementById("holidayCheckbox").checked = false;

  // Reset application state
  appState.isHoliday = false;
  appState.effectiveDay = "";
  appState.originalDay = getCurrentDay();

  // Turn off all lights
  updateLights([]);

  // Clear status log and show a reset message
  clearStatusLog();
  updateStatus("Dashboard Reset Successfully. All lights turned OFF.", "info");

  // Refresh the today display
  document.getElementById("todayDisplay").textContent = getCurrentDay();
}

/* ==========================================================================
   NAVIGATION & UI INTERACTIONS
   ========================================================================== */

/**
 * setupMobileNavigation
 * Wires up the hamburger menu toggle for small-screen navigation.
 */
function setupMobileNavigation() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("navLinks");

  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  });

  // Close mobile menu when a link is clicked
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navLinks.classList.remove("active");
    });
  });
}

/**
 * setupActiveNavHighlight
 * Highlights the nav link corresponding to the section currently in view.
 */
function setupActiveNavHighlight() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute("id");

          navLinks.forEach((link) => {
            link.classList.remove("active");
            if (link.getAttribute("href") === `#${sectionId}`) {
              link.classList.add("active");
            }
          });
        }
      });
    },
    { rootMargin: "-40% 0px -50% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/**
 * setupFadeInAnimations
 * Uses IntersectionObserver to reveal elements with the "fade-in" class
 * as they scroll into the viewport.
 */
function setupFadeInAnimations() {
  const fadeElements = document.querySelectorAll(".fade-in");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  fadeElements.forEach((el) => observer.observe(el));
}

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */

/**
 * initializeDashboard
 * Sets initial values for the "Today" display and current day stat
 * before any button interaction occurs.
 */
function initializeDashboard() {
  const realDay = getCurrentDay();
  appState.originalDay = realDay;

  document.getElementById("todayDisplay").textContent = realDay;
  document.getElementById("statCurrentDay").textContent = realDay;

  // Initialize lights as OFF until the user applies the schedule
  updateLights([]);
}

/**
 * setupEventListeners
 * Centralizes all DOM event bindings for dashboard controls.
 */
function setupEventListeners() {
  document.getElementById("applyScheduleBtn").addEventListener("click", applySchedule);
  document.getElementById("resetBtn").addEventListener("click", resetDashboard);
}

/**
 * updateFooterYear
 * Sets the current year dynamically in the footer copyright line.
 */
function updateFooterYear() {
  document.getElementById("footerYear").textContent = new Date().getFullYear();
}

/**
 * runApp
 * Main entry point. Runs once the DOM is fully loaded.
 */
function runApp() {
  // Build dynamic UI components
  buildLightsPanel();
  buildScheduleTable();

  // Initialize dashboard default state
  initializeDashboard();

  // Start live clock (immediate call + interval every second)
  displayCurrentTime();
  setInterval(displayCurrentTime, 1000);

  // Wire up buttons and navigation
  setupEventListeners();
  setupMobileNavigation();
  setupActiveNavHighlight();
  setupFadeInAnimations();
  updateFooterYear();

  // Hide the page loader once everything is ready
  const loader = document.getElementById("pageLoader");
  if (loader) {
    setTimeout(() => loader.classList.add("hidden"), 500);
  }
}

// Wait for the DOM to be fully parsed before running the app
document.addEventListener("DOMContentLoaded", runApp);
