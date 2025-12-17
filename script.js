 let map, marker;
let caseData = { correlations: [], timeline: [], evidence: [] };

function startApp() {
  document.getElementById("welcome").classList.add("hidden");
  document.getElementById("app").style.display = "block";
  initMap();
}

function show(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function add(type, value) {
  caseData.correlations.push(`${type}: ${value}`);
  correlation.textContent = caseData.correlations.join("\n");
}

/* OSINT */
function usernameOSINT(){ if(username.value) add("Username", username.value); }
function emailOSINT(){ if(email.value) add("Email", email.value); }
function domainOSINT(){ if(domain.value) add("Domain", domain.value); }
function ipOSINT(){ if(ip.value) add("IP", ip.value); }
function imageOSINT(){ window.open(`https://images.google.com/searchbyimage?image_url=${image.value}`); }
function vinOSINT(){ window.open(`https://vpic.nhtsa.dot.gov/decoder/Decoder?VIN=${vin.value}`); }
function phoneOSINT(){ window.open(`https://www.google.com/search?q="${phone.value}"`); }
function companyOSINT(){ window.open(`https://www.google.com/search?q="${company.value} company"`); }
function flightOSINT(){ window.open(`https://www.flightradar24.com/${flight.value}`); }
function shipOSINT(){ window.open(`https://www.marinetraffic.com/en/search?keyword=${ship.value}`); }
function personOSINT(){ window.open(`https://www.google.com/search?q="${person.value}"`); }

/* CASE */
function newCase() {
  caseData = { correlations: [], timeline: [], evidence: [] };
  correlation.textContent = timeline.textContent = evidenceList.textContent = "";
}

function addEvent() {
  caseData.timeline.push(`${new Date().toLocaleDateString()} | ${event.value} | ${eventSource.value}`);
  timeline.textContent = caseData.timeline.join("\n");
}

function addEvidence() {
  caseData.evidence.push(evidence.value);
  evidenceList.textContent = caseData.evidence.join("\n");
}

/* MAP */
function initMap() {
  map = L.map("map").setView([20,0],2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
}

async function locateIP() {
  const res = await fetch(`https://ipapi.co/${geoIP.value}/json/`);
  const d = await res.json();
  if (!d.latitude) return;
  if(marker) map.removeLayer(marker);
  marker = L.marker([d.latitude,d.longitude]).addTo(map);
  map.setView([d.latitude,d.longitude],6);
}

/* REPORT */
function generateReport() {
  finalReport.textContent =
`CASE REPORT

CORRELATION:
${caseData.correlations.join("\n")}

TIMELINE:
${caseData.timeline.join("\n")}

EVIDENCE:
${caseData.evidence.join("\n")}

DISCLAIMER:
Public data only.`;
}
