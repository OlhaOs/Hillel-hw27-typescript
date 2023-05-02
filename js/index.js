const refs = {
  allInfo: document.querySelector('#weatherInfo'),
  inputEl: document.querySelector('.inputField'),
  btnEl: document.querySelector('.checkWeatherBtn'),
  forecastInfo: document.querySelector('#weatherForecast'),
};

const apiKey = '256e21670d914fe6adf161543232704';
let query = '';
refs.btnEl.addEventListener('click', handleSearchButton);
refs.allInfo.addEventListener('click', handleMoreInfoButton);

function handleSearchButton() {
  query = refs.inputEl.value;
  fetchApi(query);
  clearInput();
}

function fetchApi(query) {
  fetch(`http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${query}`)
    .then(response => response.json())
    .then(data => {
      renderData(data.current);
    })
    .catch(() => renderErrorMessage(query));
}
function renderData(currentInfo) {
  const { text, icon } = currentInfo.condition;
  const { feelslike_c, temp_c, humidity, wind_kph, last_updated } = currentInfo;

  return (refs.allInfo.innerHTML = `
  <div class='title'> 
     <h2>The weather in <span> ${query} </span> is ${text.toLowerCase()} ${last_updated}</h2>
  
  </div>
    <ul class='list'>
      <li class="item">Temperature is <span>${temp_c}&deg;C</span></li>
      <li class="item">Real feel on <span>${feelslike_c}&deg;C</span></li>
      <li class="item">Humidity is <span>${humidity}%</span></li>
      <li class="item">Wind is <span>${wind_kph} kph </span></li>
    </ul>
    <div class="checkForecastBtn"><img src="http:${icon}" class="linkToForecast" alt="${text}"}/>
    <p class="captionForImg">Click for forecast for 14 days in ${query}</p></div>
  `);
}
function renderErrorMessage(query) {
  return (refs.allInfo.innerHTML = `<h2>No matching for <span> ${query} </span>location found.</h2>`);
}
function handleMoreInfoButton(e) {
  const isOnImageClick = e.target.classList.contains('linkToForecast');
  if (!isOnImageClick) {
    return;
  }
  fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${query}&days=14`
  )
    .then(response => response.json())
    .then(data => {
      console.log(data.forecast);
      renderForecast(data.forecast.forecastday);
    })
    .catch(() => renderErrorMessage(query));
}
function renderForecast(currentInfo) {
  return (refs.forecastInfo.innerHTML = `${currentInfo
    .map(
      item =>
        `<ul class='listForecast'>   
                <li class='itemForecast'><img src="http:${item.day.condition.icon}" alt="${item.day.condition.text}" />
                </li>
                <li class='itemForecast'>Date- <span> ${item.date}</span>
                </li>
                <li class='itemForecast'>
                    Max t-<span>${item.day.maxtemp_c}&deg;C</span>
                </li>
                <li class='itemForecast'>
                    Min t-<span>${item.day.mintemp_c}&deg;C</span>
                </li>
           </ul>`
    )
    .join('')}`);
}
function clearInput() {
  refs.inputEl.value = '';
}
