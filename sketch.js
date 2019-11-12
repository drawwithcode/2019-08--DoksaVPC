//declaring the map variable
var myMap;
//declaring the variable for the canvas
var canvas;
//declaring and creating a new Mappa object using mapbox
var mappa = new Mappa(
  "MapboxGL",
  "pk.eyJ1IjoiZG9rc2F2cGMiLCJhIjoiY2sybTUxeXJnMGQycjNqbjVrYjE5dmg3YyJ9.n7CmQCAd4zSI0VxLgEb4DA"
);
//declaring the variables for user position, latitude and longitude
var myPosition;
var myLat;
var myLon;
//declaring the elements for the country selection (a container div, a text and a selection element)
var selDiv;
var selText;
var sel;
//declaring the variables for latitude and longitude of the selected country's capital
var capitalLat;
var capitalLon;
//declaring the variable for the json file
var data;
//declaring the variable for the index number of the selected country, this will be helpful to return the capital of the selected country
var selIndex;
//declaring the starting options for the map using my custom mapbox style
var options = {
  lat: 0,
  lng: 0,
  zoom: 2,
  style: "mapbox://styles/doksavpc/ck2wcr5860thl1ctmmn6h39su"
};
//preloading the data about the countries and capitals
function preload() {
  data = loadJSON("./assets/country-capitals.json");
}

function setup() {
  //creating the canvas
  canvas = createCanvas(windowWidth, windowHeight);
  ellipseMode(CENTER);
  //getting the user position using the geolocation
  myPosition = getCurrentPosition();
  //creating the map and makeing it overlay the canvas
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  //creating and styling the html elements for the country selection (a container div, a title and the selection input)
  selDiv = createDiv();
  selDiv.position(40, 80);
  selDiv.style("z-index", "999");
  selDiv.style("background-color", "white");
  selDiv.style("padding", "20px");
  selDiv.style("border-radius", "5px");
  selDiv.style("border", "2px solid rgba(0, 0, 0, 0.3)");
  selText = createElement("h1", "Select a Country");
  selText.parent(selDiv);
  sel = createSelect();
  sel.id("mySelect");
  //creating an option for every country stored in the json file in the selection input
  for (var i = 0; i < data.countries.length; i++) {
    sel.option(data.countries[i].CountryName);
  }
  sel.parent(selDiv);
}

function draw() {
  clear();
  //getting the index number from the selected option, in order to get the data of the capital according to the country
  var selIndex = document.getElementById("mySelect").selectedIndex;
  capitalLat = data.countries[selIndex].CapitalLatitude;
  capitalLon = data.countries[selIndex].CapitalLongitude;
  //setting the latitude and longitude of the user
  myLat = myPosition.latitude;
  myLon = myPosition.longitude;
  //mapping latitude and longitude of user and capital into pixel dimensionss
  var capital = myMap.latLngToPixel(capitalLat, capitalLon);
  var me = myMap.latLngToPixel(myLat, myLon);
  //rounded distance between user and selected coutry's capital in kilometers
  var distance = Math.round(
    calcGeoDistance(myLat, myLon, capitalLat, capitalLon, "km")
  );
  //drawing circles and text in corrispondence of the user and the city, and a line connecting them
  push();
  strokeWeight(4);
  stroke("LightCoral");
  line(me.x, me.y, capital.x, capital.y);
  fill("white");
  ellipse(me.x, me.y, 25);
  ellipse(capital.x, capital.y, 25);
  pop();
  textAlign(CENTER);
  textSize(20);
  fill(50);
  textStyle(BOLD);
  text(data.countries[selIndex].CapitalName, capital.x, capital.y - 20);
  text("You", me.x, me.y - 20);
  text(distance + " km", (me.x + capital.x) / 2, (me.y + capital.y) / 2 - 20);
}
