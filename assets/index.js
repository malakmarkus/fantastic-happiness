var cities = [];
var apiKey = "fe3637fd42a277b6822b220a75b29af3";

var cityFormEl=document.querySelector("#city-search-form");
var cityInputEl=document.querySelector("#city");
var weatherContainerEl=document.querySelector("#current-weather-container");
var citySearchInputEl = document.querySelector("#search-history");
var forecastTitle = document.querySelector("#forecast");
var forecastContainerEl = document.querySelector("#fiveday-container");
var savedSearchButtonEl = document.querySelector("#saved-search-buttons");
var formSumbitHandler = function(event){
    event.preventDefault();
    var city = cityInputEl.value.trim();
    if(city){
        getCityWeather(city);
        get5Day(city);
        cities.unshift({city});
        cityInputEl.value = "";
    } else{
        alert("Please enter a vaild City name");
    }
    saveSearch();
    savedSearch(city);
}

var saveSearch = function(){
    localStorage.setItem("cities", JSON.stringify(cities));
};


var getCityWeather = function(city){
    var apiKey = "fe3637fd42a277b6822b220a75b29af3"
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiUrl)
    .then(function(response){
        response.json().then(function(data){
            displayWeather(data, city);
        });
    });
};

var displayWeather = function(weather, searchCity){

    weatherContainerEl.textContent= "";  
    citySearchInputEl.textContent=searchCity;

    var currentDate = document.createElement("span")
    currentDate.textContent=" (" + moment(weather.dt.value).format("MM/DD/YYYY") + ") ";
    citySearchInputEl.appendChild(currentDate);

    var weatherIcon = document.createElement("img")
    weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    citySearchInputEl.appendChild(weatherIcon);

    var temperatureEl = document.createElement("span");
    temperatureEl.textContent = "Temp: " + weather.main.temp + " °F";
    temperatureEl.classList = "list-group-item"
    weatherContainerEl.appendChild(temperatureEl);

    var windSpeedEl = document.createElement("span");
    windSpeedEl.textContent = "Wind: " + weather.wind.speed + " MPH";
    windSpeedEl.classList = "list-group-item"
    weatherContainerEl.appendChild(windSpeedEl);

    var humidityEl = document.createElement("span");
    humidityEl.textContent = "Humidity: " + weather.main.humidity + " %";
    humidityEl.classList = "list-group-item"
    weatherContainerEl.appendChild(humidityEl);
    
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;
    getUvIndex(lat,lon)
}

var getUvIndex = function(lat,lon){
    var apiKey = "fe3637fd42a277b6822b220a75b29af3"
    var apiURL = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`
    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            displayUvIndex(data)
        });
    });
}

var displayUvIndex = function(index){
    var uvIndexEl = document.createElement("div");
    uvIndexEl.textContent = "UV Index: "
    uvIndexEl.classList = "list-group-item"

    uvIndexValue = document.createElement("span")
    uvIndexValue.textContent = index.value

    if(index.value <=2){
        uvIndexValue.classList = "favorable"
    }else if(index.value >2 && index.value<=8){
        uvIndexValue.classList = "moderate "
    }
    else if(index.value >8){
        uvIndexValue.classList = "severe"
    };

    uvIndexEl.appendChild(uvIndexValue);

    weatherContainerEl.appendChild(uvIndexEl);
}

var get5Day = function(city){
    var apiKey = "fe3637fd42a277b6822b220a75b29af3"
    var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`

    fetch(apiURL)
    .then(function(response){
        response.json().then(function(data){
            display5Day(data);
        });
    });
};

var display5Day = function(weather){
    forecastContainerEl.textContent = ""
    forecastTitle.textContent = "5-Day Forecast:";

    var forecast = weather.list;
    for(var i=5; i < forecast.length; i=i+8){
        var dailyForecast = forecast[i];
        var forecastEl=document.createElement("div");
        forecastEl.classList = "card bg-dark text-light m-2";

        var forecastDate = document.createElement("h5")
        forecastDate.textContent= moment.unix(dailyForecast.dt).format("MM/DD/YYYY");
        forecastDate.classList = "card-header text-center"
        forecastEl.appendChild(forecastDate);

        var weatherIcon = document.createElement("img")
        weatherIcon.classList = "card-body text-center";
        weatherIcon.setAttribute("src", `https://openweathermap.org/img/wn/${dailyForecast.weather[0].icon}@2x.png`);  
        forecastEl.appendChild(weatherIcon);

        var forecastTempEl=document.createElement("span");
        forecastTempEl.classList = "card-body text-center";
        forecastTempEl.textContent = "Temp: " + dailyForecast.main.temp + " °F";
        forecastEl.appendChild(forecastTempEl);

        var forecastWindEl=document.createElement("span");
        forecastWindEl.classList = "card-body text-center";
        forecastWindEl.textContent = "Wind: " + dailyForecast.wind.speed + " MPH";
        forecastEl.appendChild(forecastWindEl);

        var forecastHumEl=document.createElement("span");
        forecastHumEl.classList = "card-body text-center";
        forecastHumEl.textContent = "Humidity: " + dailyForecast.main.humidity + "  %";
        forecastEl.appendChild(forecastHumEl);
        
        forecastContainerEl.appendChild(forecastEl);
    }

}

var savedSearch = function(savedSearch){

    SavedSearchEl = document.createElement("button");
    SavedSearchEl.textContent = savedSearch
    SavedSearchEl.classList = "d-flex w-100 btn-light bg-gray border p-2";
    SavedSearchEl.setAttribute("data-city",savedSearch),

    savedSearchButtonEl.prepend(SavedSearchEl);
}

var savedSearchHandler = function(event){
    var city = event.target.getAttribute("data-city")
    if(city){
        getCityWeather(city);
        get5Day(city);
    }
}

cityFormEl.addEventListener("submit", formSumbitHandler);
savedSearchButtonEl.addEventListener("click", savedSearchHandler);