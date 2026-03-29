document.addEventListener("DOMContentLoaded", () => {
  const wheel = document.getElementById("wheel");
  const segmentEls = Array.from(document.querySelectorAll(".wheel .segment"));
  const icons = Array.from(document.querySelectorAll(".wheel .segment i"));

  const resultEl = document.getElementById("wheelResult");
  const acceptBtn = document.getElementById("acceptBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  const spinBtn = document.getElementById("spinBtn");

  if (!wheel || !icons.length) return;

  /* click only on icons, not wrapper */
  segmentEls.forEach((segment) => {
    segment.style.pointerEvents = "none";
  });

  icons.forEach((icon) => {
    icon.style.pointerEvents = "auto";
  });

  let rotation = 0;
  let velocity = 0;
  let isDragging = false;
  let lastAngle = 0;
  let animationFrame = null;

  let currentWinningIndex = null;
  let excludedIndexes = new Set();
  let lastTickStep = null;

  const segmentAngle = 360 / icons.length;
  const firstSegmentAngle = 26; /* matches your CSS nth-child(1) */
  const pointerAngle = 270;

  if (resultEl) resultEl.textContent = "Spin the wheel";
  if (acceptBtn) acceptBtn.disabled = true;
  if (rejectBtn) rejectBtn.disabled = true;

  function getAngle(x, y) {
    const rect = wheel.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    return Math.atan2(y - cy, x - cx) * 180 / Math.PI;
  }

  function normalize(angle) {
    return ((angle % 360) + 360) % 360;
  }

  function updateWheel() {
    wheel.style.transform = `rotate(${rotation}deg)`;

    icons.forEach((icon) => {
      const isClicked = icon.classList.contains("clicked");

      if (isClicked) {
        icon.style.transform = `rotate(${-rotation}deg) scale(1.15) translateY(-5px)`;
      } else {
        icon.style.transform = `rotate(${-rotation}deg)`;
      }
    });
  }

  function clearClicked() {
    icons.forEach((icon) => icon.classList.remove("clicked"));
  }

  function clearActive() {
    icons.forEach((icon) => icon.classList.remove("active"));
  }

  function getLabelForIcon(icon) {
    return (
      icon.dataset.label ||
      icon.getAttribute("aria-label") ||
      icon.getAttribute("title") ||
      icon.dataset.page ||
      "Selected category"
    );
  }

  function getWinningIndexFromSteps(steps) {
    let winningIndex = steps % icons.length;
    winningIndex = ((-winningIndex % icons.length) + icons.length) % icons.length;
    return winningIndex;
  }

  function isAllowedIndex(index) {
    return !excludedIndexes.has(index);
  }

  function getNextAllowedStop() {
    const baseTarget = pointerAngle - firstSegmentAngle;
    let steps = Math.ceil((rotation - baseTarget) / segmentAngle);

    for (let i = 0; i < icons.length; i++) {
      const candidateIndex = getWinningIndexFromSteps(steps + i);

      if (isAllowedIndex(candidateIndex)) {
        return {
          steps: steps + i,
          targetRotation: baseTarget + ((steps + i) * segmentAngle),
          winningIndex: candidateIndex
        };
      }
    }

    excludedIndexes.clear();

    return {
      steps,
      targetRotation: baseTarget + (steps * segmentAngle),
      winningIndex: getWinningIndexFromSteps(steps)
    };
  }

  function updateResult(winningIndex) {
    const icon = icons[winningIndex];
    const label = getLabelForIcon(icon);

    if (resultEl) {
      resultEl.textContent = `Landed on: ${label}`;
    }

    if (acceptBtn) acceptBtn.disabled = false;
    if (rejectBtn) acceptBtn.disabled = false;
    if (rejectBtn) rejectBtn.disabled = false;
  }

  function snapToPointer() {
    const stop = getNextAllowedStop();

    rotation = stop.targetRotation;
    currentWinningIndex = stop.winningIndex;

    wheel.style.transition = "transform 0.2s ease-out";
    updateWheel();

    clearClicked();
    clearActive();

    icons[currentWinningIndex].classList.add("active");
    icons[currentWinningIndex].classList.add("clicked");
    updateWheel();

    updateResult(currentWinningIndex);

    setTimeout(() => {
      if (currentWinningIndex !== null) {
        icons[currentWinningIndex].classList.remove("clicked");
        updateWheel();
      }
    }, 800);
  }

  function doTickFeedback() {
    const step = Math.floor(normalize(rotation) / segmentAngle);

    if (step !== lastTickStep) {
      lastTickStep = step;
      wheel.classList.remove("tick");
      void wheel.offsetWidth;
      wheel.classList.add("tick");
    }
  }

  function startDrag(e) {
    const target = e.target;

    if (
      target.closest(".hub") ||
      target.closest(".wheel-btn") ||
      target.closest(".segment i")
    ) {
      return;
    }

    isDragging = true;
    velocity = 0;
    wheel.style.transition = "none";

    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    const touch = e.touches ? e.touches[0] : e;
    lastAngle = getAngle(touch.clientX, touch.clientY);
  }

  function dragSpin(e) {
    if (!isDragging) return;

    if (e.cancelable) e.preventDefault();

    const touch = e.touches ? e.touches[0] : e;
    const angle = getAngle(touch.clientX, touch.clientY);

    let delta = angle - lastAngle;

    if (delta > 180) delta -= 360;
    if (delta < -180) delta += 360;

    rotation += delta;
    velocity = delta;
    lastAngle = angle;

    wheel.style.transition = "none";
    updateWheel();
    doTickFeedback();
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    spinMomentum();
  }

  function spinMomentum() {
    rotation += velocity;
    velocity *= 0.95;

    wheel.style.transition = "none";
    updateWheel();
    doTickFeedback();

    if (Math.abs(velocity) > 0.15) {
      animationFrame = requestAnimationFrame(spinMomentum);
    } else {
      animationFrame = null;
      snapToPointer();
    }
  }

  function spinWheel() {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
      animationFrame = null;
    }

    isDragging = false;
    velocity = Math.random() * 18 + 18;

    clearClicked();
    clearActive();
    currentWinningIndex = null;

    if (resultEl) resultEl.textContent = "Spinning...";
    if (acceptBtn) acceptBtn.disabled = true;
    if (rejectBtn) rejectBtn.disabled = true;

    spinMomentum();
  }

  function goToCurrentPage() {
    if (currentWinningIndex === null) return;

    const page = icons[currentWinningIndex].dataset.page;
    if (page) {
      window.location.href = page;
    }
  }

  function rejectCurrentCategory() {
    if (currentWinningIndex === null) return;

    excludedIndexes.add(currentWinningIndex);

    if (resultEl) {
      const label = getLabelForIcon(icons[currentWinningIndex]);
      resultEl.textContent = `${label} rejected. Spin again.`;
    }

    clearClicked();
    clearActive();
    currentWinningIndex = null;

    if (acceptBtn) acceptBtn.disabled = true;
    if (rejectBtn) rejectBtn.disabled = true;
  }

  icons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();

      const page = icon.dataset.page;
      if (page) {
        window.location.href = page;
      }
    });
  });

  if (acceptBtn) {
    acceptBtn.addEventListener("click", goToCurrentPage);
  }

  if (rejectBtn) {
    rejectBtn.addEventListener("click", rejectCurrentCategory);
  }

  if (spinBtn) {
    spinBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      spinWheel();
    });
  }

  wheel.addEventListener("mousedown", startDrag);
  wheel.addEventListener("touchstart", startDrag, { passive: true });

  document.addEventListener("mousemove", dragSpin);
  document.addEventListener("touchmove", dragSpin, { passive: false });

  document.addEventListener("mouseup", endDrag);
  document.addEventListener("touchend", endDrag);

  updateWheel();
});
