let map, marker;

function startPlatform() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("platform").classList.remove("hidden");
  initMap();
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* OSINT */
function usernameOSINT() {
  const u = username.value;
  window.open(`https://www.google.com/search?q="${u}"`);
  window.open(`https://github.com/${u}`);
  window.open(`https://twitter.com/${u}`);
}

function emailOSINT() {
  const e = email.value;
  window.open(`https://www.google.com/search?q="${e}"`);
  window.open(`https://haveibeenpwned.com/`);
}

function domainOSINT() {
  const d = domain.value;
  window.open(`https://who.is/whois/${d}`);
  window.open(`https://dnsdumpster.com/`);
}

function ipOSINT() {
  const i = ip.value;
  window.open(`https://ipinfo.io/${i}`);
}

/* GEO */
function initMap() {
  map = L.map('map').setView([20,0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
}

async function locateIP() {
  const ip = geoIP.value;
  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await res.json();

  if (!data.latitude) return alert("Invalid IP");

  if (marker) map.removeLayer(marker);
  marker = L.marker([data.latitude, data.longitude]).addTo(map)
    .bindPopup(`${data.city}, ${data.country_name}`)
    .openPopup();

  map.setView([data.latitude, data.longitude], 6);
}

/* SECURITY */
password.oninput = () => {
  const v = password.value;
  let score = 0;
  if (v.length >= 8) score++;
  if (/[A-Z]/.test(v)) score++;
  if (/[0-9]/.test(v)) score++;

  passResult.textContent =
    score <= 1 ? "Weak" :
    score === 2 ? "Moderate" :
    "Strong";
};

function browserCheck() {
  browserResult.textContent =
`HTTPS: ${location.protocol === "https:"}
Cookies Enabled: ${navigator.cookieEnabled}
User Agent: ${navigator.userAgent}`;
}

/* REPORT */
function generateReport() {
  finalReport.textContent =
`CASE ID: ${caseId.value}

FINDINGS:
${notes.value}

NOTE:
All data sourced from publicly available information.
No intrusion performed.`;
}
