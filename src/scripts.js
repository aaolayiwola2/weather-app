/* eslint-disable no-useless-catch */

/**UI - SELECTORS and CONFIG */

const UI = {
  API_KEY: "bdc_af1d139602bc4b94b2135995ed6d8abb",
  allDays: [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ],

  allMonths: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],

  today: new Date(Date.now()),

  dayId: new Date(Date.now()).getDay(),

  units: document.querySelector(".units"),

  unitsDrop: document.querySelector(".units-dropdown"),

  search: document.querySelector(".search-field"),

  cityName: document.querySelector(".city-name"),

  button: document.querySelector(".search-button"),
  
  // Find dropdowns that live inside the control wrappers

  cityDrop: document.querySelector(".city-dropdown") || null,

  daysDrop: document.querySelector(".days-dropdown") || null,

  unitSwitch: document.querySelector(".unit-switch") || null,

  unitsElement: document.querySelectorAll("[data-unit]"),

  activeDay: document.querySelector(".day-select"),

  days: document.querySelectorAll(".days"),

  currentDay: document.querySelector(".current-day"),
  currentMonth: document.querySelector(".current-month"),
  currentDate: document.querySelector(".current-date"),
  currentYear: document.querySelector(".current-year"),

  // All Dynamic weather data
  currentTemp: document.querySelector(".current-temp"),
  weatherIcon: document.querySelector(".current-icon"),
  currentFeel: document.querySelector(".current-feel"),
  currentHumidity: document.querySelector(".current-humidity"),
  currentWind: document.querySelector(".current-wind"),
  currentPrecipitation: document.querySelector(".current-precipitation"),

  // daily weather data
  dailyTemp: document.querySelectorAll(".daily-temp"),
  dailyAppTemp: document.querySelectorAll(".daily-app-temp"),
  dayName: document.querySelectorAll(".daily-day"),
  dayIcon: document.querySelectorAll(".daily-icon"),

  // hourly container (Selecting the parent instead of individual items)
  hourlyForecastContainer: document.querySelector(".hourly-forecast"),
  
  // View Containers
  weatherView: document.querySelector("#weather-view"),
  loadingView: document.querySelector("#loading-view"),
  errorView: document.querySelector("#error-view"),
};

/**
 * WMO Weather Code Map
 * Keys: Numeric WMO codes from Open-Meteo
 * Values: String filenames/identifiers for your icons
 */
const WeatherIconMap = {
  // Clear sky
  0: "sunny",

  // Mainly clear, partly cloudy
  1: "partly-cloudy",
  2: "partly-cloudy",

  // Overcast
  3: "overcast",

  // Fog and depositing rime fog
  45: "fog",
  48: "fog",

  // Drizzle: Light, moderate, and dense intensity
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",

  // Freezing Drizzle: Light and dense intensity
  56: "drizzle",
  57: "drizzle",

  // Rain: Slight, moderate and heavy intensity
  61: "rain",
  63: "rain",
  65: "rain",

  // Freezing Rain: Light and heavy intensity
  66: "rain",
  67: "rain",

  // Snow fall: Slight, moderate, and heavy intensity
  71: "snow",
  73: "snow",
  75: "snow",

  // Snow grains
  77: "snow",

  // Rain showers: Slight, moderate, and violent
  80: "rain",
  81: "rain",
  82: "rain",

  // Snow showers slight and heavy
  85: "snow",
  86: "snow",

  // Thunderstorm: Slight or moderate
  95: "storm",

  // Thunderstorm with slight and heavy hail
  96: "storm",
  99: "storm",
};

/** STATE MANAGEMENT - BRAIN*/

// Craete a class to handle the UI state on loading, change of units and on city search

