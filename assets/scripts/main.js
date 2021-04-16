console.log('js connected');

// ticketmaster API using the city query
let tmApiRequest = 'https://app.ticketmaster.com/discovery/v2/events.json?city=philadelphia&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM';
// open weather API call using the city query
let owApiRequest = 'https://api.openweathermap.org/geo/1.0/direct?q=philadelphia,pa,us&limit=2&appid=84d61ff029585a95fbd34cf405a10229&units=imperial';
// search button for on click event
let searchBtn = $('.custom-button');
let geoBtn = $('#geo-btn');
// formats string from input to match url query 

let eventObj = [];
let hourObj = [];
let iconObj = [];
let tmEvents = [];
let owObj = [];
let tmEmbeddedKey = [];
let owData = [];
let tmData = [];
let citySearch;
let displayCity; 
// displays current day to match TM date structure Example(2021-04-12)
let currentDate = moment().format('YYYY-MM-DD');

// TICKET MASTER API CALL
const getTmData = async () => {
  const tmResponse = await fetch(tmApiRequest);
  tmData = await tmResponse.json();
  tmEmbeddedKey = tmData._embedded;
  // events object
  tmEvents = tmEmbeddedKey.events;
  // gets date for event
  let dates = tmEvents[0].dates.start.localDate;
  console.log(tmEvents)
  console.log(currentDate)
  renderHtml();
  return tmData;
}

  // OPEN WEATHER API CALL
const getOwData = async () => {
  const owResponse = await fetch(owApiRequest);
  owData = await owResponse.json();
  owObj = {
    hour: owData.hourly,
    icon: owData.current.weather
  };
  renderHtml();

  return owData;
};

// renderHtml to browswer
function renderHtml() {
    tmEvents.forEach((date, i) => {
      // updates event title in card
      $(`#title${i}`).html(tmEvents[i].name)
      // updates event image in card
      $(`#img${i}`).attr({
        src: tmEvents[i].images[0].url
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
      // might want to leave this text as 'Events happening in your area today'
      $('#your-city-card').html(`Events happening in ${displayCity} today!`);
      // updates event card p html text to event distance from you
      $(`#distance${i}`).html(`Distance to Venue: ${tmEvents[i].distance} miles`)

      // adds link to twitter account
      if (i <= 3) {
        console.log(tmEvents[i]._embedded.attractions[0].externalLinks.twitter[0].url)
        $(`#tweet${i}`).attr({
          href: tmEvents[i]._embedded.attractions[0].externalLinks.twitter[0].url,
          target: '_blank'
        }).html('Click for latest Tweet!'); 
      }
      // condition not executing although valid
      // checked ticketmaster.com for events happening today &
      // returned 6 results from varying sources
      // look into sources
      if (currentDate == tmEvents[i].dates.start.localDate) {
        eventObj.push(date)
        console.log('loop is being reached')
      }
      
      owObj.hour.forEach((hour, i) => {
        if (i < 6) {
          hourObj.push(hour.temp);
        }
      });

      owObj.icon.forEach((icon, i) => {
        if (i < 6) {
          iconObj.push(icon[i]);
        }
      });
      //console.log(owObj.icon)

      for (let i = 0; i < 7; i++) {
        // parse moment.js value into a number for conditional statement.
        let currentHour = parseInt(moment().format('HH')) + i + 1
        $('#hour' + i).html(currentHour)

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
      };

      // move into for loop once click events are firing correctly
      $('#currentTemp').html('Temp: ' + owData.current.temp + '°F')
      $('#temp0').html('Temp: ' + hourObj[0] + '°F')
      $('#temp1').html('Temp: ' + hourObj[1] + '°F')
      $('#temp2').html('Temp: ' + hourObj[2] + '°F')
      $('#temp3').html('Temp: ' + hourObj[3] + '°F')
      $('#temp4').html('Temp: ' + hourObj[4] + '°F')
      $('#temp5').html('Temp: ' + hourObj[5] + '°F')
      
      $('#currentIcon').attr('src', `https://openweathermap.org/img/wn/${owData.current.weather[0].icon}@2x.png`)
      $('#icon0').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[0].weather[0].icon}@2x.png`)
      $('#icon1').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[1].weather[0].icon}@2x.png`)
      $('#icon2').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[2].weather[0].icon}@2x.png`)
      $('#icon3').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[3].weather[0].icon}@2x.png`)
      $('#icon4').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[4].weather[0].icon}@2x.png`)
      $('#icon5').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[5].weather[0].icon}@2x.png`)
  });
   
 };

function geoLocate() {
  // check if browswer supports navigator method
  function gotPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    let latlon= `${position.coords.latitude},${position.coords.longitude}`;

    // use obj literal to concat lat & lon to url query
    tmApiRequest = `https://app.ticketmaster.com/discovery/v2/events.json?latlong=${latlon}&source=ticketmaster,universe,frontgate,tmr&radius=200&unit=miles&size=200&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM`;
    // open weather API call using the city query
    owApiRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=84d61ff029585a95fbd34cf405a10229&units=imperial`;
    console.log(lat, lon);
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
  // prevent default behavior of searchBtn element <button>
  // to stop page from refreshing and resetting api parameters
  e.preventDefault();
  let citySearch = $('#findtext').val().toLowerCase().trim();
//
  displayCity = $(citySearch).val(localStorage.getItem('location'));
  displayCity = `${citySearch[0].toUpperCase()}${citySearch.slice(1)}`;
  let localStor = $('#findtext').val();
  localStorage.setItem('city', localStor);
  console.log(localStor);
  console.log(Storage.length)
  console.log(localStorage)
  console.log(localStorage.getItem('city'));

  // need to change this to grab input value and make api call
  geoLocate();
  renderHtml();
  console.log('Search btn clicked!');
});

// geoBtn click event
geoBtn.on('click', (e) => {
  e.preventDefault();
  geoLocate();
  renderHtml();
  console.log('geoBtn clicked!')
});