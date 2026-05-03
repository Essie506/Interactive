// =========================
// ELEMENTS
// =========================

const filterBtn = document.getElementById("filterBtn");
const filterMenu = document.getElementById("directoryFilterMenu");
const filterOverlay = document.getElementById("directoryFilterOverlay");
const filterClose = document.getElementById("directoryFilterClose");

const resetBtn = document.getElementById("directoryFilterReset");
const applyBtn = document.getElementById("directoryFilterApply");

const directorySwitchBtns = document.querySelectorAll("[data-directory-switch]");
const distanceRanges = document.querySelectorAll(".distance-range");
const filterPills = document.querySelectorAll(".directory-filter-pill");
const filterPanels = document.querySelectorAll(".directory-filter-panel");
const filterGroups = document.querySelectorAll(".directory-filter-subgroup");
const sortButtons = document.querySelectorAll(".directory-filter-sort-by");

const locationInputs = document.querySelectorAll(".directory-location-input");



// =========================
// FILTER STATE
// =========================

const selectedFilters = new Set();
let sortPriority = ["location", "verification"];


// =========================
// HELPERS
// =========================

function resetFilterUI() {
  document.querySelectorAll(".directory-filter-panel")
    .forEach(panel => panel.classList.remove("open"));

  document.querySelectorAll(".directory-filter-subgroup")
    .forEach(group => group.classList.remove("open"));
}

function pressFeedback(btn, callback) {
  btn.classList.add("is-pressing");

  setTimeout(() => {
    btn.classList.remove("is-pressing");
    btn.blur();
    if (callback) callback();
  }, 120);
}

function getActiveDistanceRange() {
  const type = document.body.dataset.directoryType;

  return document.querySelector(
    `.directory-filter-section[data-filter-type="${type}"] .distance-range`
  );
}


// =========================
// DIRECTORY TYPE
// =========================

function setDirectoryType(type) {
  document.body.dataset.directoryType = type;
  resetFilterUI();

  directorySwitchBtns.forEach(btn => {
    btn.classList.toggle(
      "active",
      btn.dataset.directorySwitch === type
    );
  });

  localStorage.setItem("directoryType", type);
}

directorySwitchBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    setDirectoryType(btn.dataset.directorySwitch);
  });
});


// =========================
// LOAD SAVED DIRECTORY TYPE
// =========================

const savedType = localStorage.getItem("directoryType");

if (savedType) {
  setDirectoryType(savedType);
} else {
  setDirectoryType("gyms");
}


// =========================
// OPEN / CLOSE
// =========================

function openFilter() {
  if (!filterMenu || !filterOverlay) return;

  filterMenu.classList.add("open");
  filterOverlay.classList.add("open");
}

function closeFilter() {
  if (!filterMenu || !filterOverlay) return;

  resetFilterUI();

  filterMenu.classList.remove("open");
  filterOverlay.classList.remove("open");
}

if (filterBtn) filterBtn.addEventListener("click", openFilter);
if (filterClose) filterClose.addEventListener("click", closeFilter);
if (filterOverlay) filterOverlay.addEventListener("click", closeFilter);


// =========================
// DISTANCE RANGES
// =========================

distanceRanges.forEach(range => {
  const valueText = range
    .closest(".directory-filter-section")
    .querySelector(".distance-value-text");

  function updateDistanceValue() {
    const value = Number(range.value);
    const max = Number(range.max);

    if (value === max) {
      valueText.textContent = "Any distance";
    } else if (value === 1) {
      valueText.textContent = "1 mile";
    } else {
      valueText.textContent = `${value} miles`;
    }
  }

  range.addEventListener("input", updateDistanceValue);
  updateDistanceValue();
});


function updateStaticFilterState(input) {
  const section = input.closest(".directory-filter-section");
  if (!section) return;

  const hasValue =
    input.type === "range"
      ? input.value !== input.defaultValue
      : input.value.trim().length > 0;

  section.classList.toggle("has-value", hasValue);
}

