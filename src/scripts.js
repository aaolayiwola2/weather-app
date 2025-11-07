const units = document.querySelector(".units");
const unitsDrop = document.querySelector(".units-dropdown");
const search = document.querySelector(".search-field");
const dayDrop = document.querySelector(".dropdown-day");
// Find dropdowns that live inside the control wrappers
const cityDrop = search?.querySelector('.city-dropdown') ?? null;
const daysDrop = dayDrop?.querySelector('.days-dropdown') ?? null;
// Units
const unitSwitch = document.querySelector('.unit-switch');
const metric = document.querySelectorAll('.metric');
const imperial = document.querySelectorAll('.imperial');

/** Dropdown controls */
// Helper to set up a control + dropdown pair
function setupDrop(control, dropdown) {
    if (!control || !dropdown) return;
    // enable clicks within control and disable outside it
    control.addEventListener('click', (e) => {
        if (dropdown.contains(e.target)) return;
        dropdown.classList.toggle('invisible');
        });
    control.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === "") {
            e.preventDefault();
            dropdown.classList.toggle('invisible')
        }
    })
    }
// Set up pairs
setupDrop(units, unitsDrop);
setupDrop(dayDrop, daysDrop);

// Close any open dropdown when clicking outside its control
document.addEventListener('click', (e) => {
    if (units && unitsDrop && !units.contains(e.target)) unitsDrop.classList.add('invisible');
    if (search && cityDrop && !search.contains(e.target)) cityDrop.classList.add('invisible');
    if (dayDrop && daysDrop && !dayDrop.contains(e.target)) daysDrop.classList.add('invisible');
});

/**Daydropdown control */
const activeDay = document.querySelector('.day-select');
const days = document.querySelectorAll('.days');

days.forEach(
    (day) => {
    day.addEventListener('click', () => {
console.log(day.textContent);
activeDay.textContent = day.textContent
    })
    }
)

/** Units Control */
// Function to handle the control
function switchUnit() {
    // default state, metric units active
    
    // onClick, toggle active on metric and add to imperial state 
    
}




