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


const titleSwitch = document.querySelector(".directory-filter-title-switch");
const dropdown = document.getElementById("filterTypeDropdown");




// =========================
// FILTER STATE
// =========================

const defaultSortPriority = ["location", "verification"];
const selectedFilters = new Set();
let sortPriority = [...defaultSortPriority];


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
  const isActive = btn.dataset.directorySwitch === type;

  btn.classList.toggle("is-active", isActive);

  // 👇 hide current option
  btn.style.display = isActive ? "none" : "flex";
});

  const filterTitle = document.getElementById("filterTitle");

  if (filterTitle) {
    const titles = {
      gyms: "Gyms and Studios",
      professionals: "Professionals"
    };

    // ✨ fade effect
    filterTitle.style.opacity = 0;

    setTimeout(() => {
      filterTitle.textContent = titles[type] || "Filters";
      filterTitle.style.opacity = 1;
    }, 120);
  }

  localStorage.setItem("directoryType", type);
}


// =========================
// DIRECTORY SWITCH
// =========================

if (titleSwitch && dropdown) {
  titleSwitch.addEventListener("click", (e) => {
    e.stopPropagation();

    const isOpen = dropdown.classList.toggle("open");
    titleSwitch.classList.toggle("is-open", isOpen);
  });
}

directorySwitchBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    setDirectoryType(btn.dataset.directorySwitch);

    if (dropdown) dropdown.classList.remove("open");
    if (titleSwitch) titleSwitch.classList.remove("is-open");
  });
});

document.addEventListener("click", (e) => {
  if (!dropdown || !titleSwitch) return;

  const isClickInside =
    dropdown.contains(e.target) || titleSwitch.contains(e.target);

  if (!isClickInside) {
    dropdown.classList.remove("open");
    titleSwitch.classList.remove("is-open");
  }
});

if (dropdown) {
  dropdown.addEventListener("click", (e) => {
    e.stopPropagation();
  });
}
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

  if (input.classList.contains("directory-location-input")) {
    section.classList.remove("has-value");
    return;
  }

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

locationInputs.forEach(input => {
  const section = input.closest(".directory-filter-section");
  if (!section) return;

  input.addEventListener("focus", () => {
    section.classList.add("is-interacting");
  });

  input.addEventListener("blur", () => {
    section.classList.remove("is-interacting");
  });
});

distanceRanges.forEach(range => {
  range.addEventListener("input", () => updateStaticFilterState(range));
  updateStaticFilterState(range);
});

distanceRanges.forEach(range => {
  const section = range.closest(".directory-filter-section");
  if (!section) return;

  let timer;

  range.addEventListener("input", () => {
    section.classList.add("is-interacting");

    clearTimeout(timer);

    timer = setTimeout(() => {
      section.classList.remove("is-interacting");
    }, 180); // tweak this (150–250 feels good)
  });
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
  pressFeedback(toggle);

  const isOpen = panel.classList.contains("open");

  panel.classList.toggle("open");

  if (isOpen) {
    setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      if (filterMenu) {
        filterMenu.style.transform = "translateZ(0)";

        requestAnimationFrame(() => {
          filterMenu.style.transform = "";
        });
      }
    }, 160);
  }
});
  }); 

  
// =========================
// INNER FILTER GROUP TOGGLES
// =========================

filterGroups.forEach(group => {
  const toggle = group.querySelector(".directory-filter-group-toggle");

  if (!toggle) return;

  toggle.addEventListener("click", () => {
    pressFeedback(toggle); // 👈 adds tap highlight

    const isOpen = group.classList.contains("open");

    filterGroups.forEach(g => g.classList.remove("open"));

    if (!isOpen) {
      group.classList.add("open");
    }
    
 setTimeout(() => {
      if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
      }

      if (filterMenu) {
        filterMenu.style.transform = "translateZ(0)";

        requestAnimationFrame(() => {
          filterMenu.style.transform = "";
        });
      }
    }, 50);
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

    btn.classList.toggle("is-selected", index !== -1);

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

// =========================
// SORT BUTTONS
// =========================

sortButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    pressFeedback(btn);

    const value = btn.dataset.sort;
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

    locationInputs.forEach(input => {
      input.value = "";
      input.dispatchEvent(new Event("input"));
    });

    selectedFilters.clear();

    filterPills.forEach(btn => {
      btn.classList.remove("active");
    });

    distanceRanges.forEach(range => {
      range.value = range.defaultValue;
      range.dispatchEvent(new Event("input"));
    });

    sortPriority = [...defaultSortPriority];
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
