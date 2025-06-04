let map;
let socket;
let playerMarker;
const goldMarkers = {};

function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

async function init() {
  initMap();
  const res = await fetch('/session');
  if (res.ok) {
    const data = await res.json();
    document.getElementById('login').style.display = 'none';
    document.getElementById('goldValue').textContent = data.gold;
    connect();
    startLocation();
  } else {
    document.getElementById('login').style.display = 'block';
  }
}

function connect() {
  socket = new WebSocket(`ws://${location.host}/ws`);
  socket.onmessage = evt => {
    const data = JSON.parse(evt.data);
    if (data.type === 'init') {
      document.getElementById('goldValue').textContent = data.user.gold;
      data.gold.forEach(addGoldMarker);
    } else if (data.type === 'goldSpawn') {
      addGoldMarker(data);
    } else if (data.type === 'goldCollected') {
      document.getElementById('goldValue').textContent = data.gold;
      removeGoldMarker(data.goldId);
      addStatus(`Collected ${data.amount} gold`);
    } else if (data.type === 'chat') {
      addChat(`${data.from}: ${data.message}`);
    }
  };
}

function startLocation() {
  navigator.geolocation.watchPosition(pos => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    if (!playerMarker) {
      playerMarker = L.marker([lat, lng]).addTo(map);
      map.setView([lat, lng], 16);
    } else {
      playerMarker.setLatLng([lat, lng]);
    }
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify({ type: 'locationUpdate', latitude: lat, longitude: lng }));
    }
  });
}

function addGoldMarker(g) {
  const m = L.marker([g.lat, g.lng]).addTo(map);
  goldMarkers[g.id] = m;
}

function removeGoldMarker(id) {
  const m = goldMarkers[id];
  if (m) { map.removeLayer(m); delete goldMarkers[id]; }
}

function addStatus(msg) {
  const div = document.getElementById('status');
  const el = document.createElement('div');
  el.textContent = msg;
  div.prepend(el);
}

function addChat(msg) {
  const log = document.getElementById('chatLog');
  const el = document.createElement('div');
  el.textContent = msg;
  log.appendChild(el);
}

document.getElementById('login').addEventListener('click', () => {
  window.location = '/login';
});
document.getElementById('chatButton').addEventListener('click', () => {
  document.getElementById('chatModal').style.display = 'block';
});
document.getElementById('chatSend').addEventListener('click', () => {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (msg && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({ type: 'chat', message: msg }));
  }
  input.value = '';
});
window.addEventListener('click', e => {
  if (e.target.id === 'chatModal') {
    document.getElementById('chatModal').style.display = 'none';
  }
});

init();
