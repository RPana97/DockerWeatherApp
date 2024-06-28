let currentTempCelsius = null;
let tempHiCelsius = null;
let tempLoCelsius = null;
let feelsLikeCelsius = null;
let isCelsius = true;

document.getElementById('getWeather').addEventListener('click', function() {
    const zip = document.getElementById('zip').value;
    const apiKey = '9616debddd4825712c60b8e8e8ced8de'; // Your actual API key

    console.log("Fetching data for ZIP code:", zip); // Debug log
    console.log("Using API key:", apiKey); // Debug log

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

            document.getElementById('currentDate').innerText = `Current Date: ${currentDate}`;
            document.getElementById('city').innerText = city;
            document.getElementById('currentTemp').innerText = `${currentTempCelsius}°C`;
            document.getElementById('feelsLike').innerText = `Feels like: ${feelsLikeCelsius}°C`; // Updated element
            document.getElementById('currentConditions').innerText = currentConditions.charAt(0).toUpperCase() + currentConditions.slice(1);
            document.getElementById('tempHiLo').innerText = `High/Low: ${tempHiCelsius}°C / ${tempLoCelsius}°C`;

            const weatherDataElement = document.getElementById('weatherData');
            if (weatherDataElement) {
                weatherDataElement.style.display = 'block';
            }
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
    
    if (isCelsius) {
        const currentTempFahrenheit = (currentTempCelsius * 9/5) + 32;
        const tempHiFahrenheit = (tempHiCelsius * 9/5) + 32;
        const tempLoFahrenheit = (tempLoCelsius * 9/5) + 32;
        const feelsLikeFahrenheit = (feelsLikeCelsius * 9/5) + 32; // Updated calculation
        document.getElementById('currentTemp').innerText = `${currentTempFahrenheit.toFixed(2)}°F`;
        document.getElementById('tempHiLo').innerText = `High/Low: ${tempHiFahrenheit.toFixed(2)}°F / ${tempLoFahrenheit.toFixed(2)}°F`;
        document.getElementById('feelsLike').innerText = `Feels like: ${feelsLikeFahrenheit.toFixed(2)}°F`; // Updated element

        isCelsius = false;
    } else {
        document.getElementById('currentTemp').innerText = `${currentTempCelsius}°C`;
        document.getElementById('tempHiLo').innerText = `High/Low: ${tempHiCelsius}°C / ${tempLoCelsius}°C`;
        document.getElementById('feelsLike').innerText = `Feels like: ${feelsLikeCelsius}°C`; // Updated element

        isCelsius = true;
    }
});