const AppState = {
  isMetric: true,

  init() {
    Controller.unitControl();

    Controller.dropControl(UI.units, UI.unitsDrop);

    Controller.dropControl(UI.activeDay, UI.daysDrop);

    Controller.daysControl();

    Controller.searchControl();

    Controller.suggestionsControl();
    
    // Initialize Search Button Logic
    Controller.searchButtonControl();

    WeatherService.initWeatherOnLoad();
  },

  // toggle unit state

  toggleUnits() {
    // change state of the metric units
    this.isMetric = !this.isMetric;
    // add to storage
    this.saveUnit();
    // update the Metric unit UI
    RenderUI.updateMetricUI();
  },

  saveUnit() {
    localStorage.setItem("isMetric", this.isMetric);
  },

  setDay(dayId) {
    // add to storage
    // this.saveStorage("dayId", dayId);

    // update the Metric unit UI
    RenderUI.updateHourlyUI(dayId);
  },
};

/** UTILS - HELPER FUNCTIONS */
const Utils = {
  debounce(func, delay) {
    let timeoutId; // 🔒 State: Held in closure, persists between keystrokes

    return (...args) => {
      // 1. If a timer is already running (elevator closing), CANCEL IT.
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      // 2. Start a new timer.
      timeoutId = setTimeout(() => {
        // 3. If no one interrupts for 'delay' ms, run the actual function.
        func.apply(null, args);
      }, delay);
    };
  },

  getWeatherIcon(code) {
    const iconName = WeatherIconMap[code];
    return iconName ? iconName : "sunny";
  },

  getBool(key, defaultValue = true) {
    const raw = localStorage.getItem(key);
    if (raw === null) return defaultValue;
    try {
      return JSON.parse(raw);
    } catch {
      return defaultValue;
    }
  },
};

/** CONTROLLER*/

const Controller = {
  unitControl() {
    if (!UI.unitSwitch) return; //safety check

    UI.unitSwitch.addEventListener("click", () => {
      AppState.toggleUnits();
    });
  },

  dropControl(control, dropdown) {
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

    // Close any open dropdown when clicking outside its control

    document.addEventListener("click", (e) => {
      if (UI.units && UI.unitsDrop && !UI.units.contains(e.target))
        UI.unitsDrop.classList.add("invisible");

      if (UI.search && UI.cityDrop && !UI.search.contains(e.target))
        UI.cityDrop.classList.add("invisible");

      if (UI.activeDay && UI.daysDrop && !UI.activeDay.contains(e.target))
        UI.daysDrop.classList.add("invisible");
    });
  },
  // Inside Controller object
  daysControl() {
    UI.days.forEach((day, index) => {
      // Added index here
      day.addEventListener("click", (e) => {
        e.stopPropagation();

        // 1. Update active day text
        UI.activeDay.textContent = e.target.textContent;
        UI.activeDay.dataset.selectedId = index;


        // 2. Hide Dropdown
        UI.daysDrop.classList.add("invisible");

        // 3. GET DATA
        const { hours, hourlyCode, hourlyTempData, hourlyAppTempData } =
          JSON.parse(localStorage.getItem("hourly") || "{}");

        const fullData = {
          hours,
          hourlyCode,
          hourlyTempData,
          hourlyAppTempData,
        };

        // 4. TRIGGER THE RENDER UPDATE FOR THIS SPECIFIC DAY
        // We call the helper function we created in Step 1
        RenderUI.updateHourlyCards(index, fullData);
      });
    });
  },
  // Inside Controller object
  searchControl() {
    // 1. We use the Utils.debounce tool we created.
    // 2. We pass it the function we want to run (handleSearch).
    // 3. We tell it to wait 500ms after the LAST keystroke.
    // Note: We use .bind(WeatherService) to ensure 'this' works correctly inside handleSearch
    const debouncedHandler = Utils.debounce(
      WeatherService.handleSearch.bind(WeatherService),
      500,
    );

    // 4. We attach this SPECIAL handler to the input event.
    UI.search.addEventListener("input", debouncedHandler);
  },

  suggestionsControl() {
    UI.cityDrop.addEventListener("click", (e) => {
      const options = e.target.closest(".city-options");
      if (!options) return;
      const { lat, lon, city, country } = options.dataset;

      UI.search.value = "";
      UI.cityDrop.classList.add("invisible");

      // fetch weather data
      WeatherService.fetchWeatherData(
        {
          lat: parseFloat(lat),
          lon: parseFloat(lon),
        },
        { city, country },
      );
    });
  },

  searchButtonControl() {
    if (!UI.button) return;

    UI.button.addEventListener("click", (e) => {
      e.preventDefault(); 

      // 1. GET DATA NOW (Inside the click, not outside)
      const topCity = Utils.getBool("suggestions", null);

      if (!topCity) {
        console.warn("No city found to search");
        return;
      }

      // 2. Extract Data
      const lat = topCity.latitude;
      const lon = topCity.longitude;
      const city = topCity.name;
      
      let country = topCity.country;
      if (country === "Israel" || !country) {
        country = "Palestine ˗ˏˋ 🍉 ˎˊ˗";
      }

      const coords = { lat, lon };
      const location = { city, country };

      UI.search.value = "";
      UI.cityDrop.innerHTML = "";
      UI.cityDrop.classList.add("invisible");

      WeatherService.fetchWeatherData(coords, location);
    });
  },
};

