const cityInput = document.querySelector(".city-input");
const searchBtn = document.querySelector(".search-btn");
const weatherInfoSection = document.querySelector(".weather-info");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const countryTxt = document.querySelector(".country-txt");
const tempTxt = document.querySelector(".temp-txt");
const humidityValue = document.querySelector(".humidity-value");
const windspeedValue = document.querySelector(".windspeed-value");
const conditionTxt = document.querySelector(".condition-txt");
const weatherSummaryImg = document.querySelector(".weather-summary-image");
const currentDateTxt = document.querySelector(".current-date-txt");
const forecastItemsContainer = document.querySelector(
  ".forecast-items-container"
);
const apiKey = "a12c58983e744618db4f42eaedc4b989";
searchBtn.addEventListener("click", function () {
  if (cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
cityInput.addEventListener("keydown", function (event) {
  if (event.key == "Enter" && cityInput.value.trim() != "") {
    updateWeatherInfo(cityInput.value);
    cityInput.value = "";
    cityInput.blur();
  }
});
async function getFetchData(endPoint, city) {
  const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
  const response = await fetch(apiUrl);
  return response.json();
}
function getWeatherIcon(id) {
  if (id === 800) {
    return "clear";
  } else {
    const group = Math.round(id / 100);
    switch (group) {
      case 2:
        return "thunderstorm";
      case 3:
        return "drizzle";
      case 5:
        return "rain";
      case 6:
        return "snow";
      case 7:
        return "atmosphere";
      case 8:
        return "clouds";
      default:
        return "unknown";
    }
  }
}
function getCurrentDate() {
  const currentDate = new Date();
  const options = {
    weekday: "short",
    day: "2-digit",
    month: "short",
  };
  return currentDate.toLocaleDateString("en-GB", options);
}
async function updateWeatherInfo(city) {
  const weatherData = await getFetchData("weather", city);
  if (weatherData.cod != "200") {
    showDisplaySection(notFoundSection);
    return;
  } else {
    showDisplaySection(weatherInfoSection);
    const {
      name,
      main: { humidity, temp },
      weather: [{ id, main }],
      wind: { speed },
    } = weatherData;
    countryTxt.textContent = name;
    tempTxt.textContent = Math.round(temp) + " °C";
    conditionTxt.textContent = main;
    humidityValue.textContent = humidity + " %";
    windspeedValue.textContent = speed + " M/s";
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}.svg`;
    currentDateTxt.textContent = getCurrentDate();
  }
  await updateForecastInfo(city);
}
async function updateForecastInfo(city) {
  const forecastsData = await getFetchData("forecast", city);
  const timeTaken = "12:00:00";
  const todayDate = new Date().toISOString().split("T")[0];
  forecastItemsContainer.innerHTML = ''
  forecastsData.list.forEach((forecastWeather) => {
    if (
      forecastWeather.dt_txt.includes(timeTaken) &&
      !forecastWeather.dt_txt.includes(todayDate)
    )
      updateForecastItems(forecastWeather);
  });
}
function updateForecastItems(weatherData) {
  const {
    dt_txt: date,
    weather: [{ id }],
    main: { temp },
  } = weatherData;

  const dateTaken = new Date(date.replace(" ", "T"));
  const day = dateTaken.getDate().toString().padStart(2, "0");
  const month = dateTaken.toLocaleString("en-US", { month: "short" });
  const dateResult = `${day} ${month}`;

  const forecastItem = `
    <div class="forecast-item">
      <h5 class="forecast-item-date regular-txt">${dateResult}</h5>
      <img src="./assets/weather/${getWeatherIcon(
        id
      )}.svg" class="forecast-item-img" />
      <h5 class="forecast-item-temp">${Math.round(temp)} °C</h5>
    </div>
  `;
  forecastItemsContainer.insertAdjacentHTML("beforeend", forecastItem);
}
function showDisplaySection(section) {
  [weatherInfoSection, searchCitySection, notFoundSection].forEach(
    (section) => (section.style.display = "none")
  );
  section.style.display = "flex";
}
