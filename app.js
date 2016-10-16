var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var uuid = require("node-uuid");
var dataModelElements;
var jsonfile = require("jsonfile");
var dataTypes = require("./data/dataTypes.json");
var units = require("./data/units.json");
var elementTypes = require("./data/elementTypes.json");

app.use(express.static('public'));
app.use(bodyParser.json({ extended: true }));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

var file = './data/datamodelelements.json';
jsonfile.readFile(file, function(err, obj) {
    dataModelElements = obj;
});




app.get('/', function (req, res) {
    res.send('Hello World!');
});

// enums
app.get('/api/enums/datatypes', function(req, res) {
    res.json(dataTypes);
    console.dir(dataTypes);
});

app.get('/api/enums/units', function(req, res) {
    res.json(units);
    console.dir(units);
});

app.get('/api/enums/elementtypes', function(req, res) {
    res.json(elementTypes);
});


// return all formal params
app.get("/api/datamodel/elements", function(req, res) {

    res.json(dataModelElements);
    console.dir(dataModelElements);
});

// return a formal param with passed id
app.get("/api/datamodel/elements/:id", function(req, res) {
    var fparamId = req.params.id;

    var param = dataModelElements.find(r => r.id == fparamId);

    res.send(param);
});

// create a new formal param
app.post('/api/datamodel/elements/add', function(req, res) {
    var formalparam = {
        id: uuid.v4(),
        name: req.body.name,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        dataType: req.body.dataType,
        units: req.body.units
    };

    dataModelElements.push(formalparam);

    // update our 'database'
    jsonfile.writeFile(file, dataModelElements, function (err) {
        console.error(err);
    });

    // return JSON in response
    res.json(dataModelElements);
});

// update a formal param
app.post('/api/datamodel/elements/update', function(req, res) {

    var index = dataModelElements.findIndex(r => r.id == req.body.id);

    var dataModelElement = {
        id: req.body.id,
        name: req.body.name,
        shortDesc: req.body.shortDesc,
        longDesc: req.body.longDesc,
        dataType: req.body.dataType,
        units: req.body.units
    };

    dataModelElements[index] = dataModelElement;
    // update our 'database'
    jsonfile.writeFile(file, dataModelElements, function (err) {
        console.error(err);
    });

    // return JSON in response
    res.json(dataModelElement);
});

// delete a formal param with passed id
app.delete("/api/datamodel/elements/:id", function(req, res) {
    var fparamId = req.params.id;

    console.dir('deleting...');
    console.dir(fparamId);

    dataModelElements = dataModelElements.filter(r => r.id != fparamId);
    
    // update our 'database'
    jsonfile.writeFile(file, dataModelElements, function (err) {
        console.error(err);
    });

    res.send(dataModelElements);
});



app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});