/** LOGIC/RENDER */

const RenderUI = {
  
  // NEW: The View Switcher
  switchView(state) {
    // 1. Hide everything first
    if(UI.weatherView) UI.weatherView.classList.add("hidden");
    if(UI.loadingView) UI.loadingView.classList.add("hidden");
    if(UI.errorView) UI.errorView.classList.add("hidden");

    // 2. Show the specific state
    if (state === "loading" && UI.loadingView) {
      UI.loadingView.classList.remove("hidden");
    } else if (state === "error" && UI.errorView) {
      UI.errorView.classList.remove("hidden");
    } else if (state === "success" && UI.weatherView) {
      UI.weatherView.classList.remove("hidden");
    }
  },

  updateDashboard(location, weather) {

    // update the City and country nmae
    UI.cityName.textContent = `${location.city}, ${location.country}`;

    // update the Date
    const day = UI.allDays[UI.dayId];
    const month = UI.allMonths[UI.today.getMonth()];
    const date = UI.today.getDate();
    const year = UI.today.getFullYear();

    UI.currentDate.textContent = date;
    UI.currentDay.textContent = day;
    UI.currentMonth.textContent = month;
    UI.currentYear.textContent = year;

    const { temp, feels_like, humidity, wind, precipitation, weathercode } =
      weather;

    UI.currentTemp.textContent = temp;
    UI.currentFeel.textContent = feels_like;
    UI.currentHumidity.textContent = humidity + "%";
    UI.currentWind.textContent = wind + (AppState.isMetric ? " kmh" : " mph");
    UI.currentPrecipitation.textContent =
      precipitation + (AppState.isMetric ? " mm" : " in");

    const iconName = Utils.getWeatherIcon(weathercode);
    const iconPath = `/assets/images/icon-${iconName}.webp`;
    UI.weatherIcon.src = iconPath;
    UI.weatherIcon.alt = iconName;

    // RenderUI.updateHourlyUI(UI.dayId, hourlyWeather)
  },

  updateDailyUI(data) {
    const { days, dailyCode, dailyTempData, dailyAppTempData } = data;

    // creat a new array to get shortened days
    const shortDays = UI.allDays.map((day) => {
      return day.slice(0, 3);
    });

    const dayNames = days.map((dayString) => {
      // create a code based on the current day
      const newDay = new Date(dayString);
      const dayIndex = newDay.getDay();
      return shortDays[dayIndex];
    });

    // loop over each value of the daily temp array data
    for (let index = 0; index < UI.dailyTemp.length; index++) {
      // assign each of these h2 text content as the value of the data
      UI.dayName[index].textContent = dayNames[index];
      UI.dailyTemp[index].textContent = dailyTempData[index];
      UI.dailyAppTemp[index].textContent = dailyAppTempData[index];

      const iconName = Utils.getWeatherIcon(dailyCode[index]);
      const iconPath = `/assets/images/icon-${iconName}.webp`;
      UI.dayIcon.forEach((icon) => {
        icon.src = iconPath;
        icon.alt = iconName;
      });
    }
  },

  processDays(daysData) {
    // return just 7 of the 168 codes in the array
    let days = [];
    for (let index = 0; index < daysData.length; index += 24) {
      days.push(daysData[index]);
    }

    // return all the 7 names as actual days
    return days.map((dayString) => {
      const newDay = new Date(dayString);
      const dayIndex = newDay.getDay();
      return UI.allDays[dayIndex];
    });
  },

  processHours(hoursData) {
    // filter out the hours
    let allHours = [];
    for (let index = 0; index < 24; index++) {
      allHours.push(hoursData[index]);
    }

    const hourNames = allHours.map((hourString) => {
      return new Date(hourString).getHours();
    });

    // process the array to write hours in standard format (0- 12 AM, 13 - 1 PM)
    return hourNames.map((hour) => {
      if (hour === 0) return "12 AM";
      if (hour < 12) return `${hour} AM`;
      if (hour === 12) return "12 PM";
      return `${hour - 12} PM`;
    });
  },

  updateHourlyUI(data) {
    const { hours } = data;

    // process the hours array and bring out just the 7 days
    const dayNames = this.processDays(hours);

    // generate the days dropdown
    for (let dayId = 0; dayId < UI.allDays.length; dayId++) {
      UI.days[dayId].textContent = dayNames[dayId];

      // Select the first day by default
      UI.activeDay.textContent = dayNames[0];
      UI.activeDay.dataset.selectedId = 0;

      // "Paint the cards for the first day immediately"
      this.updateHourlyCards(0, data);
    }
  },

  updateHourlyCards(index, data) {
    // Get the data for the specific day (24 hours)
    const hourlyNames = this.processHours(data.hours);
    const startIndex = index * 24;
    const endIndex = startIndex + 24;
    const weatherCodes = data.hourlyCode.slice(startIndex, endIndex);
    const hourlyTemp = data.hourlyTempData.slice(startIndex, endIndex);

    // Generate HTML String dynamically
    const cardsHTML = hourlyNames.map((time, i) => {
      const iconName = Utils.getWeatherIcon(weatherCodes[i]);
      const temp = hourlyTemp[i];
      
      return `
        <div class="hour-forecast_one bg-Neutral600 flex justify-between items-center rounded-xl border border-Neutral700 text-Neutral0 font-DMSans p-2">
          <div class="flex items-center justify-center">
            <img class="hourly-icon w-8" src="/assets/images/icon-${iconName}.webp" alt="${iconName}">
            <h1 class="ml-2 font-bold">${time}</h1>
          </div>
          <h2 class="text-sm"><span class="hour-temp">${temp}</span><sup>o</sup></h2>
        </div>
      `;
    }).join("");

    // Inject into the DOM
    if(UI.hourlyForecastContainer) {
        UI.hourlyForecastContainer.innerHTML = cardsHTML;
    }
  },

  // update metric info UI
  async updateMetricUI() {
    let metricState = Utils.getBool("isMetric");

    // change text content works
    UI.unitSwitch.textContent = metricState
      ? "Switch to Imperial"
      : "Switch to Metric";

    // show/hide unit elements based on current metricState using Tailwind 'invisible' utility

    UI.unitsElement.forEach((element) => {
      // determine if the element should be active

      const isActive =
        element.dataset.unit === (metricState ? "metric" : "imperial");


      // toggle the bg-color based on active state

      element.classList.toggle("bg-Neutral700", isActive);

      // toggle checkmark visibility based on actve state

      element.querySelector("img").classList.toggle("invisible", !isActive);
    });
    // fetch data using the current unit state
    const lat = localStorage.getItem("lat");
    const lon = localStorage.getItem("lon");
    const city = localStorage.getItem("city");
    const country = localStorage.getItem("country");

    const coords = { lat, lon };
    const location = { city, country };
    WeatherService.fetchWeatherData(coords, location);
  },
};

