document.getElementById('citySearch').addEventListener("keypress", function (event) {

        if (event.key === "Enter") {
            searchCity(document.getElementById('citySearch').value);
        }
    });


    function searchCity(city) {

        if (city) {
            fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${city}&language=de`
            )
                .then(response => response.json())
                .then(data => {

                    if (!data.results) {
                        alert(city + " nicht gefunden!");
                        return;
                    }

                    document.getElementById('cityName').innerHTML = data.results[0].name;
                    document.getElementById('country').innerHTML = data.results[0].country;

                    getWeather(data.results[0].latitude, data.results[0].longitude, data.results[0].timezone)
                    getTime(data.results[0].timezone)
                });
        }
    }


    function getTime(timezone) {

        var time = new Date();
        document.getElementById('time').innerHTML = time.toLocaleString("de-de",
            { year: "2-digit", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: timezone }
        );
    }


    function getWeather(latitude, longitude) {

        fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=auto&daily=precipitation_probability_max&current=wind_speed_10m,temperature_2m,weather_code,is_day`
        )
            .then(response => response.json())
            .then(data => {
                document.getElementById('temp').innerHTML = data.current.temperature_2m + "°C";
                document.getElementById('precipitationChance').innerHTML = "🌧️ " + data.daily.precipitation_probability_max[0] + "%";
                document.getElementById('windSpeed').innerHTML = "💨 " + data.current.wind_speed_10m + "km/h";

                getWeatherDetails(data.current.weather_code, data.current.is_day);
            });
    }


    function getWeatherDetails(weatherCode, isDay) {

        fetch('./weather_codes.json')
            .then(response => response.json())
            .then(data => {
                switch(isDay) {
                    case 0:
                        document.getElementById('weather').innerHTML = data[weatherCode].night.description;
                        document.getElementById('weatherIcon').innerHTML = data[weatherCode].night.image;
                        document.body.style.background = "linear-gradient(to bottom, #010E1E, #002746)";
                        break;
                    case 1:
                        document.getElementById('weather').innerHTML = data[weatherCode].day.description;
                        document.getElementById('weatherIcon').innerHTML = data[weatherCode].day.image;
                        document.body.style.background = "linear-gradient(to bottom, #1e3d75, #a0e7fb)";
                        break;
                }
            });
    }


    searchCity("Schleswig")