// facility-data.js

const facilityOptions = [
  { label: "Showers", icon: "fa-solid fa-shower" },
  { label: "Parking nearby", icon: "fa-solid fa-square-parking" },
  ...
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
