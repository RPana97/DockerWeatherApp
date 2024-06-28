let currentTempCelsius = null;
let tempHiCelsius = null;
let tempLoCelsius = null;
let feelsLikeCelsius = null;
let isCelsius = true;

function addCloseButtonListeners() {
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            button.closest('.card').remove();
        });
    });
}

document.getElementById('getWeather').addEventListener('click', function() {
    const zip = document.getElementById('zip').value;
    const apiKey = '9616debddd4825712c60b8e8e8ced8de'; // Your actual API key

    console.log("Fetching data for ZIP code:", zip); // Debug log
    console.log("Using API key:", apiKey); // Debug log

    // Check if a card with this ZIP code already exists
    if (document.querySelector(`.card[data-zip="${zip}"]`)) {
        alert("Weather data for this ZIP code is already displayed.");
        return;
    }

    // Fetch to get current weather data based on ZIP code
    fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},US&appid=${apiKey}&units=metric`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log("Current Weather API response:", data); // Debug log
            if (!data.main || !data.weather) {
                throw new Error('Invalid weather data received');
            }

            const currentDate = new Date(data.dt * 1000).toLocaleDateString();
            const city = data.name;
            currentTempCelsius = data.main.temp;
            tempHiCelsius = data.main.temp_max;
            tempLoCelsius = data.main.temp_min;
            feelsLikeCelsius = data.main.feels_like; // Updated variable assignment
            const currentConditions = data.weather[0].description;

            // Fetch 3-day forecast data
            fetch(`https://api.openweathermap.org/data/2.5/forecast?zip=${zip},US&appid=${apiKey}&units=metric`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok: ' + response.statusText);
                    }
                    return response.json();
                })
                .then(forecastData => {
                    console.log("Forecast API response:", forecastData); // Debug log

                    // Extract forecast data for the next 3 days
                    const forecast = [];
                    for (let i = 1; i <= 3; i++) {
                        const forecastDate = new Date(forecastData.list[i * 8].dt * 1000).toLocaleDateString();
                        const forecastTemp = forecastData.list[i * 8].main.temp;
                        forecast.push({ date: forecastDate, temp: forecastTemp });
                    }

                    const forecastHTML = forecast.map(day => `
                        <div class="forecast-day">
                            <p>${day.date}</p>
                            <p class="forecast-temp">${day.temp.toFixed(2)}°C</p>
                        </div>
                    `).join('');

                    const weatherCardHTML = `
                        <div class="card" data-zip="${zip}" style="border-radius: 10px; position: relative;">
                            <button class="close-btn" style="position: absolute; top: 10px; right: 10px; background-color: transparent; border: none; color: white; font-size: 20px; cursor: pointer;">&times;</button>
                            <div class="bg-image ripple" data-mdb-ripple-color="light"
                                style="border-top-left-radius: 10px; border-top-right-radius: 10px; position: relative;">
                                <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-weather/draw2.webp"
                                    class="w-100" style="border-radius: 10px;" />
                                <div class="mask" style="background-color: rgba(0,0,0,.45); position: absolute; top: 0; left: 0; right: 0; bottom: 0;">
                                    <div class="d-flex justify-content-between p-4">
                                        <a href="#!" class="text-white"><i class="fas fa-chevron-left fa-lg"></i></a>
                                        <a href="#!" class="text-white"><i class="fas fa-cog fa-lg"></i></a>
                                    </div>
                                    <div class="text-center text-white position-absolute w-100" style="top: 50%; transform: translateY(-50%);">
                                        <p class="h3 mb-4">${currentConditions.charAt(0).toUpperCase() + currentConditions.slice(1)}</p>
                                        <p class="h5 mb-4">${city}</p>
                                        <p class="display-2"><strong class="current-temp">${currentTempCelsius}°C</strong></p>
                                        <p class="h5 fw-normal feels-like">Feels like: <span class="feels-like-temp">${feelsLikeCelsius}°C</span></p>
                                        <p class="h5 fw-normal high-low">High/Low: <span class="high-low-temp">${tempHiCelsius}°C / ${tempLoCelsius}°C</span></p>
                                        <p class="h5 fw-normal current-date">Current Date: ${currentDate}</p>
                                    </div>
                                </div>
                                <div class="forecast-container text-center text-dark">
                                    ${forecastHTML}
                                </div>
                            </div>
                        </div>
                    `;

                    const weatherCardsContainer = document.getElementById('weatherCards');
                    weatherCardsContainer.innerHTML += weatherCardHTML;

                    // Add event listeners to all close buttons
                    addCloseButtonListeners();

                    // Scroll to the new card
                    const newCard = weatherCardsContainer.querySelector(`.card[data-zip="${zip}"]`);
                    newCard.scrollIntoView({ behavior: 'smooth' });
                })
                .catch(error => {
                    console.error('Error fetching forecast data:', error);
                    alert('Error fetching forecast data: ' + error.message);
                });
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Error fetching weather data: ' + error.message);
        });
});

