// Elements=====================================================
// metadata========================
const AW_apiKey = "zRPS15w0Lf4lAG96GrGXWykhck7sRyyY";
const OW_apiKey = "6dddd25bb5635f994fdc1c00340448ea";
let lat;
let lon;
// ================================
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById('searchCity');
const searchBoxForm = document.getElementById('searchBoxForm');
// summery=========================
const mainTempCount = document.getElementById("mainTempCount");
const curentCondition = document.getElementById("curentCondition");
const todaysHighestTemp = document.getElementById("todaysHighestTemp");
const todaysLowestTemp = document.getElementById("todaysLowestTemp");
const currentAQI = document.getElementById("todayAQI");
//forecast==========================
const todayIcon = document.getElementById("todayIcon");
const todayscondition = document.getElementById("todayscondition");
const todaysLowestTempForecast = document.getElementById(
  "todaysLowestTempForecast"
);
const todaysHighestTempForecast = document.getElementById(
  "todaysHighestTempForecast"
);
const tomorrowIcon = document.getElementById("tomorrowIcon");
const tomorrowCondition = document.getElementById("tomorrowCondition");
const tomorrowLowestTemp = document.getElementById("tomorrowLowestTemp");
const tomorrowHighestTemp = document.getElementById("tomorrowHighestTemp");
const day3icon = document.getElementById("day3icon");
const day3name = document.getElementById("day3name");
const day3condition = document.getElementById('day3condition');
const day3maxTemp = document.getElementById("day3maxTemp");
const day3minTemp = document.getElementById("day3minTemp");
const fullForecastBtn = document.getElementById("fullForecastBtn");

//hourly forecast=====================
const forecastContentNow = document.getElementById("forecastContentNow");
const forecastContentNext = document.getElementById("forecastContentNext");
const forecastContent3 = document.getElementById("forecastContent3");
const forecastContent4 = document.getElementById("forecastContent4");
const forecastContent5 = document.getElementById("forecastContent5");
const forecastContent6 = document.getElementById("forecastContent6");
const forecastContent7 = document.getElementById("forecastContent7");
const forecastContent8 = document.getElementById("forecastContent8");
// other updates=======================
const currentWind = document.getElementById("currentWind");
const sunriseSunset = document.getElementById("sunriseSunset");
const currentAQI2 = document.getElementById("currentAQI2");

const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const UVIndex = document.getElementById("UVIndex");
const pressure = document.getElementById("pressure");
const precipation = document.getElementById("precipation");

// functions====================================================
dateToDayName = timestamp => {
  return new Date(timestamp * 1000).toLocaleString('en-US', { weekday: 'short' })
}
function formatTime12Hour(timestamp) {
  return new Date(timestamp * 1000).toLocaleString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
  });
}












// fetching daily forecast from accuweather
async function getForecastAW(cityName) {
  let locationKey;
  async function getLocationKey() {
    const response = await fetch(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=zRPS15w0Lf4lAG96GrGXWykhck7sRyyY&q=${cityName}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    locationKey = data[0].Key;
    console.log(locationKey);
  }
  await getLocationKey();
  const response = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${AW_apiKey}&details=true&metric=true`
  );
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  dailyForecastDataFromAW = data;
}
