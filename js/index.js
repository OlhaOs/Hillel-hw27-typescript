var refs = {
  allInfo: document.querySelector('#weatherInfo'),
  inputEl: document.querySelector('.inputField'),
  btnEl: document.querySelector('.checkWeatherBtn'),
  forecastInfo: document.querySelector('#weatherForecast'),
};
var API_KEY = '7678b79646da4dcca50153348231305';
var DAY_FORECAST = 5;
var query = '';
refs.btnEl.addEventListener('click', handleSearchButton);
refs.allInfo.addEventListener('click', handleMoreInfoButton);
function handleSearchButton() {
  query = refs.inputEl.value;
  fetchApi(query);
  clearInput();
}
function fetchApi(query) {
  fetch(
    'https://api.weatherapi.com/v1/current.json?key='
      .concat(API_KEY, '&q=')
      .concat(query),
    {
      mode: 'cors',
    }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      renderData(data.current);
    })
    .catch(function () {
      return renderErrorMessage(query);
    });
}
function renderData(currentInfo) {
  var _a = currentInfo.condition,
    text = _a.text,
    icon = _a.icon;
  var feelslike_c = currentInfo.feelslike_c,
    temp_c = currentInfo.temp_c,
    humidity = currentInfo.humidity,
    wind_kph = currentInfo.wind_kph,
    last_updated = currentInfo.last_updated;
  return (refs.allInfo.innerHTML =
    "\n    <div class='title'> \n       <h2>The weather in <span> "
      .concat(query, ' </span> is ')
      .concat(text.toLowerCase(), ' ')
      .concat(
        last_updated,
        '</h2>\n    \n    </div>\n      <ul class=\'list\'>\n        <li class="item">Temperature is <span>'
      )
      .concat(
        temp_c,
        '&deg;C</span></li>\n        <li class="item">Real feel on <span>'
      )
      .concat(
        feelslike_c,
        '&deg;C</span></li>\n        <li class="item">Humidity is <span>'
      )
      .concat(
        humidity,
        '%</span></li>\n        <li class="item">Wind is <span>'
      )
      .concat(
        wind_kph,
        ' kph </span></li>\n      </ul>\n      <div class="checkForecastBtn"><img src="http:'
      )
      .concat(icon, '" class="linkToForecast" alt="')
      .concat(
        text,
        '"}/>\n      <p class="captionForImg">Click for forecast for '
      )
      .concat(DAY_FORECAST, ' days in ')
      .concat(query, '</p></div>\n    '));
}
function renderErrorMessage(query) {
  return (refs.allInfo.innerHTML = '<h2>No matching for <span> '.concat(
    query,
    ' </span>location found.</h2>'
  ));
}
function handleMoreInfoButton(e) {
  var isOnImageClick = e.target.classList.contains('linkToForecast');
  if (!isOnImageClick) {
    return;
  }
  fetch(
    'https://api.weatherapi.com/v1/forecast.json?key='
      .concat(API_KEY, '&q=')
      .concat(query, '&days=')
      .concat(DAY_FORECAST),
    { mode: 'cors' }
  )
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data.forecast);
      renderForecast(data.forecast.forecastday);
    })
    .catch(function () {
      return renderErrorMessage(query);
    });
}
function renderForecast(currentInfo) {
  return (refs.forecastInfo.innerHTML = ''.concat(
    currentInfo
      .map(function (item) {
        return "<ul class='listForecast'>   \n                  <li class='itemForecast'><img src=\"http:"
          .concat(item.day.condition.icon, '" alt="')
          .concat(
            item.day.condition.text,
            "\" />\n                  </li>\n                  <li class='itemForecast'>Date- <span> "
          )
          .concat(
            item.date,
            "</span>\n                  </li>\n                  <li class='itemForecast'>\n                      Max t-<span>"
          )
          .concat(
            item.day.maxtemp_c,
            "&deg;C</span>\n                  </li>\n                  <li class='itemForecast'>\n                      Min t-<span>"
          )
          .concat(
            item.day.mintemp_c,
            '&deg;C</span>\n                  </li>\n             </ul>'
          );
      })
      .join('')
  ));
}
function clearInput() {
  refs.inputEl.value = '';
}
