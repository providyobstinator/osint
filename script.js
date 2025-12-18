// ===== Utilities =====
const openSafe = (url) => window.open(url, "_blank", "noopener,noreferrer");
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const isIP = v => /^(25[0-5]|2[0-4]\d|[01]?\d?\d)(\.(25[0-5]|2[0-4]\d|[01]?\d?\d)){3}$/.test(v);
const isDomain = v => /^(?!https?:\/\/)([a-z0-9-]+\.)+[a-z]{2,}$/i.test(v);
const isPhone = v => /^\+?\d{7,15}$/.test(v);
const isUsername = v => /^@?[a-zA-Z0-9_.-]{3,30}$/.test(v);

// ===== State =====
let map, marker;
const HISTORY_KEY = "ow_history";

// ===== App =====
function startApp() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
  if (id === "geo" && !map) setTimeout(initMap, 200);
}

// ===== History =====
function saveHistory(item){
  const h = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  h.unshift(item);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(h.slice(0,50)));
}

function getHistory(){
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
}

// ===== OSINT Router =====
async function searchOSINT(){
  const q = document.getElementById("query").value.trim();
  if(!q) return;

  const ts = new Date().toLocaleString();
  saveHistory({ q, ts });

  // Parallel but gentle
  if(isEmail(q)){
    openSafe(`https://www.google.com/search?q="${q}"`);
    await sleep(400);
    openSafe(`https://haveibeenpwned.com/`);
    return;
  }

  if(isIP(q)){
    openSafe(`https://ipinfo.io/${q}`);
    await sleep(400);
    openSafe(`https://www.google.com/search?q="${q}"`);
    return;
  }

  if(isDomain(q)){
    openSafe(`https://who.is/whois/${q}`);
    await sleep(400);
    openSafe(`https://www.google.com/search?q=site:${q}`);
    return;
  }

  if(isPhone(q)){
    openSafe(`https://www.google.com/search?q="${q}"`);
    await sleep(400);
    openSafe(`https://www.truecaller.com/search/${encodeURIComponent(q)}`);
    return;
  }

  if(isUsername(q)){
    const u = q.startsWith("@") ? q.slice(1) : q;
    openSafe(`https://www.google.com/search?q="${u}"`);
    await sleep(400);
    openSafe(`https://github.com/${u}`);
    return;
  }

  // Fallback
  openSafe(`https://www.google.com/search?q="${q}"`);
}

// ===== Geo =====
function initMap(){
  map = L.map("map").setView([20,0],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
}

async function locateIP(){
  const ip = document.getElementById("ip").value.trim();
  if(!isIP(ip)) return alert("Invalid IP");
  try{
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await res.json();
    if(!d.latitude) return alert("No geo data");
    if(marker) map.removeLayer(marker);
    marker = L.marker([d.latitude, d.longitude]).addTo(map);
    map.setView([d.latitude, d.longitude], 6);
  }catch(e){
    alert("Network issue");
  }
}

// ===== Report (auto notes) =====
(function autoNotes(){
  const notes = document.getElementById("notes");
  if(!notes) return;
  const h = getHistory();
  if(h.length){
    notes.value = h.map(x => `${x.ts} — ${x.q}`).join("\n");
  }
})();
