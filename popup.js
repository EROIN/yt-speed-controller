const speedSelect = document.getElementById('speedSelect');
const speedAddon = document.getElementById('speedAddon');
const totalSpeedEl = document.getElementById('totalSpeed');

function clampAddon(value) {
  if (isNaN(value) || value <= 0) return 0;
  if (value < 0) return 0;
  if (value > 0.9) return 0.9;
  return Math.round(value * 10) / 10;
}

function updateTotalDisplay(total) {
  totalSpeedEl.textContent = `Total: ${total}x`;
}

// Applies the current values without rewriting the input field
// (safe to call while the user is still typing).
function applyLive() {
  const baseSpeed = parseFloat(speedSelect.value);
  const addonSpeed = clampAddon(parseFloat(speedAddon.value));

  const totalSpeed = Math.round((baseSpeed + addonSpeed) * 10) / 10;
  updateTotalDisplay(totalSpeed);

  chrome.storage.local.set({
    baseSpeed,
    addonSpeed,
    targetSpeed: totalSpeed
  });
}

// Clamps/normalizes the visible input value, then applies.
// Only safe to call once the user is done editing (e.g. on blur).
function finalizeAndApply() {
  const addonSpeed = clampAddon(parseFloat(speedAddon.value));
  speedAddon.value = addonSpeed;
  applyLive();
}

// Load previously saved values, defaulting to base 3 / addon 0
chrome.storage.local.get(['baseSpeed', 'addonSpeed', 'targetSpeed'], (result) => {
  if (result.baseSpeed !== undefined) {
    speedSelect.value = result.baseSpeed;
  }
  if (result.addonSpeed !== undefined) {
    speedAddon.value = result.addonSpeed;
  }
  const total = result.targetSpeed !== undefined
    ? result.targetSpeed
    : parseFloat(speedSelect.value) + parseFloat(speedAddon.value || 0);
  updateTotalDisplay(Math.round(total * 10) / 10);
});

// Save selection locally when either control changes
speedSelect.addEventListener('change', finalizeAndApply);
speedAddon.addEventListener('input', applyLive);   // live update while typing, no clamping
speedAddon.addEventListener('change', finalizeAndApply); // clamp/normalize on blur or spinner click
