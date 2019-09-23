//MAP GEOLOCATION
// if (navigator.geolocation){
// navigator.geolocation.getCurrentPosition(function (position){
//   let Coordinates = {
//     lat: position.coords.latitude,
//     lng: position.coords.longitude
//   }
// map.setCenter(Coordinates);
// },
// function (){
//   handleLocationError(alert("Geolocation service failed"), map.getCenter());
// });
// }
// else {
//   handleLocationError(alert("No geolocation available"), map.getCenter())
// }
 

//SEARCH BAR AND PLACES MARKERS
// let input = document.getElementById('search');
//   let searchBox = new google.maps.places.SearchBox(input);

// map.addListener('bounds_changed', function (){
// searchBox.setBounds(map.getBounds());
// });

// let markers = [];

// searchBox.addListener('places_changed', function (){
//   let places = searchBox.getPlaces();

//   if (places.length === 0)
//   return;

//   markers.forEach(function (marker){
//     marker.setMap(null); 
//   });
//   markers = [];

//   let bounds = new google.maps.LatLngBounds();
//   places.forEach(function(p) {
//     if (!p.geometry)
//       return;

//   markers.push(new google.maps.Marker({
//     map: map,
//     titlle: p.name,
//     position: p.geometry.location
//   }));

// if (p.geometry.viewport)
//         bounds.union(p.geometry.viewport);

//       else
//         bounds.extend(p.geometry.location);
//     });
    
//     map.fitBounds(bounds);
//     let a = p.geometry.location.lat();
//     let b = p.geometry.location.lng();
//       watchForm(a, b);
//     });