// Initialize variables to store temperatures in Celsius and a flag for current temperature unit
let currentTempCelsius = null;
let tempHiCelsius = null;
let tempLoCelsius = null;
let feelsLikeCelsius = null;
let isCelsius = true;

// Function to add event listeners to close buttons on weather cards
function addCloseButtonListeners() {
    const closeButtons = document.querySelectorAll('.close-btn');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove the closest parent card element when the close button is clicked
            button.closest('.card').remove();
        });
    });
}

// Add click event listener to the button with ID 'getWeather'
document.getElementById('getWeather').addEventListener('click', function() {
    const zip = document.getElementById('zip').value; // Get the ZIP code from input field
    const apiKey = '9616debddd4825712c60b8e8e8ced8de'; // Your actual API key

    console.log("Fetching data for ZIP code:", zip); // Debug log for ZIP code
    console.log("Using API key:", apiKey); // Debug log for API key

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
            console.log("Current Weather API response:", data); // Debug log for weather API response
            if (!data.main || !data.weather) {
                throw new Error('Invalid weather data received');
            }

            const currentDate = new Date(data.dt * 1000).toLocaleDateString(); // Convert UNIX timestamp to local date
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
                    console.log("Forecast API response:", forecastData); // Debug log for forecast API response

                    // Extract forecast data for the next 3 days
                    const forecast = [];
                    for (let i = 1; i <= 3; i++) {
                        const forecastDate = new Date(forecastData.list[i * 8].dt * 1000).toLocaleDateString();
                        const forecastTemp = forecastData.list[i * 8].main.temp;
                        forecast.push({ date: forecastDate, temp: forecastTemp });
                    }

                    // Generate HTML for forecast days
                    const forecastHTML = forecast.map(day => `
                        <div class="forecast-day">
                            <p>${day.date}</p>
                            <p class="forecast-temp">${isCelsius ? day.temp.toFixed(2) : ((day.temp * 9/5) + 32).toFixed(2)}°${isCelsius ? 'C' : 'F'}</p>
                        </div>
                    `).join('');

                    // Generate HTML for the weather card
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
                                        <p class="display-2"><strong class="current-temp">${isCelsius ? currentTempCelsius.toFixed(2) : ((currentTempCelsius * 9/5) + 32).toFixed(2)}°${isCelsius ? 'C' : 'F'}</strong></p>
                                        <p class="h5 fw-normal feels-like">Feels like: <span class="feels-like-temp">${isCelsius ? feelsLikeCelsius.toFixed(2) : ((feelsLikeCelsius * 9/5) + 32).toFixed(2)}°${isCelsius ? 'C' : 'F'}</span></p>
                                        <p class="h5 fw-normal high-low">High/Low: <span class="high-low-temp">${isCelsius ? tempHiCelsius.toFixed(2) : ((tempHiCelsius * 9/5) + 32).toFixed(2)}°${isCelsius ? 'C' : 'F'} / ${isCelsius ? tempLoCelsius.toFixed(2) : ((tempLoCelsius * 9/5) + 32).toFixed(2)}°${isCelsius ? 'C' : 'F'}</span></p>
                                        <p class="h5 fw-normal current-date">Current Date: ${currentDate}</p>
                                    </div>
                                </div>
                                <div class="forecast-container text-center text-dark">
                                    ${forecastHTML}
                                </div>
                            </div>
                        </div>
                    `;

                    // Append the weather card HTML to the container
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

// Add click event listener to the button with ID 'toggleTemp'
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

        console.log('Temp Element:', tempElement); // Debug log for temperature element
        console.log('Hi/Lo Element:', hiLoElement); // Debug log for high/low element
        console.log('Feels Like Element:', feelsLikeElement); // Debug log for feels-like element

        if (tempElement && hiLoElement && feelsLikeElement) {
            if (isCelsius) {
                // Convert temperatures from Celsius to Fahrenheit
                const currentTempFahrenheit = (parseFloat(tempElement.textContent) * 9/5) + 32;
                const hiLoText = hiLoElement.textContent.split(' / ');
                console.log('hiLoText:', hiLoText); // Debug log for high/low text

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
                // Convert temperatures from Fahrenheit to Celsius
                const currentTempCelsius = (parseFloat(tempElement.textContent) - 32) * 5/9;
                const hiLoText = hiLoElement.textContent.split(' / ');
                console.log('hiLoText:', hiLoText); // Debug log for high/low text

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

    isCelsius = !isCelsius; // Toggle the temperature unit flag
});

// Initial call to ensure event listeners are added for any existing cards
addCloseButtonListeners();