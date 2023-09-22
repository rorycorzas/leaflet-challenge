
/* LEAFLET GEOJSON CHALLENGE 15 */

// Use this link to get the GeoJSON data, API endpoint
//let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
let link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/1.0_week.geojson";


/*
• Your data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
• Hint: The depth of the earth can be found as the third coordinate for each earthquake.
*/

// Perform a GET request to the query URL
d3.json(link).then(function(data) {
    //Send data.features object to the createFeatures function.
    console.log(data);
    createFeatures(data.features);
    //  L.geoJson(data).addTo(myMap);
});
// Create markers whose size increases with magnitude and color with depth
function createMarker(feature, latlong) {
    return L.circleMarker(latlong, {
        radius: markerSize(feature.properties.mag),
        fillColor: markerColor(feature.geometry.coordinates[2]),
        color:"#000",
        weight: 0.2,
        opacity: 0.5,
        fillOpacity: 1
    });
}

function createFeatures(data) {
    // Define a function that put each feature a popup with time/place of the event
    function onEachFeature(feature, layer) {
        layer.bindPopup(`<h3>Location:</h3> ${feature.properties.place}<h3> Magnitude:</h3> ${feature.properties.mag}<h3> Depth:</h3> ${feature.geometry.coordinates[2]}`);
    }

    // Create a GeoJSON layer that contains the features array on the earthquakeData object.
    let earthquakes = L.geoJSON(data, {
        onEachFeature: onEachFeature,
        pointToLayer: createMarker
    });

    // Send earthquakes layer to the createMap function
    createMap(earthquakes);
}

function createMap(earthquakes) {

  // Creating the map object, center: CDMX [19.436327423308374, -99.12929556333657], LAS VEGAS: [36.16918843170888, -115.14015527052456]
    let myMap = L.map("map", {
  //center: [19.436327423308374, -99.12929556333657],
      center: [36.16918843170888, -115.14015527052456],
      zoom: 5
   });

  // Adding the tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(myMap);


    // Create a control
    // Pass in baseMaps and overlayMaps
    // Add the control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap); 
    
    let legend = L.control({position: 'bottomright'});
    legend.onAdd = function (myMap) {

        let div = L.DomUtil.create('div', 'info legend'),
            grades = [-10, 10, 30, 60, 90],
            labels = [],
            legendInfo = "<h5>Magnitude</h5>";

        for (let i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
        }    

        return div;

        };
        legend.addTo(myMap);
}

// Increase marker size based on magnitude
function markerSize(magnitude) {
    return magnitude * 5;
}

// Change marker color based on depth
function markerColor(depth) {
    return depth > 90 ? '#d73027' :
            depth > 70 ? '#fc8d59' :
            depth > 50 ? '#fee08b' :
            depth > 30 ? '#d9ef8b' :
            depth > 10 ? '#91cf60' :
                         '#1a9850' ;          
}