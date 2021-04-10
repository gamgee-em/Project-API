console.log('js connected');

// ticketmaster API using the city query
let tmApiRequest = 'https://app.ticketmaster.com/discovery/v2/events.json?city=philadelphia&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM';
// open weather API call using the city query
let owApiRequest = 'http://api.openweathermap.org/geo/1.0/direct?q=philadelphia,pa,us&limit=2&appid=84d61ff029585a95fbd34cf405a10229';
 
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
    let owKey = owData[0];
    // name object
    let cityName = owKey.name;
    console.log(cityName);
  
    return owData;
}

// call functions to get data from url querys
getTmData();
getOwData();
