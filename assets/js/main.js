'use strict'

///trails 
// Required Arguments:
// key - Your private key
// lat - Latitude for a given area
// lon - Longitude for a given area

// Optional Arguments:
// maxDistance - Max distance, in miles, from lat, lon. Default: 30. Max: 200.
// maxResults - Max number of trails to return. Default: 10. Max: 500.
// sort - Values can be 'quality', 'distance'. Default: quality.
// minLength - Min trail length, in miles. Default: 0 (no minimum).
// minStars - Min star rating, 0-4. Default: 0.

// Example:
// https://www.hikingproject.com/data/get-trails?lat=40.0274&lon=-105.2519&maxDistance=10&key=200588064-443

// https://www.mountainproject.com/data/get-routes-for-lat-lon?lat=40.03&lon=-105.25&maxDistance=10&minDiff=5.6

let trailsData = [];



function geocodeAdress(place, trailType, distance, length, stars, sort){
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({'address': place}, function(results, status) {
    if (status === 'OK') {
      const centerLat = results[0].geometry.location.lat();
      const centerLng = results[0].geometry.location.lng();
      convertToParams(centerLat, centerLng, trailType, distance, length, stars, sort);
    }
    else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  })
}


function convertToParams(centerLat, centerLng, trailType, distance, length, stars, sort){ 
  let endpoint;
  const key = "200588064-443067deaa27cb0061f1ba22cb5dd120";
  if (trailType == "hiking"){
    endpoint = "https://www.hikingproject.com/data/get-trails";
  } 
  if (trailType == "running"){
    endpoint = "https://www.trailrunproject.com/data/get-trails";
  } 
  if (trailType == "mountain biking"){
    endpoint = "https://www.mtbproject.com/data/get-trails";
  } 
  const params = {
    lat : centerLat,
    lon : centerLng,
    maxDistance : distance,
    sort : sort,
    minLength : length,
    minStars : stars,
    key : key
  }
  const paramItems = Object.keys(params)
  .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`);
  const paramString = paramItems.join('&');
  const url = endpoint + "?" + paramString;
  requestUrl(url, centerLat, centerLng);
}

function requestUrl(url, centerLat, centerLng){
  initMap(centerLat, centerLng);
  fetch(url)
  .then(response =>{
    if (response.ok){
     return response.json()
    }
    throw new Error (response.statusText)
  })
  .then(responseJson => displayResults(responseJson))
  .catch(error => console.log(error.message))
}

function getDifficulty(difficulty){
  if (difficulty == "green"){
    return { 
      str : "EASY",
      color : "yellow"
     }
  }
  if (difficulty == "greenBlue"){
    return { 
      str : "EASY / INTERMEDIATE",
      color : "green" 
    }
  }
  if (difficulty == "blue"){
    return { 
      str : "INTERMEDIATE",
      color : "ltblue"
    }
  }
  if (difficulty == "blueBlack"){
    return  {
      str: "INTERMEDIATE / DIFFICULT",
      color : "blue"
    }
  }
  if (difficulty == "black"){
    return {
      str : "DIFFICULT",
      color : "purple"
    }
  }
  if (difficulty == "dBlack"){
    return {
      str :"EXTREMELY DIFFICULT",
      color : "black"
    }
  }
}

function displayResults(responseJson){
  for (let i = 0; i < responseJson.trails.length; i ++){
    let trail = responseJson.trails[i];
    let trailData =  {
      latitude : trail.latitude,
      longitude : trail.longitude,
      difficulty : getDifficulty(trail.difficulty),
      content :  function (){
        return '<img class="listItemImg" src="' + trail.imgSqSmall + '" alt="trail image">\
        <h3 class="listItemTile">' + trail.name + '</h3>\
        <p>' + trail.location + '</p>\
        <p>Rating:' + trail.stars + ' stars </p>\
        <p>Length:' + trail.length + 'miles. Difficulty:' + this.difficulty.str + '</p>\
        <button class="listItemDropDownButton">Show More</button>\
        <div class="dropDownSec">\
        <p>' + trail.summary + '</p>\
        <p>Coditions: ' + trail.conditionStatus + '</p>\
        <p>More info at <a href=" ' + trail.url + '" target="_blank"> ' + trail.url + '</a></p>\
        <p>getdirections</p>\
        <button class="closeListItemDropDown">See Less</button>\
        </div>'
      }
    };
  trailsData.push(trailData);    
  $('.js-resultsList').append(`<li>${trailData.content()}</li>`);
  // initMap(centerLat, centerLng);
  }
}

function initMap(centerLat, centerLng) {
 let mapProp= {
  center:new google.maps.LatLng(centerLat, centerLng),
  // center:new google.maps.LatLng(46.57566019999999, -122.71942619999999),
  zoom:10,
 };
let map = new google.maps.Map(document.getElementById("map"), mapProp); 
  makeTrailMarkers(map);
 }


function makeTrailMarkers(map){
  alert('hi');
 for (let i = 0; i < trailsData.length; i++){
  let trailData = trailsData[i];
  var latLng = new google.maps.LatLng(trailData.latitude, trailData.longitude);
  console.log(latLng);
  let url = "http://maps.google.com/mapfiles/ms/icons/";
  url += trailData.difficulty.color + "-dot.png";
  let infowindow = new google.maps.InfoWindow({
   content : trailData.content()
  });
  let marker = new google.maps.Marker({
    position: latLng,
    map: map,
    icon: {
      url: url
    }
  });
  marker.addListener('click', function() {
    infowindow.open(map, marker);
  });
 }
}


function watchForm(){
  $('#trailFinder').on('submit', function(event){
    event.preventDefault();
    let place = $('#place').val();  
    let trailType = $('#trailTypes').val();
    let distance = $('#distance').val();
    let length = $('#length').val();
    let stars = $('#stars').val();
    let sort = $('#sort').val();
    $('.js-resultsList').empty();
    geocodeAdress(place, trailType, distance, length, stars, sort);
  })
}

 $(watchForm);