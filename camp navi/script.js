let map;
let startMarker;
let destinationMarker;
let routeLine;
let movingMarker;
let animationInterval;

// Campus coordinates
const campusLocations = {
    "Main Gate": [13.0492, 80.0745],
    "Admin Block": [13.0488, 80.0752],
    "CSE Block": [13.0485, 80.0758],
    "ECE Block": [13.0483, 80.0754],
    "Library": [13.0489, 80.0760],
    "Boys Mess": [13.0489, 80.0760],
    "Girls Mess": [13.0489, 80.0760],
    "Boys Hostel": [13.0489, 80.0760],
    "Girls Hostel": [13.0489, 80.0760],
    "EEE Block": [13.0489, 80.0760],
    "Mech Block": [13.0489, 80.0760],
    "CSBS Block": [13.0489, 80.0760],
};

// INIT MAP
window.onload = function () {

    map = L.map('map').setView([13.0489, 80.0750], 17);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    document.getElementById("routeBtn").addEventListener("click", findRoute);
    document.getElementById("askBtn").addEventListener("click", chatbot);
    document.getElementById("voiceBtn").addEventListener("click", startVoice);
};


// FIND ROUTE WITH ANIMATION
function findRoute() {

    const source = document.getElementById("source").value;
    const destination = document.getElementById("destination").value;

    const sourceCoords = campusLocations[source];
    const destCoords = campusLocations[destination];

    if (!sourceCoords || !destCoords) {
        alert("Select valid locations.");
        return;
    }

    // Clear old stuff
    if (startMarker) map.removeLayer(startMarker);
    if (destinationMarker) map.removeLayer(destinationMarker);
    if (routeLine) map.removeLayer(routeLine);
    if (movingMarker) map.removeLayer(movingMarker);
    if (animationInterval) clearInterval(animationInterval);

    // Add markers
    startMarker = L.marker(sourceCoords).addTo(map).bindPopup(source).openPopup();
    destinationMarker = L.marker(destCoords).addTo(map).bindPopup(destination);

    // Animated dashed path
    routeLine = L.polyline([sourceCoords, destCoords], {
        color: "#6366f1",
        weight: 5,
        dashArray: "10, 10"
    }).addTo(map);

    // Fit map
    map.fitBounds([sourceCoords, destCoords]);

    // Create moving marker
    movingMarker = L.circleMarker(sourceCoords, {
        radius: 8,
        color: "#ec4899",
        fillColor: "#ec4899",
        fillOpacity: 1
    }).addTo(map);

    animateMovement(sourceCoords, destCoords);
}


// ANIMATION FUNCTION
function animateMovement(start, end) {

    let steps = 100;
    let currentStep = 0;

    const latStep = (end[0] - start[0]) / steps;
    const lngStep = (end[1] - start[1]) / steps;

    animationInterval = setInterval(() => {

        if (currentStep >= steps) {
            clearInterval(animationInterval);
            return;
        }

        const newLat = start[0] + latStep * currentStep;
        const newLng = start[1] + lngStep * currentStep;

        movingMarker.setLatLng([newLat, newLng]);

        currentStep++;

    }, 40); // speed (lower = faster)
}


// CHATBOT
function chatbot() {

    const input = document.getElementById("chatInput").value.toLowerCase();
    let response = "Hmm I’m not sure about that 😅";

    if (input.includes("library"))
        response = "Library is near CSE Block 📚";
    else if (input.includes("canteen"))
        response = "Canteen is beside ECE Block 🍽️";
    else if (input.includes("admin"))
        response = "Admin Block is near the Main Gate 🏫";

    document.getElementById("chatResponse").innerText = response;
}


// VOICE INPUT
function startVoice() {

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US";

    recognition.onresult = function (event) {
        const speech = event.results[0][0].transcript;
        document.getElementById("chatInput").value = speech;
        chatbot();
    };

    recognition.start();
}