const units = document.querySelector(".units");
const unitsDrop = document.querySelector(".units-dropdown");
const search = document.querySelector(".search-field");
const dayDrop = document.querySelector(".dropdown-day");
// Find dropdowns that live inside the control wrappers
const cityDrop = search ? search.querySelector('.city-dropdown') : null;
const daysDrop = dayDrop ? dayDrop.querySelector('.days-dropdown') : null;
const unitSwitch = unitsDrop ? unitsDrop.querySelector('.unit-switch') : undefined;



/** MAIN UI STATE MANAGEMENT */
// Craete a class to handle the UI state on loading, change of units and on city search
const weatherInfo = {
  isMetric: true,

  // toggle unit state
  toggle() {
    // change state of the metric units
    this.isMetric = !this.isMetric;
    // update the Metric unit UI
    this.updateMetricUI();
    // add to storage
    this.saveStorage();
    // show action done
    console.log(this.isMetric);
  },

  // update metric info UI
  updateMetricUI() {
    // change text content works
    unitSwitch.textContent = this.isMetric
      ? "Switch to Imperial"
      : "Switch to Metric";

    // show/hide unit elements based on current state using Tailwind 'invisible' utility
    document.querySelectorAll("[data-unit]").forEach((element) => {
      // determine if the element should be active
      const isActive =
        element.dataset.unit === (this.isMetric ? "metric" : "imperial");
      console.log(isActive);

      // toggle the bg-color based on active state
      element.classList.toggle("bg-Neutral700", isActive);
      // toggle checkmark visibility based on actve state
      element.querySelector("img").classList.toggle("invisible", !isActive);
    });
    // show action done
    console.log("metric ui updated");

    this.updateDashboard();
  },

  // update dashboard UI based on city weather info and metric
  updateDashboard() {
    const city = {
  fetch() {
    console.log("city fetched");
  }};

city.fetch();
    console.log("dashboard updated");
  },

  loadStorage() {
    console.log("loaded");
  },

  saveStorage() {
    console.log("saved to storage");
  },
};
unitSwitch.addEventListener("click", () => {
  weatherInfo.toggle();
});

/** SEARCH AND FETCH FUNCTIONALITY */


/** Dropdown controls */
// Helper to set up a control + dropdown pair
function setupDrop(control, dropdown) {
  if (!control || !dropdown) return;
  // enable clicks within control and disable outside it
  control.addEventListener("click", (e) => {
    if (dropdown.contains(e.target)) return;
    dropdown.classList.toggle("invisible");
  });
  control.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === "") {
      e.preventDefault();
      dropdown.classList.toggle("invisible");
    }
  });
}
// Set up pairs
setupDrop(units, unitsDrop);
setupDrop(dayDrop, daysDrop);

// Close any open dropdown when clicking outside its control
document.addEventListener("click", (e) => {
  if (units && unitsDrop && !units.contains(e.target))
    unitsDrop.classList.add("invisible");
  if (search && cityDrop && !search.contains(e.target))
    cityDrop.classList.add("invisible");
  if (dayDrop && daysDrop && !dayDrop.contains(e.target))
    daysDrop.classList.add("invisible");
});

/**Daydropdown control */
const activeDay = document.querySelector(".day-select");
const days = document.querySelectorAll(".days");

days.forEach((day) => {
  day.addEventListener("click", () => {
    console.log(day.textContent);
    activeDay.textContent = day.textContent;
  });
});






