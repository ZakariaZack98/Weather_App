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
iconChange = (condition, element) => { //2nd param for element?
  switch(condition) {
    case "Rain" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-sharp-duotone fa-light fa-cloud-rain me-2"></i>')
    }
    break;
    case "Snow" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-regular fa-snowflake me-2"></i>');
    }
    break;
    case "Clear" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-duotone fa-solid fa-sun me-2"></i>');
    }
    break;
    case "Clouds" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-sharp-duotone fa-solid fa-clouds me-2"></i>');
    }
    break;
    case "Drizzle" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-duotone fa-light fa-cloud-drizzle me-2"></i>');
    }
    break;
    case "Thunderstorm" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-duotone fa-light fa-cloud-bolt me-2"></i>');
    }
    break;
    case "Smoke" : {
      element.firstElementChild.remove();
      element.insertAdjacentHTML('afterbegin', '<i class="fa-sharp-duotone fa-light fa-smoke me-2"></i>');
    }
    break;
  }
}

updateSummery = () => {
  mainTempCount.innerText = Math.round(weatherData.main.temp);
  curentCondition.innerText = weatherData.weather[0].main;
  todaysHighestTemp.innerText = Math.round(weatherData.main.temp_max);
  todaysLowestTemp.innerText = Math.round(weatherData.main.temp_min);
  currentAQI.innerText = AQIData.list[0].main.aqi;
}
updateDaily = () => {
  //today
  iconChange(weatherData.weather[0].main, todayIcon);
  todayscondition.innerText = weatherData.weather[0].main;
  todaysLowestTempForecast.innerText = Math.round(weatherData.main.temp_min) + '°';
  todaysHighestTempForecast.innerText = Math.round(weatherData.main.temp_max) + '°';
  //tomorrow
  iconChange(dailyForecastData.list[5].weather[0].main, tomorrowIcon);
  tomorrowCondition.innerText = dailyForecastData.list[5].weather[0].main;
  tomorrowLowestTemp.innerText = Math.round(dailyForecastData.list[5].main.temp_min) + '°';
  tomorrowHighestTemp.innerText = Math.round(dailyForecastData.list[5].main.temp_max) + '°';
  //3rd day
  iconChange(dailyForecastData.list[2].weather[0].main, day3icon);
  day3name.innerText = dateToDayName(dailyForecastData.list[12].dt);
  day3condition.innerText = dailyForecastData.list[2].weather[0].main;
  day3minTemp.innerText = Math.round(dailyForecastData.list[12].main.temp_min) + '°';
  day3maxTemp.innerText = Math.round(dailyForecastData.list[12].main.temp_max) + '°';
}
updateOthers = () => {
  humidity.innerText = weatherData.main.humidity + '%';
  feelsLike.innerText = Math.round(weatherData.main.feels_like) + '°';
  //uvIndex...
  pressure.innerText = `${weatherData.main.pressure}mbr`;
  // precipation.innerText = weatherData...
}








// search location===============================================
let weatherData = null;
let AQIData = null;
let dailyForecastData = null;
// //accuweather data fetch==============================
// async function getWeather(cityName) {
//   let locationKey;
//   async function getLocationKey() {
//     const response = await fetch(
//       `https://dataservice.accuweather.com/locations/v1/cities/search?apikey=${AW_apiKey}&q=${cityName}`
//     );
//     if (!response.ok) throw new Error(`Error: ${response.status}`);
//     const data = await response.json();
//     locationKey = data[0]?.Key;
//     if (!locationKey) throw new Error('Location key not found');
//   }

//   async function getWeatherData() {
//     const response = await fetch(
//       `https://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${AW_apiKey}`
//     );
//     if (!response.ok) throw new Error(`Error: ${response.status}`);
//     const data = await response.json();
//     weatherData = data[0];
//   }

//   await getLocationKey();
//   await getWeatherData();
// }

//openweather data fetch=======================================
async function getWeather(cityName) {
  async function getCurrentWeatherData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OW_apiKey}&units=metric`);
    if(!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    weatherData = data;
  }
  await getCurrentWeatherData();
  lat = weatherData.coord.lat;
  lon = weatherData.coord.lon;
  async function getAirQuality() {
    console.log(lat, lon);
    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OW_apiKey}`);
    if(!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    AQIData = data;
  }
  await getAirQuality();
  async function getDailyForecast() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OW_apiKey}&units=metric`);
    if(!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    dailyForecastData = data;
  }
  await getDailyForecast();
}

searchBoxForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  try {
    let keyWord = cityName.value.trim();
    if (!keyWord) {
      alert('Please enter a valid city name');
      return;
    }
    await getWeather(keyWord);
    updateSummery();
    updateDaily();
    updateOthers();
  } catch (error) {
    console.error('Error fetching weather:', error);
  }
});
