<template>
  <!-- ensure the map sits behind any fixed header by resetting z-index and using relative positioning -->
  <div ref="mapContainer" class="w-full h-64 rounded-lg relative z-0"></div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  zoom: { type: Number, default: 13 },
  title: { type: String, default: 'Item Location' },
  selectable: { type: Boolean, default: false },
});

const emit = defineEmits(['selected'])
const mapContainer = ref(null);
let map = null;

onMounted(async () => {
  if (!mapContainer.value) return;

  // Dynamically import Leaflet only on the client side to avoid SSR "window is not defined" error
  const L = (await import('leaflet')).default;
  await import('leaflet/dist/leaflet.css');

  map = L.map(mapContainer.value).setView([props.latitude, props.longitude], props.zoom);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors',
  }).addTo(map);

  const marker = L.marker([props.latitude, props.longitude]).addTo(map);

  if (props.selectable) {
    map.on('click', (e) => {
      const { lat, lng } = e.latlng;
      marker.setLatLng([lat, lng]);
      marker.bindPopup(`Selected location`).openPopup();
      emit('selected', { latitude: lat, longitude: lng });
    });
  } else {
    marker.bindPopup(props.title).openPopup();
  }
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>