// Store our API endpoint as queryUrl
var queryUrl = "https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2014-01-01&endtime=" +
  "2014-01-02&maxlongitude=-69.52148437&minlongitude=-123.83789062&maxlatitude=48.74894534&minlatitude=25.16517337";

d3.json(queryUrl).then(data => createMap(data))
// d3.json(queryUrl, data => createMap(data))
function createMap(data)
{
  var myMap = MapObject();
  var baseLayers = crateBaseLayers(); //baselayers is a dictionary/Object
  var markers = createMarkers(data.features);
  var overlayMaps = { 
    Earthquakes: markers
  };
  var controls = L.control.layers(baseLayers, overlayMaps, { collapsed: true ,
    position: "bottomleft"});
  
  var layers = L.layerGroup([baseLayers["pencil"], markers ]);

  myMap.addLayer(layers)
  //myMap.addLayer(markers)
  //myMap.addLayer(alllayers)
  myMap.addControl(controls)

}
/************************************************************/
// This is creating a map object, seperate function so you can change it with ease here
function MapObject(){
  return L.map("map", {
    center: [ 37.09, -95.71 ],
    zoom: 5
  });  
}
/************************************************************/
function crateBaseLayers() {
  //API url
  urltemplate = "https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}";

  /* This is the list of base layers that we are adding to the map. 
  This will appear on the control list, where user will be able to select only 
  one of them at a time
  */
  var mapids = {
    "Street Map": "mapbox.streets",
    "Dark Map": "mapbox.dark",
    "Satellite": "mapbox.satellite",
    "Satellite Street": "mapbox.streets-satellite",
    "Light": "mapbox.light",
    "Wheatpaste": "mapbox.wheatpaste",
    "Comic": "mapbox.comic",
    "pencil": "mapbox.pencil",
    "Emerald": "mapbox.emerald",
    "Pirates": "mapbox.pirates"
  }

  /* This is function defined inside this funciton and it will be used later on to
    when we add each layer to the baseMaps object
  */
  function basemap(id) {
    return {
      attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
      "maxZoom": 18,
      "id": id,
      "accessToken": API_KEY
    }
  }


  var baseMaps = {}
  for (key in mapids) {
    baseMaps[key] = L.tileLayer(urltemplate, basemap(mapids[key]));
  }

  return baseMaps
}

/************************************************************/
function createMarkers(data) {
  // Define a function we want to run once for each feature in the features array
  // Give each feature a popup describing the place and time of the earthquake
  function onEachFeatureFunc(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Create a GeoJSON layer containing the features array on the data object
  // Run the onEachFeature function once for each piece of data in the array
  return L.geoJSON(data, { onEachFeature: onEachFeatureFunc  });

}
/************************************************************/

// FROM MARKER LEAFLET DOC
// var map = L.map('map').setView([39.9897471840457, -75.13893127441406], 11)

// // Add basemap
// L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
//   maxZoom: 18,
//   attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
// }).addTo(map)

// // Add GeoJSON
// $.getJSON('./crimes_by_district.geojson', function (geojson) {
//   L.choropleth(geojson, {
//     valueProperty: 'incidents',
//     scale: ['white', 'red'],
//     steps: 5,
//     mode: 'q',
//     style: {
//       color: '#fff',
//       weight: 2,
//       fillOpacity: 0.8
//     },
//     onEachFeature: function (feature, layer) {
//       layer.bindPopup('District ' + feature.properties.dist_num + '<br>' +
//           feature.properties.incidents.toLocaleString() + ' incidents')
//     }
//   }).addTo(map)
// })