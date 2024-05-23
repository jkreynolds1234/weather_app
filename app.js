const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const { request } = require("http");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res){

    res.sendFile(__dirname + "/index.html");

});

app.post("/", function(req, res){
    const query = req.body.cityName;
    const apiKey = "16c896292eba4330a3a5c4998afdced2";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&appid=" + apiKey;
    
    console.log(url)
    // https://api.openweathermap.org/data/2.5/weather?q=sacramento&appid=16c896292eba4330a3a5c4998afdced2

    // https get request to the api
    https.get(url, function(response){
        console.log(response.statusCode);

        response.on("data", function(data){
            const weatherData = JSON.parse(data);
            const temp = weatherData.main.temp;
            const weatherDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            res.write('<head><meta charset="utf-8"></head>');
            res.write("<h1>The temperature in " + query + " is " + temp + " degrees Fahrenheit.</h1>");
            res.write("The weather is currently " + weatherDescription);
            res.write("<img src=" + imageURL +">");
            print(url)
            res.send();
        });
    });
});


app.listen(3000, function(){
    console.log("Server is running on port 3000.");
});