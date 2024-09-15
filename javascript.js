const apiKey = '0d2d4c9e1be9dd60f3ca4c63294ee73';
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const weatherInfo = document.querySelector('.weather-info');
const locationDisplay = document.getElementById('location');

searchButton.addEventListener('click', () => {
    const location = searchInput.value;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            // Update the UI with weather data
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const cityName = data.name;
            const country = data.sys.country;

            weatherInfo.innerHTML = `
                <h2>${cityName}, ${country}</h2>
                <p>${description}</p>
                <p>Temperature: ${temperature}°C</p>
            `;

            locationDisplay.textContent = `Location: ${cityName}, ${country}`;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            weatherInfo.innerHTML = '<p>Could not retrieve weather data for the location.</p>';
        });
});