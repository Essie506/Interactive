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

  filterMenu.classList.remove('open');
  filterOverlay.classList.remove('open');
}

if (filterBtn) filterBtn.addEventListener('click', openFilter);
if (filterClose) filterClose.addEventListener('click', closeFilter);
if (filterOverlay) filterOverlay.addEventListener('click', closeFilter);

// =========================
// FILTER STATE
// =========================

const selectedFilters = new Set();

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
// SORT BY SWITCH TOGGLES
// =========================
let sortPriority = [];
document.querySelectorAll(".directory-filter-sort-by").forEach((toggle) => {
  toggle.addEventListener("click", () => {
    const value = toggle.dataset.sort;
    const badge = toggle.querySelector(".sort-priority");
    const icon = toggle.querySelector("i");

    if (!value || !badge || !icon) return;

    const index = sortPriority.indexOf(value);

    if (index === -1) {
      // ADD to priority
      sortPriority.push(value);

      badge.textContent = sortPriority.length;
      badge.classList.add("active");

      icon.classList.remove("fa-toggle-off");
      icon.classList.add("fa-toggle-on");

    } else {
      // REMOVE from priority
      sortPriority.splice(index, 1);

      // re-number everything
      document.querySelectorAll(".directory-filter-sort-by").forEach(btn => {
        const val = btn.dataset.sort;
        const b = btn.querySelector(".sort-priority");

        const i = sortPriority.indexOf(val);
        if (i !== -1) {
          b.textContent = i + 1;
          b.classList.add("active");
        } else {
          b.textContent = "";
          b.classList.remove("active");
        }
      });

      icon.classList.remove("fa-toggle-on");
      icon.classList.add("fa-toggle-off");
    }

    console.log("Sort priority:", sortPriority);
  });
});

// =========================
// RESET
// =========================

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    selectedFilters.clear();

    filterPills.forEach(btn => {
      btn.classList.remove('active');
    });

    if (distanceRange && distanceValue) {
      distanceRange.value = 0;
      distanceValue.textContent = "0 miles";
    }

sortPriority = ["location", "verification"];
applyDefaultSortUI();
    
  });
}

// =========================
// RESET SORT PRIORITY
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
      // active
      if (badge) {
        badge.textContent = index + 1;
        badge.classList.add("active");
      }

      if (icon) {
        icon.classList.remove("fa-toggle-off");
        icon.classList.add("fa-toggle-on");
      }
    } else {
      // inactive
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

// run on load
applyDefaultSortUI();

// =========================
// DISTANCE SLIDER
// =========================

if (distanceRange && distanceValue) {
  distanceRange.addEventListener("input", () => {
    distanceValue.textContent = `${distanceRange.value} miles`;
  });
}

// =========================
// APPLY
// =========================

if (applyBtn) {
  applyBtn.addEventListener('click', () => {
    console.log('Applying filters:', [...selectedFilters]);

    closeFilter();

    // future hook:
    // filterDirectory([...selectedFilters]);
  });
}
