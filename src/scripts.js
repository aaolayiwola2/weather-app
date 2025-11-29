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

  units: document.querySelector(".units"),

  unitsDrop: document.querySelector(".units-dropdown"),

  search: document.querySelector(".search-field"),

  daySelect: document.querySelector(".day-select"),

  cityName: document.querySelector(".city-name"),

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

  // hourly weather data
  hourTemp: document.querySelectorAll("hour-temp"),
};

/**
 * WMO Weather Code Map
 * Keys: Numeric WMO codes from Open-Meteo
 * Values: String filenames/identifiers for your icons
 */
const WeatherIconMap = {
  // Clear sky
  "0": "sunny",

  // Mainly clear, partly cloudy
  "1": "partly-cloudy",
  "2": "partly-cloudy",

  // Overcast
  "3": "overcast",

  // Fog and depositing rime fog
  "45": "fog",
  "48": "fog",

  // Drizzle: Light, moderate, and dense intensity
  "51": "drizzle",
  "53": "drizzle",
  "55": "drizzle",

  // Freezing Drizzle: Light and dense intensity
  "56": "drizzle",
  "57": "drizzle",

  // Rain: Slight, moderate and heavy intensity
  "61": "rainy",
  "63": "rainy",
  "65": "rainy",

  // Freezing Rain: Light and heavy intensity
  "66": "rainy",
  "67": "rainy",

  // Snow fall: Slight, moderate, and heavy intensity
  "71": "snow",
  "73": "snow",
  "75": "snow",

  // Snow grains
  "77": "snow",

  // Rain showers: Slight, moderate, and violent
  "80": "rainy",
  "81": "rainy",
  "82": "rainy",

  // Snow showers slight and heavy
  "85": "snow",
  "86": "snow",

  // Thunderstorm: Slight or moderate
  "95": "storm",

  // Thunderstorm with slight and heavy hail
  "96": "storm",
  "99": "storm"
};

/** STATE MANAGEMENT - BRAIN*/

// Craete a class to handle the UI state on loading, change of units and on city search

