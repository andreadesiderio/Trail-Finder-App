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


function convertToParams(trailType, lat, lon, distance, length, stars, sort){
  let endpoint;
  const key = "200588064-443067deaa27cb0061f1ba22cb5dd120"
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
    lat : lat,
    lon : lon,
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
  requestUrl(url);
}

function requestUrl(url){
  console.log(url);
  fetch(url)
  .then(response =>{
     if (response.ok){
    return response.json()}
    throw new Error (response.statusText)
  })
  .then(responseJson => displayResults(responseJson))
  .catch(error => console.log(error.message))
}

function getDifficulty(difficulty){
  if (difficulty == "green"){
    return "EASY"
  }
  if (difficulty == "BLUE"){
    return "INTERMEDIATE"
  }
  if (difficulty == "greenBlue"){
    return "EASY / INTEMEDIATE";
  }
  if (difficulty == "blue"){
    return  "INTERMEDIATE"
  }
  if (difficulty == "blueBlack"){
    return "DIFFICULT"
  }
  if (difficulty == "dBlack"){
    return "EXTREMELY DIFFICULT"
  }
}

function displayResults(responseJson){
  let trailCoords = [];
  console.log(responseJson);
  for (let i = 0; i < responseJson.trails.length; i ++){
    let trail = responseJson.trails[i];
    let difficulty = trail.difficulty;
    $('.js-resultsList').append(`<li>
    <img class="listItemImg" src="${trail.imgSqSmall}" alt="trail image">
    <h3 class="listItemTile">${trail.name}</h3>
    <p>${trail.location}</p>
    <p>Rating: ${trail.stars} stars </p>
    <p>Length: ${trail.length} miles. Difficulty: ${getDifficulty(difficulty)}</p>
    <button class="listItemDropDownButton">Show More</button>
    <div class="dropDownSec">
    <p>${trail.summary}</p>
    <p>Coditions: ${trail.conditionStatus}</p>
    <p>More info at <a href="${trail.url}" target="_blank">${trail.url}</a></p>
    <p>getdirections</p>
    <button class="closeListItemDropDown">See Less</button>
    </div>
    </li>`);
    let trailCoord =  {
      latitude : trail.latitude,
    longitude : trail.longitude
  };
    trailCoords.push(trailCoord);
    console.log(trailCoords);
  }
}


function watchForm(){
  $('#trailFinder').on('submit', function(event){
    event.preventDefault();
    let trailType = $('#trailTypes').val();
    let lat = $('#lat').val();
    let lon = $('#lon').val();
    let distance = $('#distance').val();
    let length = $('#length').val();
    let stars = $('#stars').val();
    let sort = $('#sort').val();
    $('.js-resultsList').empty();
    convertToParams(trailType, lat, lon, distance, length, stars, sort);
  })
}

$(watchForm);