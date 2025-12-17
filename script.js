function openExternal(url) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/* BASIC OSINT */
function usernameOSINT() {
  if (!username.value) return;
  openExternal(`https://www.google.com/search?q="${username.value}"`);
}

function emailOSINT() {
  if (!email.value) return;
  openExternal(`https://www.google.com/search?q="${email.value}"`);
}

function domainOSINT() {
  if (!domain.value) return;
  openExternal(`https://who.is/whois/${domain.value}`);
}

function ipOSINT() {
  if (!ip.value) return;
  openExternal(`https://ipinfo.io/${ip.value}`);
}

function imageOSINT() {
  if (!image.value) return;
  openExternal(`https://images.google.com/searchbyimage?image_url=${image.value}`);
}

/* VEHICLE */
function vinOSINT() {
  if (!vin.value) return;
  openExternal(`https://vpic.nhtsa.dot.gov/decoder/Decoder?VIN=${vin.value}`);
}

/* PHONE */
function phoneOSINT() {
  if (!phone.value) return;
  openExternal(`https://www.google.com/search?q="${phone.value}"`);
}

/* COMPANY */
function companyOSINT() {
  if (!company.value) return;
  openExternal(`https://www.google.com/search?q="${company.value} company"`);
}

/* FLIGHT */
function flightOSINT() {
  if (!flight.value) return;
  openExternal(`https://www.flightradar24.com/${flight.value}`);
}

/* SHIP */
function shipOSINT() {
  if (!ship.value) return;
  openExternal(`https://www.marinetraffic.com/en/search?keyword=${ship.value}`);
}

/* PERSON */
function personOSINT() {
  if (!person.value) return;
  openExternal(`https://www.google.com/search?q="${person.value}"`);
} 