const AppState = {
  isMetric: true,

  init() {
    Controller.unitControl();

    Controller.dropControl(UI.units, UI.unitsDrop);

    Controller.dropControl(UI.daySelect, UI.daysDrop);

    Controller.daysControl();

    Controller.searchControl();

    Controller.suggestionsControl();

    this.loadStorage();

    WeatherService.initWeatherOnLoad();
  },

  // toggle unit state

  toggleUnits() {
    // change state of the metric units

    this.isMetric = !this.isMetric;

    // add to storage

    this.saveStorage();

    // update the Metric unit UI

    RenderUI.updateMetricUI();
  },

  setDay(dayId) {
    // add to storage
    this.saveStorage();

    // update the Metric unit UI
    RenderUI.updateHourlyUI(dayId);
  },

  loadStorage() {},

  saveStorage() {},
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

  getWeatherIcon(code){
    const iconName = WeatherIconMap[code];
    console.log(iconName);

    return iconName ? iconName : "sunny";
  }
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
      console.log(e.target);

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

      if (UI.daySelect && UI.daysDrop && !UI.daySelect.contains(e.target))
        UI.daysDrop.classList.add("invisible");
    });
  },

  daysControl() {
    UI.days.forEach((day, i) => {
      day.addEventListener("click", (e) => {
        e.stopPropagation();

        AppState.setDay(i);

        console.log(i);
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
      console.log(options.dataset);
      
      console.log( lat, lon, city, country);

      UI.search.value = "";
      UI.cityDrop.classList.add("invisible");

      // fetch weather data
      WeatherService.fetchWeatherData({
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      }, {city,country});
    });
  },
};

/** LOGIC/RENDER */

const RenderUI = {
  updateDashboard(location, weather) {
    console.log('dashboard updated');
    
    // update the City and country nmae
    UI.cityName.textContent = `${location.city}, ${location.country}`;

    // update the Date
    const today = new Date(Date.now());
    const day = UI.allDays[today.getDay()];
    const month = UI.allMonths[today.getMonth()];
    const date = today.getDate();
    const year = today.getFullYear();

    UI.currentDate.textContent = date;
    UI.currentDay.textContent = day;
    UI.currentMonth.textContent = month;
    UI.currentYear.textContent = year;

    const { temp, feels_like, humidity, wind, precipitation, weathercode } =
    weather;
    console.log(weather);
    

    UI.currentTemp.textContent = temp;
    UI.currentFeel.textContent = feels_like;
    UI.currentHumidity.textContent = humidity + "%";
    UI.currentWind.textContent = wind + (AppState.isMetric ? " kmh" : " mph");
    UI.currentPrecipitation.textContent = precipitation + (AppState.isMetric ? " mm" : " in");

    const iconName = Utils.getWeatherIcon(weathercode)
    const iconPath = `/assets/images/icon-${iconName}.webp`;
    UI.weatherIcon.src = iconPath;
    UI.weatherIcon.alt = iconName;
  },

async updateDailyUI(data){
  console.log("daily update");
  const {days, dailyCode, dailyTempData, dailyAppTempData} = data;
  console.log(dailyCode);
  
  // loop over each value of the daily temp array data
  for (let index = 0; index < UI.dailyTemp.length; index++) {
      // assign each of these h2 text content as the value of the data 
      UI.dailyTemp[index].textContent = dailyTempData[index];
      UI.dailyAppTemp[index].textContent = dailyAppTempData[index];   

      const iconName = Utils.getWeatherIcon(dailyCode[index]);
      console.log(iconName);
      
      const iconPath = `/assets/images/icon-${iconName}.webp`;
      
      UI.dayIcon.forEach((icon) => {
        icon.src = iconPath;
        icon.alt = iconName;
      })
    }
    for (let i = 0; i < UI.allDays.length; i++) {
      UI.allDays.forEach((day)=> {
        const newDay = day.slice(0,3)
        UI.dayName[i].textContent = newDay;
      })
    }
  },
  // update metric info UI
  async updateMetricUI() {
    // change text content works
    UI.unitSwitch.textContent = AppState.isMetric
      ? "Switch to Imperial"
      : "Switch to Metric";

    // show/hide unit elements based on current state using Tailwind 'invisible' utility

    UI.unitsElement.forEach((element) => {
      // determine if the element should be active

      const isActive =
        element.dataset.unit === (AppState.isMetric ? "metric" : "imperial");
      console.log(isActive);

      // toggle the bg-color based on active state

      element.classList.toggle("bg-Neutral700", isActive);

      // toggle checkmark visibility based on actve state

      element.querySelector("img").classList.toggle("invisible", !isActive);
    });

    let coords = await WeatherService.getCoordinatesPromise();
    console.log(coords);

    // fetch data using the current unit state
    WeatherService.fetchWeatherData(coords);
  },

  updateHourlyUI(dayId) {
    let day = UI.days[dayId];

    // display the name of the day based on the day clicked
    UI.activeDay.innerText = day.textContent;
    console.log(day);

    UI.daysDrop.classList.add("invisible");
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
  },

  // Takes in a query (cityName or lat and lon), fecthes all relavant weatherData using OpenMeteo and calls update Dashboard to display the data.
  async fetchWeatherData(query, location) {
    let lat, lon, city, country, tempUnit, windUnit, precipUnit;
    lat = query.lat;
    lon = query.lon;
    city = location.city;
    country = location.country;
    console.log(lat, lon);

    tempUnit = AppState.isMetric ? "celsius" : "fahrenheit";
    windUnit = AppState.isMetric ? "kmh" : "mph";
    precipUnit = AppState.isMetric ? "mm" : "inch";

    const weatherData = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,wind_speed_10m,weathercode` +
        `&hourly=temperature_2m,apparent_temperature,weathercode` +
        `&daily=weather_code,temperature_2m_max,apparent_temperature_max` +
        `&temperature_unit=${tempUnit}` +
        `&wind_speed_unit=${windUnit}` +
        `&precipitation_unit=${precipUnit}` +
        `&timezone=auto`,
    );
    const data = await weatherData.json();
    console.log(data);

    const {
      temperature_2m,
      apparent_temperature,
      precipitation,
      wind_speed_10m,
      relative_humidity_2m,
      weathercode,
    } = data.current;

    // update the Dashboard with the location and weather params
    const currentWeather = {
      temp: temperature_2m,
      feels_like: apparent_temperature,
      humidity: relative_humidity_2m,
      wind: wind_speed_10m,
      precipitation: precipitation,
      weathercode: weathercode,
      tempUnit:tempUnit,
      precipUnit:precipUnit,
      windUnit:windUnit,
    };
    // location ain't defined
    RenderUI.updateDashboard({city, country}, currentWeather);

    // process daily data
    const daily = data.daily;
    console.log(daily);
    const days = daily.time;
    const dailyCode = daily.weather_code;
    const dailyTempData = daily.temperature_2m_max
    const dailyAppTempData = daily.apparent_temperature_max;

    const dailyWeather = {      
      days: days,
      dailyCode: dailyCode,
      dailyTempData:dailyTempData,
      dailyAppTempData:dailyAppTempData
    }

RenderUI.updateDailyUI(dailyWeather)

      
      const hourlyData = data.hourly;
      
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
            `https://geocoding-api.open-meteo.com/v1/search?name=${value}&count=10&language=en&format=json`
        );
        const cities = await fetchedCities.json();
        
        // 2. Validate the data structure
        const suggestions = cities.results || []; // Fallback to empty array if undefined
        console.log("Fresh API Data:", suggestions); // ✅ Check this log!

        const shouldHide = !value || suggestions.length === 0;
        UI.cityDrop.classList.toggle("invisible", shouldHide);

        let lat, lon, city, country;
        if (!shouldHide) {
            const innerHTML = suggestions
                .map((result) => {
                    // 3. Explicit Destructuring with Fallbacks
                    let newCountry = result.country;
                    if (newCountry === "Israel" || !newCountry) {
                      newCountry = "Palestine ˗ˏˋ 🍉 ˎˊ˗"
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
