let map;
let marker;

/* =========================
   PLATFORM START
========================= */
function startPlatform() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("platform").classList.add("active");
  initMap();
}

/* =========================
   SECTION SWITCHING
========================= */
function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => {
    p.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

/* =========================
   OSINT FUNCTIONS
========================= */
function usernameOSINT() {
  const u = document.getElementById("username").value;
  if (!u) return;

  window.open(`https://www.google.com/search?q="${u}"`);
  window.open(`https://github.com/${u}`);
  window.open(`https://twitter.com/${u}`);
}

function emailOSINT() {
  const e = document.getElementById("email").value;
  if (!e) return;

  window.open(`https://www.google.com/search?q="${e}"`);
  window.open(`https://haveibeenpwned.com/`);
}

function domainOSINT() {
  const d = document.getElementById("domain").value;
  if (!d) return;

  window.open(`https://who.is/whois/${d}`);
  window.open(`https://dnsdumpster.com/`);
}

function ipOSINT() {
  const i = document.getElementById("ip").value;
  if (!i) return;

  window.open(`https://ipinfo.io/${i}`);
}

/* =========================
   MAP OSINT
========================= */
function initMap() {
  map = L.map("map").setView([20, 0], 2);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);
}

async function locateIP() {
  const ip = document.getElementById("geoIP").value;
  if (!ip) return;

  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await res.json();

  if (!data.latitude) {
    alert("Invalid IP");
    return;
  }

  if (marker) map.removeLayer(marker);

  marker = L.marker([data.latitude, data.longitude])
    .addTo(map)
    .bindPopup(`${data.city}, ${data.country_name}`)
    .openPopup();

  map.setView([data.latitude, data.longitude], 6);
}

/* =========================
   SECURITY
========================= */
document.addEventListener("input", (e) => {
  if (e.target.id !== "password") return;

  const v = e.target.value;
  let score = 0;

  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;

  const out = document.getElementById("passResult");

  out.textContent =
    score <= 1 ? "Weak" :
    score === 2 ? "Moderate" :
    "Strong";
});

function browserCheck() {
  document.getElementById("browserResult").textContent =
`HTTPS: ${location.protocol === "https:"}
Cookies Enabled: ${navigator.cookieEnabled}
User Agent: ${navigator.userAgent}`;
}

/* =========================
   REPORTING
========================= */
function generateReport() {
  const id = document.getElementById("caseId").value;
  const notes = document.getElementById("notes").value;

  document.getElementById("finalReport").textContent =
`CASE ID: ${id}

FINDINGS:
${notes}

DISCLAIMER:
All analysis based on publicly available information.
No intrusion or unauthorized access performed.`;
}
