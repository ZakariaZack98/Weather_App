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
const forecastRows = Array.from(document.getElementsByClassName('forecastRow'));
const fullForecastBtn = document.getElementById("fullForecastBtn");
//hourly forecast=====================
const forecastItems = Array.from(document.getElementsByClassName('forecastContent'));
const hourlyIcons = document.getElementsByClassName('hourlyIcon');
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

updateHourly = () => {
  const next24hours = dailyForecastData.list.slice(0, 8);
  next24hours.forEach((value, index) => {
      if(value.weather[0].main === 'Rain') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = `<i class="fa-duotone fa-light fa-cloud-rain"></i>`;
      }
      else if(value.weather[0].main === 'Snow') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-regular fa-snowflake"></i>';
      }
      else if(value.weather[0].main === 'Clear' && Math.floor(Date.now() / 1000) > forecastDataAW.DailyForecasts[0].Sun.EpochSet) {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-moon-stars"></i>';
      }
      else if(value.weather[0].main === 'Clear' || value.weather.main === 'Sunny') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp fa-solid fa-sun"></i>';
      }
      else if(value.weather[0].main === 'Clouds') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-clouds"></i>';
      }
      else if(value.weather[0].main === 'Drizzle') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-drizzle"></i>';
      }
      else if(value.weather[0].main === 'Thunderstorm') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-bolt"></i>';
      }
      else if(value.weather[0].main === 'Smoke' || value.weather.main === 'Fog') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-light fa-smoke"></i>';
      }
      else if(value.weather[0].main === 'Haze' || value.weather.main === 'Mist') {
        forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-haze" ></i>';
    }

    forecastItems[index].firstElementChild.lastElementChild.innerText = Math.round(value.main.temp);
    forecastItems[index].firstElementChild.nextElementSibling.innerHTML = Math.round(value.wind.speed) + 'km/h';
    forecastItems[index].lastElementChild.innerText = formatTime12Hour(value.dt);
  });
}

updateSummery = () => {
  mainTempCount.innerText = Math.round(weatherData.main.temp);
  curentCondition.innerText = weatherData.weather[0].description;
  todaysHighestTemp.innerText = Math.round(forecastDataAW.DailyForecasts[0].Temperature.Maximum.Value);
  todaysLowestTemp.innerText = Math.round(forecastDataAW.DailyForecasts[0].Temperature.Minimum.Value);
  currentAQI.innerText = AQIData.list[0].main.aqi;
}
updateDaily = () => {
  let condition;
  const next3days = forecastDataAW.DailyForecasts.slice(0, 3);
  next3days.forEach((value, index) => {
    condition = value.Day.IconPhrase;
    if(condition === 'Rain') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = `<i class="fa-duotone fa-light fa-cloud-rain me-2"></i>`;
    }
    else if(condition === 'Snow') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-regular fa-snowflake me-2"></i>';
    }
    else if(condition === 'Clear' || condition === 'Sunny') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp fa-solid fa-sun me-2"></i>';
    }
    else if(condition === 'Cloudy') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-clouds me-2"></i>';
    }
    else if(condition === 'Drizzle') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-drizzle me-2"></i>';
    }
    else if(condition === 'Thunderstorm') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-bolt me-2"></i>';
    }
    else if(condition === 'Smoke' || condition === 'Fog') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-light fa-smoke me-2"></i>';
    }
    else if(condition === 'Haze' || condition === 'Mist') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-haze me-2" ></i>';
    }
    forecastRows[index].firstElementChild.lastElementChild.innerHTML = value.Day.IconPhrase;
    forecastRows[index].lastElementChild.firstElementChild.innerText = Math.round(value.Temperature.Maximum.Value) + '°';
    forecastRows[index].lastElementChild.lastElementChild.innerText = Math.round(value.Temperature.Minimum.Value) + '°';
  })
}
updateOthers = () => {

  if(Math.floor(Date.now() / 1000) > forecastDataAW.DailyForecasts[0].Sun.EpochRise && Math.floor(Date.now() / 1000) < forecastDataAW.DailyForecasts[0].Sun.EpochSet) {
    sunriseSunset.firstElementChild.innerText = "Sunset";
    sunriseSunset.lastElementChild.innerText = formatTime12Hour(forecastDataAW.DailyForecasts[0].Sun.EpochSet);
  }
  else if(Math.floor(Date.now() / 1000) > forecastDataAW.DailyForecasts[0].Sun.EpochSet) {
    sunriseSunset.firstElementChild.innerText = "Sunrise";
    sunriseSunset.lastElementChild.innerText = formatTime12Hour(forecastDataAW.DailyForecasts[1].Sun.EpochRise);
  }

  currentWind.firstElementChild.innerText = forecastDataAW.DailyForecasts[0].Day.Wind.Direction.English;
  currentWind.lastElementChild.innerText = weatherData.wind.speed + 'km/h';

  currentAQI2.lastElementChild.innerText = AQIData.list[0].main.aqi;

  humidity.innerText = weatherData.main.humidity + '%';
  feelsLike.innerText = Math.round(weatherData.main.feels_like) + '°';
  UVIndex.innerText = forecastDataAW.DailyForecasts[0].AirAndPollen[5].Category;
  pressure.innerText = `${weatherData.main.pressure}mbr`;
  precipation.innerText = `${forecastDataAW.DailyForecasts[0].Day.RainProbability}%`;
}

// search location===============================================
let weatherData = null;
let AQIData = null;
let dailyForecastData = null;
let forecastDataAW = null;
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
  forecastDataAW = data;
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
    await getForecastAW(keyWord);
    updateSummery();
    updateDaily();
    updateHourly();
    updateOthers();
  } catch (error) {
    console.warn('Error fetching weather:', error);
  }
});
