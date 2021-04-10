console.log('js connected');

let googleUrl = 'https://www.google.com/';
var qrCodeUrl = 'https://app.ticketmaster.com/discovery/v2/events.json?countryCode=US&apikey=0PYM69m0qo3ESz77SMGYGdnR0YZKo3oM';
 
/*  var qrCodeUrl = 'http://api.openweathermap.org/geo/1.0/direct?q=philadelphia,pa,us&limit=2&appid=84d61ff029585a95fbd34cf405a10229';
 */

fetch(qrCodeUrl).then((response) => {
    return response.json();    
  })
  .then((data) => { 
      console.log('err')
      console.log(data);
  }) 

  
/*   

const getData = async () => {
  const response = await fetch(qrCodeUrl);
  const data = await response.json();
  const dataObj = data;
  console.log(dataObj);

  }

  getData(); */