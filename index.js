//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//TODO
mongoose.connect("mongodb://carsdb.mongo.cosmos.azure.com:10255/cars?ssl=true&replicaSet=globaldb", 
{   auth: {
    user: "carsdb",
    password: "kRDNdzcgHs6jDX2bvntOwKYZSJrKgrfYHoAoC3Cs0XOI9ysfqrqj98sid0O9TSn2GBSZEiMWGNr9dTE2sytg1w=="
},
    useNewUrlParser: true,
     useUnifiedTopology: true,
      retryWrites: false});

const carSchema = {
    title : String,
    description: String,
    price: Number,
    imgUrls : [String]
}
const Car = mongoose.model("car", carSchema);
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    next();
});
app.route("/cars")
.get((req,res)=>{
    Car.find((err, results)=>{
        if (!err){
            results.sort((a,b)=>{
                if (a.name<b.name) {return -1;}
                if (a.name>b.name) {return 1;}
                return 0;
            })
            res.send(results);
        }
        else {
            res.send(err);
        }
    })
})
app.route("/cars/:id")
.get((req,res)=>{
    Car.findOne({_id: req.params.id}, (err, result)=>{
        if (result){
            result.equipment.sort((a,b)=>{
                if (a<b) {return -1;}
                if (a>b) {return 1;}
                return 0;
            })
            res.send(result);
        }
        else {
            res.send("No cars found");
        }
    })
})

app.listen(process.env.PORT || 8080, function() {
  console.log("Server started on port 8080");
});