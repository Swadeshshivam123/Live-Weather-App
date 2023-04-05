const fs  = require('fs');
const http = require('http');
const requests = require('requests');

const homeFile = fs.readFileSync('home.html', "utf-8");

const replaceVal = (tempVal, origVal) => {

    let result = tempVal.replace("{%temp%}", (origVal.main.temp-273.15).toFixed(2));
    result = result.replace("{%tempMin%}", (origVal.main.temp_min-273.15).toFixed(2));
    result = result.replace("{%tempMax%}", (origVal.main.temp_max-273.15).toFixed(2));
    result = result.replace("{%location%}", origVal.name);
    result = result.replace("{%country%}", origVal.sys.country);
    result = result.replace("{%temp_status%}", origVal.weather[0].main);
    return result;
}

const server = http.createServer((req, res) => {
    if(req.url=='/'){
        requests(
            "https://api.openweathermap.org/data/2.5/weather?q=Pune&appid=99a9cc7b9dbfd28c4dc15d63ec73d6b0"
        )
            .on("data", (chunk) => {
                const objData = JSON.parse(chunk);
                //Converting object data into array data
                const arrData = [objData];
                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join(""); //Converting array data into String
                res.write(realTimeData);
                console.log(realTimeData);
            })
            .on("end", (err) => {
                if(err) return console.log("Connection closed due to errors.", err);
                res.end();
            });
    }
});

server.listen(8000, '127.0.0.1');