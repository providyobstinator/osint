// ================== UTILITIES ==================
const openSafe = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isIP = v => /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/.test(v);
const isDomain = v => /^(?!https?:\/\/)([a-z0-9-]+\.)+[a-z]{2,}$/i.test(v);
const isPhone = v => /^\+?\d{7,15}$/.test(v);
const isUsername = v => /^@?[a-zA-Z0-9_.-]{3,30}$/.test(v);

// ================== STATE ==================
const HISTORY_KEY = "ow_history";
let map, marker;

// ================== APP FLOW ==================
function startApp() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("app").style.display = "block";
}

// ================== SECTIONS ==================
function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "geo" && !map) {
    setTimeout(initMap, 300);
  }

  if (id === "report") {
    refreshReport();
  }
}

// ================== HISTORY ==================
function getHistory() {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

function saveHistory(q) {
  const h = getHistory();
  h.unshift({
    q,
    ts: new Date().toLocaleString()
  });
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0, 100)));
}

// ================== REPORT ==================
function refreshReport() {
  const notes = document.getElementById("notes");
  if (!notes) return;

  const h = getHistory();
  if (!h.length) {
    notes.value = "";
    return;
  }

  notes.value = h.map(x => `${x.ts} — ${x.q}`).join("\n");
}

// ================== OSINT ROUTER ==================
async function searchOSINT() {
  const input = document.getElementById("query");
  if (!input) return;

  const q = input.value.trim();
  if (!q) return;

  saveHistory(q);
  refreshReport();

  if (isEmail(q)) {
    openSafe(`https://www.google.com/search?q="${q}"`);
    await sleep(400);
    openSafe(`https://haveibeenpwned.com/`);
    return;
  }

  if (isIP(q)) {
    openSafe(`https://ipinfo.io/${q}`);
    await sleep(400);
    openSafe(`https://www.google.com/search?q="${q}"`);
    return;
  }

  if (isDomain(q)) {
    openSafe(`https://who.is/whois/${q}`);
    await sleep(400);
    openSafe(`https://www.google.com/search?q=site:${q}`);
    return;
  }

  if (isPhone(q)) {
    openSafe(`https://www.google.com/search?q="${q}"`);
    return;
  }

  if (isUsername(q)) {
    const u = q.startsWith("@") ? q.slice(1) : q;
    openSafe(`https://www.google.com/search?q="${u}"`);
    await sleep(400);
    openSafe(`https://github.com/${u}`);
    return;
  }

  openSafe(`https://www.google.com/search?q="${q}"`);
}

// ================== GEO ==================
function initMap() {
  map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

async function locateIP() {
  const ipInput = document.getElementById("ip");
  if (!ipInput) return;

  const ip = ipInput.value.trim();
  if (!isIP(ip)) {
    alert("Invalid IP");
    return;
  }

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await res.json();

    if (!d.latitude || !d.longitude) {
      alert("No location data");
      return;
    }

    if (marker) map.removeLayer(marker);
    marker = L.marker([d.latitude, d.longitude]).addTo(map);
    map.setView([d.latitude, d.longitude], 6);
  } catch {
    alert("Network error");
  }
      }