/** THE MODEL - API CALLS AND DATA PROCESSING */

const WeatherService = {
  async initWeatherOnLoad() {
    let coords;
    let location = { city: "Minna", country: "Nigeria" }; // Your Fallback

    // 🛡️ COMPARTMENT 1: Get GPS Coordinates (Critical)
    try {
      coords = await this.getCoordinatesPromise(); // Get these FIRST
    } catch (error) {
      console.warn("GPS denied/failed. Using fallback.", error);
      // If GPS fails, we can't do anything else but use the fallback city
      coords = null;
    }

    // 🛡️ COMPARTMENT 2: Get City Name (Optional - Only if we have GPS)
    if (coords) {
      try {
        // We pass the coords to the Specialist
        location = await this.getCityNameByCoords(coords.lat, coords.lon);
      } catch (error) {
        console.warn(error.message);
      }
    }

    // Call your main fetch function (ensure this function exists!)
    await this.fetchWeatherData(coords, location);
    RenderUI.updateMetricUI();
  },

  async fetchWeatherData(query, location) {
    let lat, lon, city, country, tempUnit, windUnit, precipUnit;
    lat = query.lat;
    lon = query.lon;
    city = location.city;
    country = location.country;

    localStorage.setItem("lat", lat);
    localStorage.setItem("lon", lon);
    localStorage.setItem("city", city);
    localStorage.setItem("country", country);

    tempUnit = AppState.isMetric ? "celsius" : "fahrenheit";
    windUnit = AppState.isMetric ? "kmh" : "mph";
    precipUnit = AppState.isMetric ? "mm" : "inch";

    // PHASE 1: START (Immediate Feedback)
    RenderUI.switchView("loading"); 

    try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
            `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weathercode` +
            `&hourly=temperature_2m,apparent_temperature,weathercode` +
            `&daily=weather_code,temperature_2m_max,apparent_temperature_max` +
            `&temperature_unit=${tempUnit}` +
            `&wind_speed_unit=${windUnit}` +
            `&precipitation_unit=${precipUnit}` +
            `&timezone=auto`,
        );

        // PHASE 2: ERROR CHECKING
        if (!response.ok) {
            throw new Error("API Response was not OK");
        }

        const data = await response.json();

        if (!data.current) {
            throw new Error("Location found, but no weather data available.");
        }

        // PHASE 3: SUCCESS (Update UI)
        
        // Process Current Data
        const {
          temperature_2m,
          apparent_temperature,
          precipitation,
          wind_speed_10m,
          relative_humidity_2m,
          weathercode,
        } = data.current;

        const currentWeather = {
          temp: temperature_2m,
          feels_like: apparent_temperature,
          humidity: relative_humidity_2m,
          wind: wind_speed_10m,
          precipitation: precipitation,
          weathercode: weathercode,
          tempUnit: tempUnit,
          precipUnit: precipUnit,
          windUnit: windUnit,
        };
        RenderUI.updateDashboard({ city, country }, currentWeather);

        // Process Daily Data
        const daily = data.daily;
        const dailyWeather = {
          days: daily.time,
          dailyCode: daily.weather_code,
          dailyTempData: daily.temperature_2m_max,
          dailyAppTempData: daily.apparent_temperature_max,
        };
        RenderUI.updateDailyUI(dailyWeather);

        // Process Hourly Data
        const hourly = data.hourly;
        const hourlyWeather = {
          hours: hourly.time,
          hourlyCode: hourly.weathercode,
          hourlyTempData: hourly.temperature_2m,
          hourlyAppTempData: hourly.apparent_temperature,
        };

        localStorage.setItem(
          "hourly",
          JSON.stringify(hourlyWeather),
        );

        RenderUI.updateHourlyUI(hourlyWeather);

        // Reveal the dashboard
        RenderUI.switchView("success");

    } catch (error) {
        // PHASE 4: FAILURE
        console.error("Weather App Error:", error);
        RenderUI.switchView("error");
    }
  },

  // Takes in search input, fetches city suggestions from OpenMeteo Geo-coding, and display/closes the suggestions dynamically with the returned city data as stored as IDs in the divs.
  async handleSearch(e) {
    try {
      const value = e.target.value;

      // 1. Clear OLD suggestions immediately when new search starts
      UI.cityDrop.innerHTML = "";
      UI.cityDrop.classList.add("invisible"); // Hide until ready

      if (!value) return;

      const fetchedCities = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=10&language=en&format=json`,
      );
      const cities = await fetchedCities.json();

      // 2. Validate the data structure
      const suggestions = cities.results || []; // Fallback to empty array if undefined
      localStorage.setItem("suggestions", JSON.stringify(suggestions[0]));
      Controller.searchButtonControl();

      const shouldHide = !value || suggestions.length === 0;
      UI.cityDrop.classList.toggle("invisible", shouldHide);

      let lat, lon, city, country;
      if (!shouldHide) {
        const innerHTML = suggestions
          .map((result) => {
            // 3. Explicit Destructuring with Fallbacks
            let newCountry = result.country;
            if (newCountry === "Israel" || !newCountry) {
              newCountry = "Palestine ˗ˏˋ 🍉 ˎˊ˗";
            }
            // Open-Meteo sometimes returns 'undefined' for country if it's implied
            city = result.name || "Unknown Place";
            country = newCountry;
            lat = result.latitude;
            lon = result.longitude;

            // 4. Log inside the map to see exactly what is being rendered
            return `
                        <div
                            data-lat="${lat}"
                            data-lon="${lon}"
                            data-country="${country}"
                            data-city="${city}"
                            class="city-options bg-Neutral600 rounded-xl px-2 py-2 hover:cursor-pointer mb-1"
                        >
                            ${city}, ${country}
                        </div>
                    `;
          })
          .join("");
        UI.cityDrop.innerHTML = innerHTML;
      }
    } catch (error) {
      console.error("Search Error:", error);
    }
  },

  /** Role: The Data Source. Returns a Promise that resolves with {lat, lon}.*/

  getCoordinatesPromise() {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        // SUCCESS: Resolve the Promise with the coordinates object

        (position) => {
          const lat = position.coords.latitude; // FIXED: Added .coords

          const lon = position.coords.longitude; // FIXED: Added .coords

          // RESOLVE: Fulfills the Promise circuit

          resolve({ lat, lon });
        },

        // ERROR: Reject the Promise with the error message
        (error) => {
          console.warn(`Geolocation Error: ${error.message}`);

          // REJECT: Allows the consuming 'try...catch' to activate

          reject(error.message);
        },
      );
    });
  },

  /** Helper: Takes Lat/Lon -> Returns Object { cityName, countryCode }*/
  async getCityNameByCoords(lat, lon) {
    // Note: Use HTTPS to avoid mixed content warnings
    const url = `https://api-bdc.net/data/reverse-geocode?latitude=${lat}&longitude=${lon}&localityLanguage=en&key=${UI.API_KEY}`;

    try {
      const response = await fetch(url);

      if (!response.ok) throw new Error("Reverse Geo failed");

      const rawData = await response.json();
      const name = rawData.city;
      if (name) {
        return {
          city: rawData.city,
          country: rawData.countryName,
        };
      } else {
        throw new Error("City not found");
      }
    } catch (error) {
      // If the Specialist fails, just throw the error to the Manager
      throw error;
    }
  },
};

// 🚀 Lift off

document.addEventListener("DOMContentLoaded", () => {
  AppState.init();
});