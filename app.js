// script.js
const map = L.map('map').setView([51.505, -0.09], 13); // Set initial view to London

// Add a tile layer (map tiles from OpenStreetMap)
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
// Add zoom controls
map.zoomControl.setPosition('topright');

// Add a marker
const marker = L.marker([51.5, -0.09]).addTo(map)
    .bindPopup('A sample location.')
    .openPopup();
    document.getElementById('search-button').addEventListener('click', () => {
        const query = document.getElementById('search-input').value;
        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    const lat = parseFloat(data[0].lat);
                    const lon = parseFloat(data[0].lon);
                    map.setView([lat, lon], 13);
                    L.marker([lat, lon]).addTo(map)
                        .bindPopup(`Location: ${data[0].display_name}`)
                        .openPopup();
                } else {
                    alert('Location not found!');
                }
            });
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 13);
            L.marker([latitude, longitude]).addTo(map)
                .bindPopup('You are here!')
                .openPopup();
        }, error => {
            console.error('Error getting location:', error);
        });
    } else {
        alert('Geolocation is not supported by your browser.');
    }
    const customIcon = L.icon({
        iconUrl: 'assets/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34]
    });
    
    L.marker([51.5, -0.09], { icon: customIcon }).addTo(map)
        .bindPopup('Custom marker!')
        .openPopup();
        function getRoute(start, end) {
            fetch(`https://router.project-osrm.org/route/v1/driving/${start.lng},${start.lat};${end.lng},${end.lat}?overview=full`)
                .then(response => response.json())
                .then(data => {
                    const route = L.geoJSON(data.routes[0].geometry).addTo(map);
                    map.fitBounds(route.getBounds());
                });
        }
        const satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenTopoMap'
        });
        
        const terrainLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap'
        });
        
        const baseLayers = {
            'Satellite': satelliteLayer,
            'Terrain': terrainLayer
        };
        
        L.control.layers(baseLayers).addTo(map);
        // Example usage
        // getRoute({ lat: 51.5, lng: -0.09 }, { lat: 51.51, lng: -0.1 });