locationInputs.forEach(input => {
  input.addEventListener("input", () => updateStaticFilterState(input));
  updateStaticFilterState(input);
});

distanceRanges.forEach(range => {
  range.addEventListener("input", () => updateStaticFilterState(range));
  updateStaticFilterState(range);
});


// =========================
// PILL TOGGLES
// =========================

filterPills.forEach(btn => {
  btn.addEventListener("click", () => {
    const group = btn.dataset.filterGroup;
    const value = btn.dataset.filterValue;

    if (!group || !value) return;

    const key = `${group}:${value}`;

    if (selectedFilters.has(key)) {
      selectedFilters.delete(key);
      btn.classList.remove("active");
    } else {
      selectedFilters.add(key);
      btn.classList.add("active");
    }

    console.log("Selected filters:", [...selectedFilters]);
  });
});


// =========================
// FILTER SECTION TOGGLES
// =========================

filterPanels.forEach(panel => {
  const toggle = panel.querySelector(".directory-filter-section-toggle");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    panel.classList.toggle("open");
  });
});


// =========================
// INNER FILTER GROUP TOGGLES
// =========================

filterGroups.forEach(group => {
  const toggle = group.querySelector(".directory-filter-group-toggle");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    const isOpen = group.classList.contains("open");

    filterGroups.forEach(g => g.classList.remove("open"));

    if (!isOpen) {
      group.classList.add("open");
    }
  });
});


// =========================
// SORT BY STATE
// =========================

function applyDefaultSortUI() {
  sortButtons.forEach(btn => {
    const value = btn.dataset.sort;
    const badge = btn.querySelector(".sort-priority");
    const icon = btn.querySelector("i");

    const index = sortPriority.indexOf(value);

    if (index !== -1) {
      if (badge) {
        badge.textContent = index + 1;
        badge.classList.add("active");
      }

      if (icon) {
        icon.classList.remove("fa-toggle-off");
        icon.classList.add("fa-toggle-on");
      }
    } else {
      if (badge) {
        badge.textContent = "";
        badge.classList.remove("active");
      }

      if (icon) {
        icon.classList.remove("fa-toggle-on");
        icon.classList.add("fa-toggle-off");
      }
    }
  });
}

sortButtons.forEach(toggle => {
  toggle.addEventListener("click", () => {
    const value = toggle.dataset.sort;
    if (!value) return;

    const index = sortPriority.indexOf(value);

    if (index === -1) {
      sortPriority.push(value);
    } else {
      sortPriority.splice(index, 1);
    }

    applyDefaultSortUI();

    console.log("Sort priority:", sortPriority);
  });
});

applyDefaultSortUI();


// =========================
// RESET
// =========================

if (resetBtn) {
  resetBtn.addEventListener("click", () => {
    pressFeedback(resetBtn);

    selectedFilters.clear();

    filterPills.forEach(btn => {
      btn.classList.remove("active");
    });

    distanceRanges.forEach(range => {
      range.value = 1;
      range.dispatchEvent(new Event("input"));
    });

    sortPriority = [];
    applyDefaultSortUI();
    resetFilterUI();
  });
}


// =========================
// APPLY
// =========================

if (applyBtn) {
  applyBtn.addEventListener("click", () => {
    const activeDistanceRange = getActiveDistanceRange();

    const useLocation = sortPriority.includes("location");
    const distance = activeDistanceRange ? Number(activeDistanceRange.value) : 1;
    const max = activeDistanceRange ? Number(activeDistanceRange.max) : 50;

    console.log("Directory type:", document.body.dataset.directoryType);
    console.log("Use location:", useLocation);
    console.log("Distance:", distance);

    if (!useLocation) {
      console.log("Ignoring distance completely");
    } else if (distance === max) {
      console.log("Any distance (no limit)");
    } else {
      console.log(`Filtering within ${distance} miles`);
    }

    pressFeedback(applyBtn, closeFilter);
  });
}
