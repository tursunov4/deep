<script setup lang="ts">
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { onMounted } from "vue";

let map;
let Icon = L.icon({
  iconUrl: "/logo.svg",
  iconSize: [30, 30],
});
onMounted(() => {
  map = L.map("map", { attributionControl: false, zoomControl: false }).setView(
    [55.83676, 37.44891],
    13
  );
  L.tileLayer(
    "https://api.mapbox.com/styles/v1/adminroman/clmurpl7r02k601qu2ne7g93e/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWRtaW5yb21hbiIsImEiOiJjbG11ajlhYWQwY2xpMmtxcHNqM3BoNzB0In0.p2XIJ6HLczRQyQWUotyCZw",
    {
      maxZoom: 19,
    }
  ).addTo(map);
  L.marker([55.837449, 37.446623], { icon: Icon })
    .bindPopup("<h1>DEPP DESIGN</h1><p>Москва, Ул Свободы 35 стр. 17")
    .openPopup()
    .addTo(map);
});
</script>
<template>
  <div id="map" class="w-full relative z-0 h-full"></div>
</template>

<style>
#map {
  background: white;
}

.leaflet-tile {
  filter: grayscale(100%) !important;
}
.leaflet-popup-content-wrapper {
  padding: 15px;
  background-color: #101010;
  color: #858585;
  font-size: 12px;
  border-radius: 0;
}

.leaflet-popup-tip {
  background-color: #101010;
}

.leaflet-popup-content-wrapper h1 {
  font-family: Arial;
  font-size: 40px;
  white-space: nowrap;
  color: white;
  text-align: center;
}

.leaflet-popup-content-wrapper {
  border-radius: 0;
}
</style>
