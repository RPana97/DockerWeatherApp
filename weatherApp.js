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
            const currentTemp = data.main.temp;
            const currentConditions = data.weather[0].description;
            const feelsLike = data.main.feels_like;
            const tempHi = data.main.temp_max;
            const tempLo = data.main.temp_min;

            document.getElementById('currentDate').innerText = `Current Date: ${currentDate}`;
            document.getElementById('city').innerText = city;
            document.getElementById('currentTemp').innerText = `${currentTemp}°C`;
            document.getElementById('feelsLike').innerText = `Feels like : ${feelsLike}°C`;
            document.getElementById('currentConditions').innerText = currentConditions.charAt(0).toUpperCase() + currentConditions.slice(1);
            document.getElementById('tempHiLo').innerText = `High/Low : ${tempHi}°C / ${tempLo}°C`;

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