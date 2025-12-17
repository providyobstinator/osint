let map, marker;

/* START */
function startPlatform() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("platform").style.display = "block";
  initMap();
}

/* NAV */
function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

/* OSINT */
function usernameOSINT() {
  const u = username.value;
  if (!u) return;
  window.open(`https://www.google.com/search?q="${u}"`);
  window.open(`https://github.com/${u}`);
  window.open(`https://twitter.com/${u}`);
  window.open(`https://reddit.com/user/${u}`);
}

function emailOSINT() {
  const e = email.value;
  if (!e) return;
  window.open(`https://www.google.com/search?q="${e}"`);
  window.open(`https://haveibeenpwned.com/`);
}

function domainOSINT() {
  const d = domain.value;
  if (!d) return;
  window.open(`https://who.is/whois/${d}`);
  window.open(`https://dnsdumpster.com/`);
  window.open(`https://web.archive.org/${d}`);
}

function ipOSINT() {
  const i = ip.value;
  if (!i) return;
  window.open(`https://ipinfo.io/${i}`);
}

function imageOSINT() {
  const img = imageUrl.value;
  if (!img) return;
  window.open(`https://images.google.com/searchbyimage?image_url=${img}`);
  window.open(`https://yandex.com/images/search?rpt=imageview&url=${img}`);
}

/* MAP */
function initMap() {
  map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
}

async function locateIP() {
  const ip = geoIP.value;
  if (!ip) return;

  const res = await fetch(`https://ipapi.co/${ip}/json/`);
  const data = await res.json();

  if (!data.latitude) return alert("Invalid IP");

  if (marker) map.removeLayer(marker);

  marker = L.marker([data.latitude, data.longitude])
    .addTo(map)
    .bindPopup(`${data.city}, ${data.country_name}`)
    .openPopup();

  map.setView([data.latitude, data.longitude], 6);
}

/* SECURITY */
document.addEventListener("input", e => {
  if (e.target.id !== "password") return;
  const v = e.target.value;
  let s = 0;
  if (v.length >= 8) s++;
  if (/[A-Z]/.test(v)) s++;
  if (/[0-9]/.test(v)) s++;
  passResult.textContent = s <= 1 ? "Weak" : s === 2 ? "Moderate" : "Strong";
});

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
All analysis is based on publicly available data.
No unauthorized access performed.`;
}   
