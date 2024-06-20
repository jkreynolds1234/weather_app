const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { request } = require("http");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
// Own stylesheet
app.use("/", express.static(__dirname + '/public'));
//Bootstrap stylesheet
app.use("/", express.static(__dirname + '/node_modules/bootstrap/dist'));

app.get("/", function(req, res){
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res){
    const query = req.body.cityName;
    const apiKey = "16c896292eba4330a3a5c4998afdced2";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey;
    
    // console.log(url)
    // https://api.openweathermap.org/data/2.5/weather?q=sacramento&appid=16c896292eba4330a3a5c4998afdced2

    // https get request to OpenWeatherMap's API
    https.get(url, function(response){
        // console.log(response.statusCode);

        response.on("data", function(data){
            // Get weather data
            const weatherData = JSON.parse(data);
            // console.log(weatherData);
            // temp response in Kelvins --> convert to fahrenheit
            temp = Math.round(((((weatherData.main.temp)-273.15)*9)/5)+32);
            // temp = +temp.toFixed(2);
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            feels_like = Math.round(((((weatherData.main.feels_like)-273.15)*9)/5)+32);
            min_temp = Math.round(((((weatherData.main.temp_min)-273.15)*9)/5)+32);
            max_temp = Math.round(((((weatherData.main.temp_max)-273.15)*9)/5)+32);
            pressure = weatherData.main.pressure;
            humidity = weatherData.main.humidity;
            wind = weatherData.wind.speed;

            // Get sunrise time
            let sunrise_unix = weatherData.sys.sunrise + weatherData.timezone;
            let sunrise_date = new Date(sunrise_unix*1000);
            [sunrise_hrs, sunrise_mins, sunrise_tod] = hoursMins(sunrise_date);
            // Get sunset time
            let sunset_unix = weatherData.sys.sunset + weatherData.timezone;
            let sunset_date = new Date(sunset_unix*1000);
            [sunset_hrs, sunset_mins, sunset_tod] = hoursMins(sunset_date);

            // Get current date and time
            current_date = new Date();
            hours = current_date.getHours();
            if (hours >= 12) {
                tod = "pm";
            }
            else {
                tod ="am";
            }
            if (hours > 12) {
                hours = hours%12;
            }
            minutes = current_date.getMinutes();
            if (minutes < 10) {
                minutes = "0" + minutes;
            }
            const days_of_wk = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
            day_of_wk = days_of_wk[current_date.getDay()];
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let month = months[current_date.getMonth()];
            day = current_date.getDate();

            // HTML return
            html = `
                <!DOCTYPE html>
                <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <link rel="stylesheet" href="/css/bootstrap.min.css"/>
                        <link href="/styles.css" rel="stylesheet">
                    </head>
                    <body>
                        <h2 id="weatherTitle">${query} Weather</h2>
                        <div id="timeDate">
                            <h6>${day_of_wk}, ${month} ${day}</h6>
                            <h6>${hours}:${minutes}${tod}</h6>
                        </div>
                        <div id="tempContainer">
                            <img src="${imageURL}">
                            <h1 id="temp">${temp}°F</h1>
                        </div>
                        <h3>${weatherDescription}</h3>
                        <div id="minMaxContainer">
                            <h6>Min Temp | Max Temp</h6>
                            <h6>${min_temp}°F | ${max_temp}°F</h6>
                        </div>
                        <div class="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-3 text-center" id="cards">
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title">Sunrise & Sunset</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">${sunrise_hrs}:${sunrise_mins}${sunrise_tod}</p>
                                        <p class="card-text">${sunset_hrs}:${sunset_mins}${sunset_tod}</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title">Feels like</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">${feels_like}°F</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title">Humidity</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">${humidity}%</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col">
                                <div class="card">
                                    <div class="card-header">
                                        <h5 class="card-title">Wind Speed</h5>
                                    </div>
                                    <div class="card-body">
                                        <p class="card-text">${wind}m/s</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <script language="javascript" src="/js/bootstrap.min.js"></script>
                    </body>
                </html>
            `;
            res.write(html);
            // console.log(url);
            res.send();
        });
    });
});


app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});

function hoursMins(date) {
    hours = date.getUTCHours();
    if (hours >= 12) {
        tod = "pm";
    }
    else {
        tod ="am";
    }
    if (hours > 12) {
        hours = hours%12;
    }
    minutes = date.getUTCMinutes();
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    return [hours, minutes, tod];
}