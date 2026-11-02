let currentTargetSpeed = 3.0;

// 1. Fetch initial speed from storage on startup
chrome.storage.local.get(['targetSpeed'], (result) => {
  if (result.targetSpeed) {
    currentTargetSpeed = parseFloat(result.targetSpeed);
  }
});

// 2. Listen for runtime changes to the storage data automatically
chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === 'local' && changes.targetSpeed) {
    currentTargetSpeed = parseFloat(changes.targetSpeed.newValue);
    enforceSpeed();
  }
});

// 3. Continuous enforcement loop to counter YouTube overrides
function enforceSpeed() {
  const videos = document.querySelectorAll('video');
  videos.forEach(video => {
    if (video && video.playbackRate !== currentTargetSpeed) {
      video.playbackRate = currentTargetSpeed;
    }
  });
}
setInterval(enforceSpeed, 500);
