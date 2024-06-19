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
            wind = weatherData.main.wind;
            // sunrise = msToTime(weatherData.main.sunrise);
            // sunset = msToTime(weatherData.main.sunset);
            // console.log(sunrise);
            // console.log(sunset);

            // Get current date and time
            current_date = new Date();
            hours = current_date.getHours();
            if (hours >= 12) {
                tod = "pm";
            }
            else {
                tod ="am";
            }
            minutes = current_date.getMinutes();
            const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            let month = months[current_date.getMonth()];
            day = current_date.getDate();
            // console.log(`${hours} ${minutes}`);

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
                        <h2>${query} Weather</h2>
                        <div id="timeDate">
                            <div>${month} ${day}</div>
                            <div>${hours}:${minutes}${tod}</div>
                        </div>
                        <div id="tempContainer">
                            <img src="${imageURL}">
                            <div id="tempDescription">
                                <h3>${temp}°F</h3>
                                <h3>${weatherDescription}</h3>
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

// function msToTime(duration) {
//     var milliseconds = Math.floor((duration % 1000) / 100),
//       seconds = Math.floor((duration / 1000) % 60),
//       minutes = Math.floor((duration / (1000 * 60)) % 60),
//       hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
//     hours = (hours < 10) ? "0" + hours : hours;
//     minutes = (minutes < 10) ? "0" + minutes : minutes;
//     seconds = (seconds < 10) ? "0" + seconds : seconds;
  
//     return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
// }