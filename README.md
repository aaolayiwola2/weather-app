# Weather App Project 🌦️

A fully responsive, engineered Weather Application built to simulate a real-world designer-developer workflow. This project focuses on architectural robustness, pixel-perfect design implementation, and handling real-world asynchronous data states.

## 🎨 Design & Responsiveness

This phase of the project focused entirely on creating a pixel-perfect, fully responsive layout using modern CSS techniques and the Tailwind CSS framework.

## Core Layout and Responsiveness

Built a Comprehensive Responsive Design: Successfully implemented adaptive layouts for Desktop, Tablet, and Mobile breakpoints, ensuring a seamless user experience across all devices.

## CSS Layout Mastery (Flexbox & Grid):

Harnessed the power of CSS Grid to construct complex, two-dimensional application layouts efficiently. I majorly implemented CSS Grid for the main layout of the Weather Dashboard using Grid template columns, rows, and Grid Template Areas.

Gained practical expertise in CSS Flexbox for robust one-dimensional content alignment and dynamic spacing. I implemented Flexbox primarily in internal elements and components that needed fluid responsiveness across different screen sizes.

## Advanced Tailwind CSS Implementation

Custom Design System Integration: Configured tailwind.config.js to include a custom design system, defining project-specific colors, font families, and typography styles.

Utility Class Efficiency: Utilized Tailwind's utility-first approach to set media query breakpoints and rapidly adjust styling for responsiveness.

Plugin Experience: Used my first Tailwind plugin to implement advanced Grid Template Areas and Grid Areas properties, streamlining the creation of complex, named layout structures.

## Development Process & Collaboration

Designer-Developer Workflow Simulation: Replicated a real-world collaboration experience by meticulously translating a source design into functional code, focusing on precision and fidelity.

Code Review & Debugging: Actively reviewed external code and implemented insights to debug layout errors, successfully solving complex rendering issues related to Flexbox and Grid interactions.

AI-Assisted Debugging: Leveraged AI tools as a debugging assistant to quickly isolate and resolve complex layout issues, accelerating the development cycle.

## ⚙️ Software Engineering & Architecture

Beyond the UI, this project was an exercise in structuring a robust Single Page Application (SPA) using Vanilla JavaScript.

### 1. The MVC Architecture (Model-View-Controller)

Moved away from monolithic "spaghetti code" by strictly separating concerns:

The Model (WeatherService): Handles API calls, data parsing, and error validation. It has no knowledge of the DOM.

The View (RenderUI): Handles the DOM. It receives raw data and paints pixels. It doesn't know where data comes from.

The Controller: Handles user input (clicks, typing) and acts as the bridge between Model and View.

### 2. State Management & "View Switching"

Handling the "in-between" states of an application is just as important as the success state.

Implemented a View Switcher pattern to manage Loading, Success, and Error states.

This prevents the UI from looking broken (or blank) while waiting for data or when 404 errors occur.

### 3. Dynamic Rendering vs. Hardcoded HTML

The Problem: Initially, looping through 24 hours of data crashed the app when the HTML only contained 12 static placeholders.

The Solution: Switched to Dynamic Rendering, generating HTML strings in JavaScript and injecting them into the DOM. This ensures the UI scales perfectly regardless of how much data the API returns.

### 4. Asynchronous Logic & Event Closures

Stale Data: Encountered a bug where the search button required multiple clicks because it was reading localStorage only once (on page load).

The Fix: Learned that Event Listeners form closures. Fixed the bug by moving the data retrieval logic inside the execution context of the event handler to ensure fresh data access.

## 🚀 Key Features

Responsive Layout: Interface adapts seamlessly to Desktop, Tablet, and Mobile screens with proper hover/focus states.

Geolocation: Automatic detection of user's current city and weather on load.

Global Search: Users can search for any city globally and receive instant updates via the Open Meteo API.

Unit Conversion: Instant toggle between Metric (Celsius/kmh) and Imperial (Fahrenheit/mph) units with state persistence using LocalStorage.

Dynamic Forecasting:

Real-time Current Weather Dashboard.

7-Day Daily Forecast.

Interactive Hourly Forecast (selectable by day).