document.getElementById('toggleTemp').addEventListener('click', function() {
    if (currentTempCelsius === null) {
        return;
    }
    
    const cards = document.querySelectorAll('#weatherCards .card');
    cards.forEach(card => {
        const tempElement = card.querySelector('.current-temp');
        const feelsLikeElement = card.querySelector('.feels-like-temp');
        const hiLoElement = card.querySelector('.high-low-temp');
        const forecastTemps = card.querySelectorAll('.forecast-temp');

        console.log('Temp Element:', tempElement);
        console.log('Hi/Lo Element:', hiLoElement);
        console.log('Feels Like Element:', feelsLikeElement);

        if (tempElement && hiLoElement && feelsLikeElement) {
            if (isCelsius) {
                const currentTempFahrenheit = (parseFloat(tempElement.textContent) * 9/5) + 32;
                const hiLoText = hiLoElement.textContent.split(' / ');
                console.log('hiLoText:', hiLoText); // Debug log

                const tempHiFahrenheit = (parseFloat(hiLoText[0]) * 9/5) + 32;
                const tempLoFahrenheit = (parseFloat(hiLoText[1]) * 9/5) + 32;
                const feelsLikeFahrenheit = (parseFloat(feelsLikeElement.textContent) * 9/5) + 32;

                tempElement.textContent = `${currentTempFahrenheit.toFixed(2)}°F`;
                hiLoElement.textContent = `${tempHiFahrenheit.toFixed(2)}°F / ${tempLoFahrenheit.toFixed(2)}°F`;
                feelsLikeElement.textContent = `${feelsLikeFahrenheit.toFixed(2)}°F`;

                forecastTemps.forEach(forecastTemp => {
                    const tempCelsius = parseFloat(forecastTemp.textContent);
                    const tempFahrenheit = (tempCelsius * 9/5) + 32;
                    forecastTemp.textContent = `${tempFahrenheit.toFixed(2)}°F`;
                });
            } else {
                const currentTempCelsius = (parseFloat(tempElement.textContent) - 32) * 5/9;
                const hiLoText = hiLoElement.textContent.split(' / ');
                console.log('hiLoText:', hiLoText); // Debug log

                const tempHiCelsius = (parseFloat(hiLoText[0]) - 32) * 5/9;
                const tempLoCelsius = (parseFloat(hiLoText[1]) - 32) * 5/9;
                const feelsLikeCelsius = (parseFloat(feelsLikeElement.textContent) - 32) * 5/9;

                tempElement.textContent = `${currentTempCelsius.toFixed(2)}°C`;
                hiLoElement.textContent = `${tempHiCelsius.toFixed(2)}°C / ${tempLoCelsius.toFixed(2)}°C`;
                feelsLikeElement.textContent = `${feelsLikeCelsius.toFixed(2)}°C`;

                forecastTemps.forEach(forecastTemp => {
                    const tempFahrenheit = parseFloat(forecastTemp.textContent);
                    const tempCelsius = (tempFahrenheit - 32) * 5/9;
                    forecastTemp.textContent = `${tempCelsius.toFixed(2)}°C`;
                });
            }
        } else {
            console.error('One of the elements is missing:', { tempElement, hiLoElement, feelsLikeElement });
        }
    });

    isCelsius = !isCelsius;
});

// Initial call to ensure event listeners are added for any existing cards
addCloseButtonListeners();
