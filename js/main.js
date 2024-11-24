// Elements=====================================================
// metadata========================
let lat;
let lon;
let weatherData = null;
let AQIData = null;
let dailyForecastData = null;
let forecastDataAW = null;
const AW_apiKey = "zRPS15w0Lf4lAG96GrGXWykhck7sRyyY";
const OW_apiKey = "6dddd25bb5635f994fdc1c00340448ea";
const background = document.getElementById('background');
const contentHolder = document.getElementById('contentHolder');
const fiveDaysPage = document.getElementById('fiveDaysPage');
const forecastCardWrapper = Array.from(document.getElementsByClassName('forecastCard'));
// head ================================
const searchBtn = document.getElementById("searchBtn");
const cityName = document.getElementById('searchCity');
const searchBoxForm = document.getElementById('searchBoxForm');
// summery=========================
const weatherSummery = document.getElementById('weatherSummery');
const mainTempCount = document.getElementById("mainTempCount");
const curentCondition = document.getElementById("curentCondition");
const todaysHighestTemp = document.getElementById("todaysHighestTemp");
const todaysLowestTemp = document.getElementById("todaysLowestTemp");
const currentAQI = document.getElementById("todayAQI");
//forecast==========================
const forecastRows = Array.from(document.getElementsByClassName('forecastRow'));
const fullForecastBtn = document.getElementById("fullForecastBtn");
const backBtn = document.getElementById('backBtn');
//hourly forecast=====================
const forecastItems = Array.from(document.getElementsByClassName('forecastContent'));
// other forecasts====================
const currentWind = document.getElementById("currentWind");
const sunriseSunset = document.getElementById("sunriseSunset");
const currentAQI2 = document.getElementById("currentAQI2");
const humidity = document.getElementById("humidity");
const feelsLike = document.getElementById("feelsLike");
const UVIndex = document.getElementById("UVIndex");
const pressure = document.getElementById("pressure");
const precipation = document.getElementById("precipation");

const bgCollections = {
  rain: 'https://static.vecteezy.com/system/resources/thumbnails/033/645/252/small_2x/drizzle-rainy-day-in-autumn-background-and-wallpaper-generative-ai-photo.jpg',
  sunny: 'https://wallpapers.com/images/featured/sunny-i2iuwt6dckyhzjmi.jpg',
  clouds: 'https://wallpaperaccess.com/full/5172677.jpg',
  scatteredClouds: 'https://images.squarespace-cdn.com/content/v1/5d4c63022fdc0f0001a31f58/1565863502860-U636YZGVWKQJ47331LG6/cloud+dark+blue.jpg?format=2500w',
  overCast: 'https://www.rochesterfirst.com/wp-content/uploads/sites/66/2021/04/sky-1107579_1920.jpg',
  snow: 'https://rukminim2.flixcart.com/image/850/1000/kvmpq4w0/wall-decoration/h/b/o/street-light-snow-snowing-winter-wallpaper-poster-1-v061121-623-original-imag8hhnhetyzmyd.jpeg?q=20&crop=false',
  haze: 'https://c4.wallpaperflare.com/wallpaper/625/628/1014/forest-sun-jungle-trees-wallpaper-preview.jpg',
  smoke: 'https://img.freepik.com/premium-photo/street-small-french-town-fog_209484-9489.jpg',
  autumnHaze: 'https://w0.peakpx.com/wallpaper/391/402/HD-wallpaper-people-walking-on-road-between-trees-during-foggy-weather.jpg',
  thunderstorm: 'https://backiee.com/static/wallpapers/560x315/182345.jpg',
  drizze: 'https://static.vecteezy.com/system/resources/thumbnails/033/645/252/small_2x/drizzle-rainy-day-in-autumn-background-and-wallpaper-generative-ai-photo.jpg'
};

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

async function fetchData(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  return data;
}

