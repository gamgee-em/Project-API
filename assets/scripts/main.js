console.log('js connected');

// open weather API call using the city query
let owApiRequest; 
let owCityRequest;
// ticketmaster API using the city query
let tmApiRequest;
// search button for on click event
let searchBtn = $('.custom-button');
let geoBtn = $('#geo-btn');
// formats string from input to match url query 
let eventObj = [];
let hourObj = [];
let iconObj = [];
let tmEvents = [];
let tmEmbeddedKey = [];
let tmData = [];
let owData = [];
let owCityData;
let owDataObj = [];
let citySearch;
let displayCity; 
// displays current day to match TM date structure Example(2021-04-12)
let currentDate = moment().format('YYYY-MM-DD');
// TICKET MASTER API CALL
const getTmData = async () => {
  tmApiRequest = `https://app.ticketmaster.com/discovery/v2/events.json?city=${citySearch}&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM`;
  const tmResponse = await fetch(tmApiRequest);
  tmData = await tmResponse.json();
  tmEmbeddedKey = tmData._embedded;
  // events object
  tmEvents = tmEmbeddedKey.events;
  // gets date for event
  let dates = tmEvents[0].dates.start.localDate;
  console.log(tmData)
  renderHtml();
  return tmData;
}

  // OPEN WEATHER API CALL
const getOwData = async () => {
  console.log('getOwData being reached')
  console.log(citySearch)
  owCityRequest = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=84d61ff029585a95fbd34cf405a10229`;
  // this calls the api w/ the users input to get the lat and lon for the owApiRequest url query
  const owCityResponse = await fetch(owCityRequest);
  owCityData = await owCityResponse.json();
  owCityObj = {
    lat:owCityData.coord.lat,
    lon:owCityData.coord.lon
  };
  owApiRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${owCityObj.lat}&lon=${owCityObj.lon}&exclude=daily&appid=84d61ff029585a95fbd34cf405a10229&units=imperial`;
  const owResponse = await fetch(owApiRequest);
  owData = await owResponse.json();
  owDataObj = {
    hour: owData.hourly.temp,
    icon: owData.current.weather,
  };

  renderHtml();
  return owData;
};

// renderHtml to browswer
function renderHtml() {
  // add class to loading-image to hide content
  $('#loading-image').addClass('hide');
  // remove class from main-block & weather-block to show content
  $('.weather-block').removeClass('hide');
  $('.main-block').removeClass('hide');

    // loop over objects and populate content
    tmEvents.forEach((date, i) => {
      // updates event title in card
      $(`#title${i}`).html(tmEvents[i].name)
      // updates event image in card
      $(`#img${i}`).attr({
        src: tmEvents[i].images[1].url
      });
      
      // updates link url in card
      $(`#url-link${i}`).attr({
        // changes html tag href to event page url
        href: tmEvents[i].url,
        // opens link in new tab
        target: '_blank'
      }).html('Click for Ticket Sales');
      
      // updates weather h4 html text to users city
      $('#your-city-weather').html(`Today's weather in ${displayCity}`);
      
      // updates event card h4 html text to users city
      $('#your-city-card').html(`Events happening in ${displayCity} today`);
      // updates event card p html text to event distance from you
      $('#distance' + i).html(tmEvents[i]._embedded.venues[0].name)
      // adds link to twitter account
      if (i <= 3) {
        $('#tweet' + i).attr({
          href: tmEvents[i]._embedded.attractions[0].externalLinks.twitter[0].url,
          target: '_blank'
        }).html('Click for latest Tweet!'); 
      }

      if (currentDate == tmEvents[i].dates.start.localDate) {
        eventObj.push(date)
        console.log(eventObj)
        console.log('loop is being reached')
      }

      for (let i = 0; i < 7; i++) {
        // parse moment.js value into a number for conditional statement.
        let currentHour = parseInt(moment().format('HH')) + i + 1;
        if(currentHour < 12) {
          $('#hour' + i).html(currentHour + ':00am')
        } else if (currentHour > 12 && currentHour < 24) {
          $('#hour' + i).html(currentHour - 12 + ':00pm')
        } else if (currentHour === 12) {
          $('#hour' + i).html(currentHour + ':00pm')
        } else if (currentHour === 24) {
          $('#hour' + i).html((currentHour - 12) + ':00am')
          // this should fix our  issue
        } else if (currentHour > 24) {
          $('#hour' + i).html((currentHour - 24) + ':00am')
        }
        $('#icon'+ i).attr('src', 'https://openweathermap.org/img/wn/' + owData.hourly[i].weather[0].icon + '@2x.png')
        $('#temp' + i).html('Temp: ' + owData.hourly[i].temp + '°F')
        $('#hum' + i).html('Humidity: ' + owData.hourly[i].humidity + '%');
      };
      $('#currentTemp').html('Temp: ' + owData.current.temp)
      $('#currentIcon').attr('src', `https://openweathermap.org/img/wn/${owData.current.weather[0].icon}@2x.png`)
      $('#currentHum').html('Humidity: ' + owData.current.humidity + '%');
  });
};

function geoLocate() {
  // check if browswer supports navigator method
  function gotPosition(position) {
    // pulls lat and lon from user prompt when user allows current location access
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let latlon=`${position.coords.latitude},${position.coords.longitude}`;
    // use template literal to concat lat & lon to url query
    tmApiRequest = `https://app.ticketmaster.com/discovery/v2/events.json?latlong=${latlon}&radius=200&unit=miles&size=200&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM`;
    // open weather API call using the city query
    owApiRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=84d61ff029585a95fbd34cf405a10229&units=imperial`;
    owCityRequest = `https://api.openweathermap.org/data/2.5/weather?q=${citySearch}&appid=84d61ff029585a95fbd34cf405a10229`;
    
    getTmData();
    getOwData();
  }

  function positionFailed(err) {
    console.log('Cannot access current location')
  }

  if (navigator.geolocation) {
    // 30sec
    let giveUp = 1000 * 30;
    // 1hr
    let tooOld = 100 * 60 * 60;
    let options = {
      // drains users battery faster by providing more calls and increased location accuracy
      enableHighAccuracy: true,
      // set interval on how long until giving up on receiving a response
      timeout: giveUp,
      // last know location age set to parameter of time
      maximumAge: tooOld
    }
    navigator.geolocation.getCurrentPosition(gotPosition, positionFailed, options);
  } else {
    console.log('user is on an unsupported browser')
  }
}

// searchBtn on click event
searchBtn.on('click', (e) => {
  e.preventDefault();
  citySearch = $('#findtext').val().toLowerCase().trim();
  // gets value from search input and passes to a url query to api url
  displayCity = $(citySearch).val(localStorage.getItem('location'));
  displayCity = `${citySearch[0].toUpperCase()}${citySearch.slice(1)}`;

  let localStor = $('#findtext').val();
  localStorage.setItem('city', localStor);

  getTmData();
  getOwData();
});

// geoBtn click event
geoBtn.on('click', (e) => {
  console.log('geoBtn being reached')
  
  e.preventDefault();
  // this value WOULD work but cannot access value from...
  // inside the geoBtn click event it is available inside of the async function
  //citySearch = owCityData.name;

  // place holder until we figure out how to access the data above
  citySearch = 'Philadelphia';

  displayCity = `${citySearch[0].toUpperCase()}${citySearch.slice(1)}`;
  
  getOwData();
  getTmData();
  geoLocate();
});

console.log('end of code being reached');