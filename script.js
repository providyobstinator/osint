let map, marker;

function startApp() {
  document.getElementById("welcome").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function showSection(id) {
  document.querySelectorAll(".panel").forEach(p => p.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");

  if (id === "geo" && !map) {
    setTimeout(initMap, 200);
  }
}

/* OSINT */
function searchOSINT() {
  const q = document.getElementById("query").value;
  if (!q) return;
  window.open(`https://www.google.com/search?q="${q}"`, "_blank");
}

/* MAP */
function initMap() {
  map = L.map("map").setView([20, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
}

async function locateIP() {
  const ip = document.getElementById("ip").value;
  if (!ip) return;

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const d = await res.json();

    if (!d.latitude) return alert("Invalid IP");

    if (marker) map.removeLayer(marker);
    marker = L.marker([d.latitude, d.longitude]).addTo(map);
    map.setView([d.latitude, d.longitude], 6);
  } catch {
    alert("Network error");
  }
}
