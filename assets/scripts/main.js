console.log('js connected');

// ticketmaster API using the city query

let tmApiRequest = 'https://app.ticketmaster.com/discovery/v2/events.json?city=philadelphia&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM';
// open weather API call using the city query
let owApiRequest = 'https://api.openweathermap.org/geo/1.0/direct?q=philadelphia,pa,us&limit=2&appid=84d61ff029585a95fbd34cf405a10229&units=imperial';

let hourObj = []
let iconObj = []

  // TICKET MASTER API CALL
  const getTmData = async () => {
    const tmResponse = await fetch(tmApiRequest);
    const tmData = await tmResponse.json();
    let tmEmbeddedKey = tmData._embedded;
    // events object
    let tmEvents = tmEmbeddedKey.events;
    console.log(tmEvents)
    return tmData;
}

  // OPEN WEATHER API CALL
  const getOwData = async () => {
    const owResponse = await fetch(owApiRequest);
    const owData = await owResponse.json();
    
    let owObj = {
      hour: owData.hourly,
      icon: owData.current.weather
    };

    owObj.hour.forEach((hour, i) => {
      if (i < 5) {
        hourObj.push(hour.temp);
      }
    });

    owObj.icon.forEach((icon, i) => {
      if (i < 5) {
        iconObj.push(icon[i]);
      }
    });
    console.log(owObj.icon)

    for (let i = 0; i < 5; i++) {
      let currentHour = parseInt(moment().format('HH')) + i + 1
      $('#hour' + i).html(currentHour)

      if(currentHour < 12) {
        $('#hour' + i).html(currentHour + 'am')
      } else if (currentHour > 12) {
        $('#hour' + i).html(currentHour - 12 + 'pm')
      } else if (currentHour === 12) {
        $('#hour' + i).html(currentHour + 'pm')
      } else if (currentHour === 24) {
        $('#hour' + i).html(currentHour + 'am')
      } 
    };

    $('#currentTemp').html('Temp: ' + owData.current.temp + '°F')
    $('#temp0').html('Temp: ' + hourObj[0] + '°F')
    $('#temp1').html('Temp: ' + hourObj[1] + '°F')
    $('#temp2').html('Temp: ' + hourObj[2] + '°F')
    $('#temp3').html('Temp: ' + hourObj[3] + '°F')
    $('#temp4').html('Temp: ' + hourObj[4] + '°F')
    
    $('#currentIcon').attr('src', `https://openweathermap.org/img/wn/${owData.current.weather[0].icon}@2x.png`)
    $('#icon0').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[0].weather[0].icon}@2x.png`)
    $('#icon1').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[1].weather[0].icon}@2x.png`)
    $('#icon2').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[2].weather[0].icon}@2x.png`)
    $('#icon3').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[3].weather[0].icon}@2x.png`)
    $('#icon4').attr('src', `https://openweathermap.org/img/wn/${owData.hourly[4].weather[0].icon}@2x.png`)
    

    console.log(hourObj)
    console.log(owData);
    return owData;
}

// call functions to get data from url querys


function geoLocate() {
  // check if browswer supports navigator method
  function gotPosition(position) {
    let lat = position.coords.latitude;
    let lon = position.coords.longitude;
    // use obj literal to concat lat & lon to url query
    tmApiRequest = `https://app.ticketmaster.com/discovery/v2/events.json?latlong=${lat}${lon}&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM`;
    // open weather API call using the city query
    owApiRequest = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=84d61ff029585a95fbd34cf405a10229&units=imperial`;

    console.log(lat, lon);
    getTmData();
    getOwData();
  }

  function positionFailed(err) {

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

geoLocate();