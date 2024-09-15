document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'bd5e378503939ddaee76f12ad7a97608';
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const modeButton = document.getElementById('modeButton');
    const locationName = document.getElementById('locationName');
    const timeDisplay = document.getElementById('time');
    const dateDisplay = document.getElementById('date');
    const hourlyForecast = document.getElementById('hourlyForecast');
    const fiveDayForecast = document.getElementById('fiveDayForecast');
    const weatherDetails = document.getElementById('weatherDetails');

    // Toggle light/dark mode
    modeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        localStorage.setItem('darkModeEnabled', document.body.classList.contains('dark-mode'));
    });
    
    // Check if dark mode is enabled on page load
    if (localStorage.getItem('darkModeEnabled') === 'true') {
        document.body.classList.add('dark-mode');
    }

    // Fetch and display weather data
    searchButton.addEventListener('click', () => {
        const location = searchInput.value.trim();
        if (!location) {
            alert('Please enter a location.');
            return;
        }
        fetchWeatherData(location);
    });

    function fetchWeatherData(location) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.cod !== 200) {
                    throw new Error(data.message);
                }
                updateCurrentLocation(data);
                fetchHourlyForecast(data.coord.lat, data.coord.lon);
                fetchFiveDayForecast(data.coord.lat, data.coord.lon);
                updateWeatherDetails(data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                alert(`Could not retrieve weather data for the location: ${error.message}`);
            });
    }

    function updateCurrentLocation(data) {
        const cityName = data.name;
        const country = data.sys.country;
        locationName.textContent = `${cityName}, ${country}`;
        updateTimeAndDate();
    }

    function updateTimeAndDate() {
        const now = new Date();
        timeDisplay.textContent = now.toLocaleTimeString();
        dateDisplay.textContent = now.toLocaleDateString();
    }

    function fetchHourlyForecast(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const hourlyData = data.list.slice(0, 5); // Get next 5 hours
                hourlyForecast.innerHTML = hourlyData.map(hour => `
                    <div class="hour">
                        <p>${new Date(hour.dt * 1000).toLocaleTimeString()}</p>
                        <p>${hour.main.temp}°C</p>
                        <p>${hour.weather[0].description}</p>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching hourly forecast:', error);
            });
    }

    function fetchFiveDayForecast(lat, lon) {
        fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`)
            .then(response => response.json())
            .then(data => {
                const dailyData = data.list.filter((_, index) => index % 8 === 0); // Get daily data
                fiveDayForecast.innerHTML = dailyData.map(day => `
                    <div class="day">
                        <p>${new Date(day.dt * 1000).toLocaleDateString()}</p>
                        <p>${day.main.temp}°C</p>
                        <p>${day.weather[0].description}</p>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching 5-day forecast:', error);
            });
    }

    function updateWeatherDetails(data) {
        weatherDetails.innerHTML = `
            <p>Temperature: ${data.main.temp}°C</p>
            <p>Humidity: ${data.main.humidity}%</p>
            <p>Pressure: ${data.main.pressure} hPa</p>
            <p>Wind Speed: ${data.wind.speed} m/s</p>
        `;
    }
});