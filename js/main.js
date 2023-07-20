let form = document.getElementById('weather-form');
let weatherInfo = document.getElementById('weather-info');


function getWeatherData(latitude, longitude) {

    const apiKey = 'c9fe74109ea93f911dfec2ced560e689';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;


    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            const temperature = data.main.temp;
            const humidity = data.main.humidity;
            const windSpeed = data.wind.speed;
            const cityName = data.name
            const country = data.sys.country

            const weatherHTML = `
                <p>Температура: ${temperature}°C</p>
                <p>Влажность: ${humidity}%</p>
                <p>Скорость ветра: ${windSpeed} м/с</p>
                <p>Страна ${country}</p>
                <p>Город: ${cityName} </p>
            `;
            weatherInfo.innerHTML = weatherHTML;

            const cacheData = {
                temperature,
                humidity,
                windSpeed,
                country,
                cityName,
                timestamp: Date.now()
            };
            localStorage.setItem(`weather_${latitude}_${longitude}`, JSON.stringify(cacheData));

        })


        .catch(error => {
            weatherInfo.innerHTML = '<p>Произошла ошибка при получении данных о погоде.</p>';
        });
}

form.addEventListener('submit', event => {
    event.preventDefault();
    let latitudeInput = document.getElementById('latitude').value;
    let longitudeInput = document.getElementById('longitude').value;

    const validLatitude = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/.test(latitudeInput);
    const validLongitude = /^-?([1]?[0-7]?[0-9](\.[0-9]+)?|180(\.0+)?)$/.test(longitudeInput);

    if (!validLatitude || !validLongitude) {
        weatherInfo.innerHTML = '<p>Введите корректные значения широты и долготы.</p>';
    } else {
        weatherInfo.innerHTML = '';

        const cacheData = localStorage.getItem(`weather_${latitudeInput}_${longitudeInput}`);

        if (cacheData) {
            const parsedData = JSON.parse(cacheData);
            const timestamp = parsedData.timestamp;
            const currentTime = Date.now();
            const cacheDuration = 60 * 60 * 1000;

            if (currentTime - timestamp < cacheDuration) {
                const temperature = parsedData.temperature;
                const humidity = parsedData.humidity;
                const windSpeed = parsedData.windSpeed;
                const cityName = parsedData.cityName;
                const country = parsedData.country

                const weatherHTML = `                    
                    <p>Температура: ${temperature}°C</p>
                    <p>Влажность: ${humidity}%</p>
                    <p>Скорость ветра: ${windSpeed} м/с</p>
                    <p>Страна ${country}</p>
                    <p>Город: ${cityName} </p>
                `;
                weatherInfo.innerHTML = weatherHTML;
            } else {
                getWeatherData(latitudeInput, longitudeInput);
            }
        } else {
            getWeatherData(latitudeInput, longitudeInput);
        }
        document.getElementById('latitude').value = '';
        document.getElementById('longitude').value = '';
    }
});