changeBackground = () => {
  let condition = weatherData.weather[0].main;
  let conditionDesc = weatherData.weather[0].description;
  background.style.opacity = 0;
  setTimeout(() => {
    if( condition === 'Rain' || condition === 'Drizzle' ) background.style.backgroundImage = `url(${bgCollections.rain})`;
    else if(condition === 'Clear') background.style.backgroundImage = `url(${bgCollections.sunny})`;
    else if(condition === 'Snow') background.style.backgroundImage = `url(${bgCollections.snow})`;
    else if(condition === 'Haze' || condition === 'Mist' || condition === 'Fog') background.style.backgroundImage = `url(${bgCollections.autumnHaze})`;
    else if(conditionDesc === 'smoke') background.style.backgroundImage = `url(${bgCollections.smoke})`;
    else if(conditionDesc === 'scattered clouds' || conditionDesc === 'intermittent clouds' || conditionDesc === 'few clouds' || conditionDesc === 'broken clouds') background.style.backgroundImage = `url(${bgCollections.scatteredClouds})`;
    else if(conditionDesc === 'overcast clouds') background.style.backgroundImage = `url(${bgCollections.overCast})`;
    else if(condition === 'Clouds') background.style.backgroundImage = `url(${bgCollections.clouds})`;
    else if(condition === 'Thunderstorm') background.style.backgroundImage = `url(${bgCollections.thunderstorm})`;
    background.style.opacity = 1;
  }, 500);
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
    // switching icons based on weather conditions
    if (condition === 'Rain' || condition === 'Showers') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = `<i class="fa-duotone fa-light fa-cloud-rain me-2"></i>`;
    }
    else if (condition === 'Snow' || condition === 'Rain and snow' || condition === 'Freezing rain' || condition === 'Sleet' || condition === 'Ice' || condition === 'Flurries') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-regular fa-snowflake me-2"></i>';
    }
    else if (condition === 'Clear' || condition === 'Sunny') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp fa-solid fa-sun me-2"></i>';
    }
    else if (condition === 'Partly cloudy' || condition === 'Partly sunny' || condition === 'Mostly cloudy' || condition === 'Intermittent clouds') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-solid fa-clouds-sun me-2"></i>';
    }
    else if (condition === 'Mostly sunny' || condition === 'Mostly clear') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-cloud me-2"></i>';
    }
    else if (condition === 'Cloudy') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-clouds me-2"></i>';
    }
    else if (condition === 'Drizzle' || condition === 'Mostly cloudy w/ showers') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-drizzle me-2"></i>';
    }
    else if (condition === 'Thunderstorm' || condition === 'Mostly cloudy w/ t-storms') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-bolt me-2"></i>';
    }
    else if (condition === 'Smoke' || condition === 'Fog') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-light fa-smoke me-2"></i>';
    }
    else if (condition === 'Hazy' || condition === 'Mist' || condition === 'Hazy sunshine') {
      forecastRows[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-haze me-2" ></i>';
    }
    // updating the data of daily forecast
    forecastRows[index].firstElementChild.lastElementChild.innerHTML = value.Day.IconPhrase;
    forecastRows[index].lastElementChild.firstElementChild.innerText = Math.round(value.Temperature.Maximum.Value) + '°';
    forecastRows[index].lastElementChild.lastElementChild.innerText = Math.round(value.Temperature.Minimum.Value) + '°';
  })
}

