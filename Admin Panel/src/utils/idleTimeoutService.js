// IdleTimerService.js

import secureLocalStorage from "react-secure-storage";

let timeoutId;
let lastActiveTime = new Date().getTime();

const resetTimer = () => {
  clearTimeout(timeoutId);
  lastActiveTime = new Date().getTime();
  startTimer();
};

const startTimer = () => {
  timeoutId = setTimeout(() => {
    secureLocalStorage.clear();
    window.location.href = "/v1/dashboard/login";
  }, 15 * 60 * 1000); // if you dont perform any action within 15 mins, you will be logged out...
};

const setupListeners = () => {
  // Listen for user activity events
  document.addEventListener("mousemove", resetTimer);
  document.addEventListener("keydown", resetTimer);
  document.addEventListener("scroll", resetTimer);
  document.addEventListener("touchstart", resetTimer);
};

const removeListeners = () => {
  // Remove listeners when no longer needed (e.g., during logout)
  document.removeEventListener("mousemove", resetTimer);
  document.removeEventListener("keydown", resetTimer);
  document.removeEventListener("scroll", resetTimer);
  document.removeEventListener("touchstart", resetTimer);
};

export const IdleTimerService = {
  init: () => {
    const accessToken = secureLocalStorage.getItem("accessToken");
    if (accessToken) {
      setupListeners();
      startTimer();
    }
  },
  reset: () => {
    resetTimer();
  },
  stop: () => {
    clearTimeout(timeoutId);
    removeListeners();
  },
};
