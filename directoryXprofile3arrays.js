// facility-data.js



const facilityOptions = [
  { label: "Air conditioning", value: "air-conditioning", icon: "fa-solid fa-snowflake" },
  { label: "Fitness studio", value: "fitness-studio", icon: "fa-solid fa-person-running" },
  { label: "Jacuzzi", value: "jacuzzi", icon: "fa-solid fa-hot-tub-person" },
  { label: "Lane swimming", value: "lane-swimming", icon: "fa-solid fa-water" },
  { label: "Mat area", value: "mat-area", icon: "fa-solid fa-border-all" },
  { label: "Sauna", value: "sauna", icon: "fa-solid fa-temperature-high" },
  { label: "Spa facilities", value: "spa-facilities", icon: "fa-solid fa-spa" },
  { label: "Steam room", value: "steam-room", icon: "fa-solid fa-cloud" },
  { label: "Sun beds", value: "sun-beds", icon: "fa-solid fa-sun" },
  { label: "Swimming pool", value: "swimming-pool", icon: "fa-solid fa-water-ladder" },
  { label: "Running track", value: "running-track", icon: "fa-solid fa-route" },
  { label: "Showers", value: "showers", icon: "fa-solid fa-shower" },
  { label: "Lockers", value: "lockers", icon: "fa-solid fa-lock" },
  { label: "Parking nearby", value: "parking-nearby", icon: "fa-solid fa-square-parking" },
  { label: "Accessible access", value: "accessible-access", icon: "fa-solid fa-wheelchair" }
];


function getFacilityIcon(label) {
  const facility = facilityOptions.find(item => item.label === label);
  return facility ? facility.icon : "fa-solid fa-circle-check";
}

function renderFacilities(facilities = []) {
  return facilities.map(label => {
    const icon = getFacilityIcon(label);

    return `
      <span class="facility-pill">
        <i class="${icon}"></i>
        ${label}
      </span>
    `;
  }).join("");
}
