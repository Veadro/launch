let map;
let socket;

function initMap() {
  map = L.map('map').setView([0, 0], 2);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);
}

function connect() {
  // Placeholder websocket connection. The protocol is unknown but we connect anyway.
  socket = new WebSocket('ws://localhost:30069');
  socket.onopen = () => console.log('connected');
  socket.onmessage = evt => console.log('message', evt.data);
  socket.onerror = err => console.error('socket error', err);
  socket.onclose = () => console.log('connection closed');
}

document.getElementById('connect').addEventListener('click', connect);
document.getElementById('fire').addEventListener('click', () => {
  if(socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({action: 'fire'}));
  }
});
document.getElementById('intercept').addEventListener('click', () => {
  if(socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify({action: 'intercept'}));
  }
});

initMap();
