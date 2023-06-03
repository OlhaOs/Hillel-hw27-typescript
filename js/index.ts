interface Refs {
  allInfo: HTMLElement | null;
  inputEl: HTMLInputElement | null;
  btnEl: HTMLButtonElement | null;
  forecastInfo: HTMLElement | null;
}

const refs: Refs = {
  allInfo: document.querySelector('#weatherInfo'),
  inputEl: document.querySelector('.inputField'),
  btnEl: document.querySelector('.checkWeatherBtn'),
  forecastInfo: document.querySelector('#weatherForecast'),
};

const API_KEY = '7678b79646da4dcca50153348231305';
const DAY_FORECAST = 5;
let query = '';

if (refs.btnEl) {
  refs.btnEl.addEventListener('click', handleSearchButton);
}
if (refs.allInfo) {
  refs.allInfo.addEventListener('click', handleMoreInfoButton);
}

function handleSearchButton(e: Event) {
  if (refs.inputEl) {
    query = refs.inputEl.value;
    fetchApi(query);
    clearInput();
  }
}

function fetchApi(query: string) {
  fetch(
    `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${query}`,
    {
      mode: 'cors',
    }
  )
    .then(response => response.json())
    .then(data => {
      renderData(data.current);
    })
    .catch(() => renderErrorMessage(query));
}

interface WeatherData {
  text: string;
  icon: string;
  feelslike_c: number;
  temp_c: number;
  humidity: number;
  wind_kph: number;
  last_updated: string;
}

function renderData(currentInfo: WeatherData) {
  const { text, icon, feelslike_c, temp_c, humidity, wind_kph, last_updated } =
    currentInfo;

  if (refs.allInfo) {
    refs.allInfo.innerHTML = `
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
      <p class="captionForImg">Click for forecast for ${DAY_FORECAST} days in ${query}</p></div>
    `;
  }
}


function renderErrorMessage(query: string) {
  if (refs.allInfo) {
    refs.allInfo.innerHTML = `<h2>No matching for <span> ${query} </span>location found.</h2>`;
  }
}

function handleMoreInfoButton(e: Event) {
  const isOnImageClick = (e.target as HTMLElement).classList.contains(
    'linkToForecast'
  );
  if (!isOnImageClick) {
    return;
  }
  fetch(
    `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${query}&days=${DAY_FORECAST}`,
    { mode: 'cors' }
  )
    .then(response => response.json())
    .then(data => {
      renderForecast(data.forecast.forecastday);
    })
    .catch(() => renderErrorMessage(query));
}
interface ForecastData {
  day: {
    condition: {
      icon: string;
      text: string;
    };
    maxtemp_c: number;
    mintemp_c: number;
  };
  date: string;
}
function renderForecast(currentInfo: ForecastData[]) {
  if (refs.forecastInfo) {
    refs.forecastInfo.innerHTML = `${currentInfo
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
      .join('')}`;
  }
}

function clearInput() {
  if (refs.inputEl) {
    refs.inputEl.value = '';
  }
}
