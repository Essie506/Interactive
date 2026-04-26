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
// RESET
// =========================

if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    selectedFilters.clear();

    filterPills.forEach(btn => {
      btn.classList.remove('active');
    });

    if (distanceRange && distanceValue) {
      distanceRange.value = 10;
      distanceValue.textContent = "10 miles";
    }
  });
}

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