//update 5 day forecast page
update5days = () => {
  const next5days = forecastDataAW.DailyForecasts;
  let condition;
  next5days.forEach((value, index) => {
    condition = value.Day.IconPhrase;
    //changing icond
    if (condition === 'Rain' || condition === 'Showers') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = `<i class="fa-duotone fa-light fa-cloud-rain me-2"></i>`;
    }
    else if (condition === 'Snow' || condition === 'Rain and snow' || condition === 'Freezing rain' || condition === 'Sleet' || condition === 'Ice' || condition === 'Flurries') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-regular fa-snowflake me-2"></i>';
    }
    else if (condition === 'Clear' || condition === 'Sunny') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp fa-solid fa-sun me-2"></i>';
    }
    else if (condition === 'Partly cloudy' || condition === 'Partly sunny' || condition === 'Mostly cloudy' || condition === 'Intermittent clouds') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-solid fa-clouds-sun me-2"></i>';
    }
    else if (condition === 'Mostly sunny' || condition === 'Mostly clear') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-cloud me-2"></i>';
    }
    else if (condition === 'Cloudy') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-clouds me-2"></i>';
    }
    else if (condition === 'Drizzle' || condition === 'Mostly cloudy w/ showers') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-drizzle me-2"></i>';
    }
    else if (condition === 'Thunderstorm' || condition === 'Mostly cloudy w/ t-storms') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-bolt me-2"></i>';
    }
    else if (condition === 'Smoke' || condition === 'Fog') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-light fa-smoke me-2"></i>';
    }
    else if (condition === 'Hazy' || condition === 'Mist' || condition === 'Hazy sunshine') {
      forecastCardWrapper[index].firstElementChild.firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-haze me-2" ></i>';
    }
    //updating other data
  forecastCardWrapper[index].firstElementChild.firstElementChild.lastElementChild.previousElementSibling.innerHTML = dateToDayName(value.EpochDate); //day name
  forecastCardWrapper[index].firstElementChild.firstElementChild.lastElementChild.innerHTML = value.Day.IconPhrase; //weather condition
  forecastCardWrapper[index].firstElementChild.lastElementChild.firstElementChild.innerText = Math.round(value.Temperature.Maximum.Value) + '°'; //maxTemp
  forecastCardWrapper[index].firstElementChild.lastElementChild.lastElementChild.innerText = Math.round(value.Temperature.Minimum.Value) + '°'; //minTemp
  forecastCardWrapper[index].lastElementChild.firstElementChild.firstElementChild.nextElementSibling.innerText = value.Day.Wind.Speed.Value; //wind speed
  forecastCardWrapper[index].lastElementChild.firstElementChild.lastElementChild.innerText = value.Day.Wind.Direction.English; //wind direction
  forecastCardWrapper[index].lastElementChild.lastElementChild.lastElementChild.innerText = value.AirAndPollen[5].Category; //UV
  forecastCardWrapper[index].lastElementChild.firstElementChild.nextElementSibling.lastElementChild.innerText = value.AirAndPollen[0].Category; //AQI
  })
}

updateHourly = () => {
  let condition;
  const next24hours = dailyForecastData.list.slice(0, 8);
  //switching icons based on weather conditions
  next24hours.forEach((value, index) => {
    condition = value.weather[0].main;
    if (condition === 'Rain') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = `<i class="fa-duotone fa-light fa-cloud-rain"></i>`;
    }
    else if (condition === 'Snow') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-regular fa-snowflake"></i>';
    }
    else if (condition === 'Clear' && Math.floor(Date.now() / 1000) > forecastDataAW.DailyForecasts[0].Sun.EpochSet) {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-moon-stars"></i>';
    }
    else if (condition === 'Clear' || condition === 'Sunny') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp fa-solid fa-sun"></i>';
    }
    else if (condition === 'Clouds') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-solid fa-clouds"></i>';
    }
    else if (condition === 'Drizzle') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-drizzle"></i>';
    }
    else if (condition === 'Thunderstorm') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-light fa-cloud-bolt"></i>';
    }
    else if (condition === 'Smoke' || condition === 'Fog') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-sharp-duotone fa-light fa-smoke"></i>';
    }
    else if (condition === 'Haze' || condition === 'Mist' || condition === 'Hazy sunshine') {
      forecastItems[index].firstElementChild.firstElementChild.innerHTML = '<i class="fa-duotone fa-solid fa-sun-haze" ></i>';
    }
    // updating the data in each block
    forecastItems[index].firstElementChild.lastElementChild.innerText = Math.round(value.main.temp) + '°';
    forecastItems[index].firstElementChild.nextElementSibling.innerHTML = Math.round(value.wind.speed) + 'km/h';
    forecastItems[index].lastElementChild.innerText = formatTime12Hour(value.dt);
  });
}

