// Create the 'basemap' tile layer that will be the background of our map.

var map = L.map('map').setView([37.7749, -122.4194], 5);

// Add the basemap (tile layer) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to style each earthquake marker based on magnitude and depth
function styleInfo(feature) {
    return {
        fillColor: getColor(feature.geometry.coordinates[2]),  
        weight: 0.5,
        opacity: 1,
        fillOpacity: 0.7,
        radius: getRadius(feature.properties.mag)  
    };
}

// Function to determine marker color based on earthquake depth
function getColor(depth) {
    if (depth <= 10) return "#00FF00";  // Shallow (Green)
    else if (depth <= 30) return "#FFFF00";  // Moderate (Yellow)
    else if (depth <= 50) return "#FF7F00";  // Deep (Orange)
    else return "#FF0000";  // Very deep (Red)
}

// Function to determine marker radius based on earthquake magnitude
function getRadius(magnitude) {
    return magnitude * 2.5;  // Increase this value for larger markers, adjust as needed
}

// Fetch earthquake data in GeoJSON format
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson").then(function (data) {
    L.geoJson(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: styleInfo,  // Apply the styling function
        onEachFeature: function (feature, layer) {
            layer.bindPopup("Magnitude: " + feature.properties.mag + "<br>Location: " + feature.properties.place + 
                             "<br>Depth: " + feature.geometry.coordinates[2] + " km");
        }
    }).addTo(map);

    // Add a legend to explain the colors based on depth
    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function () {
        var div = L.DomUtil.create('div', 'info legend');
        var depthLabels = ['0-10 km', '11-30 km', '31-50 km', '50+ km'];
        var colors = ["#00FF00", "#FFFF00", "#FF7F00", "#FF0000"];
        
        // Loop through the depth ranges and add colored squares to the legend
        for (var i = 0; i < depthLabels.length; i++) {
            div.innerHTML += '<i style="background:' + colors[i] + '"></i> ' + depthLabels[i] + '<br>';
        }
        return div;
    };

    legend.addTo(map);
});