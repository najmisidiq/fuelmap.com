// =====================
// GLOBAL
// =====================
let konsumsi = 40;
let map;
let marker;
let targetInput = "";
let directionsService;
let directionsRenderer;

// autocomplete
let autocompleteAwal;
let autocompleteTujuan;

// =====================
// PILIH KENDARAAN
// =====================
function pilihKendaraan(km, el) {
  konsumsi = km;

  document.querySelectorAll(".vehicle button")
    .forEach(btn => btn.classList.remove("active"));

  el.classList.add("active");
}

// =====================
// MAP MODAL
// =====================
function openMap(target) {
  document.getElementById("mapModal").style.display = "flex";
  targetInput = target;
}

function closeMap() {
  document.getElementById("mapModal").style.display = "none";
}

// =====================
// INIT MAP + AUTOCOMPLETE
// =====================
function initMap() {

  let center = { lat: -7.25, lng: 112.75 };

  map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: center,
  });

  directionsService = new google.maps.DirectionsService();

  directionsRenderer = new google.maps.DirectionsRenderer({
    map: map
  });

  // =====================
  // AUTOCOMPLETE AWAL
  // =====================
  autocompleteAwal = new google.maps.places.Autocomplete(
    document.getElementById("searchAwal")
  );

  autocompleteAwal.addListener("place_changed", function () {
    let place = autocompleteAwal.getPlace();

    if (!place.geometry) return;

    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();

    document.getElementById("latAwal").value = lat;
    document.getElementById("longAwal").value = lng;
  });

  // =====================
  // AUTOCOMPLETE TUJUAN
  // =====================
  autocompleteTujuan = new google.maps.places.Autocomplete(
    document.getElementById("searchTujuan")
  );

  autocompleteTujuan.addListener("place_changed", function () {
    let place = autocompleteTujuan.getPlace();

    if (!place.geometry) return;

    let lat = place.geometry.location.lat();
    let lng = place.geometry.location.lng();

    document.getElementById("latTujuan").value = lat;
    document.getElementById("longTujuan").value = lng;
  });

  // =====================
  // CLICK MAP
  // =====================
  map.addListener("click", function(e) {

    let lat = e.latLng.lat();
    let lng = e.latLng.lng();

    if (marker) marker.setMap(null);

    marker = new google.maps.Marker({
      position: e.latLng,
      map: map,
    });

    if (targetInput === "awal") {
      document.getElementById("latAwal").value = lat;
      document.getElementById("longAwal").value = lng;
    } else {
      document.getElementById("latTujuan").value = lat;
      document.getElementById("longTujuan").value = lng;
    }

    closeMap();
  });
}

// =====================
// HITUNG + RUTE
// =====================
function hitungBBM() {

  let lat1 = parseFloat(document.getElementById("latAwal").value);
  let lon1 = parseFloat(document.getElementById("longAwal").value);
  let lat2 = parseFloat(document.getElementById("latTujuan").value);
  let lon2 = parseFloat(document.getElementById("longTujuan").value);

  if (isNaN(lat1) || isNaN(lon1) || isNaN(lat2) || isNaN(lon2)) {
    alert("Isi koordinat dengan benar!");
    return;
  }

  let request = {
    origin: { lat: lat1, lng: lon1 },
    destination: { lat: lat2, lng: lon2 },
    travelMode: 'DRIVING'
  };

  directionsService.route(request, function(result, status) {

    if (status === 'OK') {

      directionsRenderer.setDirections(result);
      document.getElementById("mapModal").style.display = "flex";

      let jarakMeter = result.routes[0].legs[0].distance.value;
      let jarakKm = jarakMeter / 1000;

      let bbm = jarakKm / konsumsi;
      let harga = parseFloat(document.getElementById("bbm").value);
      let biaya = bbm * harga;

      document.getElementById("jarak").innerText = jarakKm.toFixed(2) + " Km";
      document.getElementById("bbmHasil").innerText = bbm.toFixed(2) + " Liter";
      document.getElementById("biaya").innerText = "Rp " + biaya.toLocaleString();

    } else {
      alert("Gagal menghitung rute!");
    }

  });
}

// =====================
// UPDATE HARGA BBM
// =====================
document.getElementById("bbm").addEventListener("change", function() {
  let harga = parseInt(this.value);
  document.getElementById("hargaBBM").innerText =
    "Rp " + harga.toLocaleString() + "/Ltr";
});