updateOthers = () => {
  //updating the sunset/sunrise
  if (Math.floor(Date.now() / 1000) > forecastDataAW.DailyForecasts[0].Sun.EpochRise && Math.floor(Date.now() / 1000) < forecastDataAW.DailyForecasts[0].Sun.EpochSet) {
    sunriseSunset.firstElementChild.innerText = "Sunset";
    sunriseSunset.lastElementChild.innerText = formatTime12Hour(forecastDataAW.DailyForecasts[0].Sun.EpochSet);
  }
  else if (Math.floor(Date.now() / 1000) > forecastDataAW.DailyForecasts[0].Sun.EpochSet) {
    sunriseSunset.firstElementChild.innerText = "Sunrise";
    sunriseSunset.lastElementChild.innerText = formatTime12Hour(forecastDataAW.DailyForecasts[1].Sun.EpochRise);
  }
  //updating wind direction and speed
  updateWindDirection = () => {
    let windDirArr = forecastDataAW.DailyForecasts[0].Day.Wind.Direction.English.split('');
    let windDirection = '';
    windDirArr.forEach(value => {
      if (value === 'N') windDirection += ' North';
      else if (value === 'E') windDirection += ' East';
      else if (value === 'S') windDirection += ' South';
      else windDirection += ' West';
    })
    currentWind.firstElementChild.innerText = windDirection.trim();
  }
  updateWindDirection();
  currentWind.lastElementChild.innerText = weatherData.wind.speed + 'km/h';
  //updating Air Quality Index
  currentAQI2.lastElementChild.innerText = AQIData.list[0].main.aqi;
  //updating other datas
  humidity.innerText = weatherData.main.humidity + '%';
  feelsLike.innerText = Math.round(weatherData.main.feels_like) + '°';
  UVIndex.innerText = forecastDataAW.DailyForecasts[0].AirAndPollen[5].Category;
  pressure.innerText = `${weatherData.main.pressure}mbr`;
  precipation.innerText = `${forecastDataAW.DailyForecasts[0].Day.RainProbability}%`;
}

//Fetching data from OpenWeather====================================
async function getWeather(cityName) {
  async function getCurrentWeatherData() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${OW_apiKey}&units=metric`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    weatherData = data;
  }
  await getCurrentWeatherData();
  lat = weatherData.coord.lat;
  lon = weatherData.coord.lon;
  async function getAirQuality() {
    const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${OW_apiKey}`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    AQIData = data;
  }
  async function getDailyForecast() {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${OW_apiKey}&units=metric`);
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    dailyForecastData = data;
  }
  await Promise.allSettled([getAirQuality(), getDailyForecast()]);
}

// fetching daily forecast from AccuWeather========================
async function getForecastAW(cityName) {
  let locationKey;
  async function getLocationKey() {
    const response = await fetch(
      `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${AW_apiKey}&q=${cityName}`
    );
    if (!response.ok) throw new Error(`Error: ${response.status}`);
    const data = await response.json();
    locationKey = data[0].Key;
  }
  await getLocationKey();
  const response = await fetch(
    `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${AW_apiKey}&details=true&metric=true`
  );
  if (!response.ok) throw new Error(`Error: ${response.status}`);
  const data = await response.json();
  forecastDataAW = data;
}

// data update call======================================
searchBoxForm.addEventListener('submit', async function (event) {
  event.preventDefault();
  try {
    let keyWord = cityName.value.trim();
    if (!keyWord) {
      alert('Please enter a valid city name');
      return;
    }
    //applying fade out animation
    setTimeout(() => {
      changeBackground();
      Array.from(contentHolder.children).forEach(elem => elem.style.opacity = 0);
    }, 500);
    await Promise.allSettled([getWeather(keyWord), getForecastAW(keyWord)]);
    //applying fade in animation
    Array.from(contentHolder.children).forEach(elem => elem.style.opacity = 1);
    updateSummery();
    updateDaily();
    updateHourly();
    updateOthers();
    update5days();
  } catch (error) {
    console.warn('Error fetching weather:', error);
  }
});

// switch to five days forecast
fullForecastBtn.addEventListener('click', () => {
  fiveDaysPage.style.transform = 'translateX(0%)';
  Array.from(contentHolder.children).forEach(elem => elem.style.opacity = 0);
});
backBtn.addEventListener('click', () => {
  fiveDaysPage.style.transform = 'translateX(100%)';
  Array.from(contentHolder.children).forEach(elem => elem.style.opacity = 1);
})
