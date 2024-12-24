function connect() {
    var countryName = document.getElementById("countryInput").value;
    document.getElementById("countryInput").value = "";

    if (countryName === "") {
        alert("Please enter a country name.");
        return;
    }

    var url = `https://restcountries.com/v3.1/name/${countryName}`;

    fetch(url)
        .then(function(response) {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(function(data) { process(data); })
        .catch(function(error) { alert(error.message); });
}
function process(data) {
    var countries = data;
    var resultsContainer = document.getElementById("countryResults");
    resultsContainer.innerHTML = "";

    for (var i = 0; i < countries.length; i++) {
        var country = countries[i];

        var countryCard = document.createElement("div");
        countryCard.className = "card";
        countryCard.setAttribute("data-country", country.name.common);

        countryCard.innerHTML = `
    <img src="${country.flags.svg}" alt="Flag of ${country.name.common}" />
    <div class="card-body">
        <h5 class="card-title">${country.name.common}</h5>
        <p class="card-text"><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p class="card-text"><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p class="card-text"><strong>Region:</strong> ${country.region}</p>
        <p class="card-text"><strong>Area:</strong> ${country.area.toLocaleString()} km²</p>
        <p class="card-text"><strong>Currency:</strong> ${Object.values(country.currencies || {})
            .map(c => c.name)
            .join(', ')}</p>
        <p class="card-text"><strong>Languages:</strong> ${Object.values(country.languages || {})
            .join(', ')}</p>
        <button class="btn btn-primary" onclick="fetchWeather('${country.capital ? country.capital[0] : ''}', '${country.name.common}')">More Details</button>
        <div class="weather-details mt-3"></div> <!-- Placeholder for weather -->
    </div>
`;


        resultsContainer.appendChild(countryCard);
    }
}


function fetchWeather(capital, countryName) {
    var weatherApiKey = '98376fd5b9b4a27591ec73cdaa8eee92';
    var weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${weatherApiKey}`;

    fetch(weatherApiUrl)
        .then(function (response) {
            if (!response.ok) {
                throw new Error('Weather data not found');
            }
            return response.json();
        })
        .then(function (weatherData) {
    
            var card = document.querySelector(`.card[data-country="${countryName}"]`);
            if (card) {
                var weatherDetails = card.querySelector(".weather-details");
                weatherDetails.innerHTML = `
                    <div class="alert alert-info">
                        <h6>Weather in ${capital}:</h6>
                        <p><strong>Temperature:</strong> ${(weatherData.main.temp - 273.15).toFixed(2)}°C</p>
                        <p><strong>Condition:</strong> ${weatherData.weather[0].description}</p>
                        <p><strong>Humidity:</strong> ${weatherData.main.humidity}%</p>
                        <p><strong>Wind Speed:</strong> ${(weatherData.wind.speed * 3.6).toFixed(2)} km/h</p>
                    </div>
                `;
            }
        })
        .catch(function (error) {
            alert(error.message);
        });
}


