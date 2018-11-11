const express = require("express");
const application = new express();
const bodyP = require("body-parser");
const mysql = require('mysql');

const ip = "127.0.0.1";
const frecuencia = 1000; 

application.use(bodyP.json());
application.post("/info",infoHandler);
application.post("/search",searchHandler);

var idRequest;
var urlRequest;
var dateRequest;

function infoHandler(request, response){
    var now = new Date();
    respuesta = {
        "id": "GuAsh_PT",
        "url": ip,
        "date": now,
        "hardware": {
            "id01": {
                "tag": "Medidor de Watts",
                "type": "input"
            },
            "id02": {
                "tag": "LED Limite de Consumo",
                "type": "output"
            }
        }
    }
    response.send(respuesta);
};

function searchHandler(request, response){
    var start = request.body.search.start_date;
    var end = request.body.search.finish_date;
    var id = request.body.search.id_hardware;

    var startQuery = start.slice(0,19).replace("T", " ");
    var endQuery = end.slice(0,19).replace("T", " ");
    var data = {}; 
    var now = new Date();

    var con = mysql.createConnection({
        host: "127.0.0.1",
        user: "root",
        password: "",
        database: "test"
      });

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT * FROM sensor WHERE (Time BETWEEN '" + startQuery + "' AND '" + endQuery + "')", function (err, result) {
          if (err) throw err;
          result.forEach((valor)=>{
            var timeKey = valor.Time.toISOString();
            data[timeKey] = {};
                data[timeKey].sensor = valor.Watt;
                data[timeKey].freq = frecuencia;
          });
          src = {
            "id_hardware": id,
            "type": "input"
        };
    
        respuesta = {
            "id": "GuAsh_PT",
            "url": ip,
            "date": now,
            "search": src,
            "data": data
        }
        console.log(respuesta);
        response.send(respuesta);
        });
    });
}

application.listen(8080);

