// =========================
// ELEMENTS
// =========================

const filterBtn = document.getElementById('filterBtn');
const filterMenu = document.getElementById('directoryFilterMenu');
const filterOverlay = document.getElementById('directoryFilterOverlay');
const filterClose = document.getElementById('directoryFilterClose');

const resetBtn = document.getElementById('directoryFilterReset');
const applyBtn = document.getElementById('directoryFilterApply');

const distanceRange = document.getElementById("distanceRange");
const distanceValue = document.getElementById("distanceValue");

// =========================
// OPEN / CLOSE
// =========================

function openFilter() {
  if (!filterMenu || !filterOverlay) return;

  filterMenu.classList.add('open');
  filterOverlay.classList.add('open');
}

function closeFilter() {
  if (!filterMenu || !filterOverlay) return;

    resetFilterUI();


  filterMenu.classList.remove('open');
  filterOverlay.classList.remove('open');
}

if (filterBtn) filterBtn.addEventListener('click', openFilter);
if (filterClose) filterClose.addEventListener('click', closeFilter);
if (filterOverlay) filterOverlay.addEventListener('click', closeFilter);


function resetFilterUI() {
  // Close all main sections
  document.querySelectorAll('.directory-filter-panel')
    .forEach(panel => panel.classList.remove('open'));

  // Close all subgroups
  document.querySelectorAll('.directory-filter-subgroup')
    .forEach(group => group.classList.remove('open'));
}

// =========================
// FILTER STATE
// =========================

const selectedFilters = new Set();

// =========================
// HELPERS
// =========================

function pressFeedback(btn, callback) {
  btn.classList.add("is-pressing");

  setTimeout(() => {
    btn.classList.remove("is-pressing");
    btn.blur();
    if (callback) callback();
  }, 120);
}

// =========================
// PILL TOGGLES
// =========================

const filterPills = document.querySelectorAll('.directory-filter-pill');

filterPills.forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.dataset.filterGroup;
    const value = btn.dataset.filterValue;

    if (!group || !value) return;

    const key = `${group}:${value}`;

    if (selectedFilters.has(key)) {
      selectedFilters.delete(key);
      btn.classList.remove('active');
    } else {
      selectedFilters.add(key);
      btn.classList.add('active');
    }

    console.log('Selected filters:', [...selectedFilters]);
  });
});

// =========================
// FILTER SECTION TOGGLES
// =========================

const filterPanels = document.querySelectorAll('.directory-filter-panel');

filterPanels.forEach(panel => {
  const toggle = panel.querySelector('.directory-filter-section-toggle');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    panel.classList.toggle('open');
  });
});

// =========================
// INNER FILTER GROUP TOGGLES
// =========================

const filterGroups = document.querySelectorAll('.directory-filter-subgroup');

filterGroups.forEach(group => {
  const toggle = group.querySelector('.directory-filter-group-toggle');

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isOpen = group.classList.contains('open');

    filterGroups.forEach(g => g.classList.remove('open'));

    if (!isOpen) {
      group.classList.add('open');
    }
  });
});

// =========================
// SORT BY STATE
// =========================

let sortPriority = ["location", "verification"];

const sortButtons = document.querySelectorAll(".directory-filter-sort-by");

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
// =========================
// RESET
// =========================

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    pressFeedback(resetBtn);

    selectedFilters.clear();

    filterPills.forEach(btn => {
      btn.classList.remove('active');
    });

    if (distanceRange && distanceValue) {
      distanceRange.value = 1;
      distanceRange.dispatchEvent(new Event("input"));
    }

    sortPriority = [];
    applyDefaultSortUI();
  });
}

// =========================
// SORT BY SWITCH TOGGLES
// =========================

sortButtons.forEach((toggle) => {
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

// run defaults on load
applyDefaultSortUI();

// =========================
// DISTANCE SLIDER
// =========================

if (distanceRange && distanceValue) {
const updateDistanceUI = () => {
  const value = Number(distanceRange.value);
  const max = Number(distanceRange.max);

  if (value === max) {
    distanceValue.textContent = "Any distance";
  } else if (value === 1) {
    distanceValue.textContent = "1 mile";
  } else {
    distanceValue.textContent = `${value} miles`;
  }
};

  distanceRange.addEventListener("input", updateDistanceUI);

  // run once on load so it matches default value
  updateDistanceUI();
}

// =========================
// APPLY
// =========================

if (applyBtn) {
  applyBtn.addEventListener('click', () => {
    const useLocation = sortPriority.includes("location");
    const distance = Number(distanceRange.value);
    const max = Number(distanceRange.max);

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
