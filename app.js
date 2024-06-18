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

    // https get request to the api
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            // temp response in Kelvins --> convert to fahrenheit
            temp = ((((weatherData.main.temp)-273.15)*9)/5)+32;
            temp = +temp.toFixed(2)
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            html = `
                <head><meta charset="utf-8"></head>
                <body>
                    <h1>Current Weather in ${query}</h1>
                    <div id="tempContainer">
                        <img src="${imageURL}">
                        <div>
                            <h3>${temp}°F</h3>
                            <h3>${weatherDescription}</h3>
                        </div>
                    </div>
                </body>
            `;
            res.write(html)
            // res.write('<head><meta charset="utf-8"></head>');
            // res.write("<h1>The temperature in " + query + " is " + temp + " degrees Fahrenheit.</h1>");
            // res.write("<p>The weather is currently " + weatherDescription + "</p>");
            // res.write("<img src=" + imageURL +">");
            console.log(url)
            res.send();
        });
    });
});


app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});