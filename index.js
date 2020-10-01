var express=require("express");
var app=express();
const bodyParser = require("body-parser");
const router=express.Router();

const MongoClient=require('mongodb').MongoClient;

const url='mongodb://localhost:27017';
const dbName='Hospital';
const err="Error 404 not found...";
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
let db
MongoClient.connect(url,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
  },(err,client)=>{
if(err) return console.log(err);
db=client.db(dbName);
console.log(`Connected Database: ${url}`);
console.log(`Database: ${dbName}`);
});
app.get('/', function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    // res.write()
    res.write("<h1 style='color:red'>Welcome to Hospital Management System!</h1>");
    res.end();
});
//HOSPITALINFO
app.get('/hospitaldetails',function(req,res){
console.log("Fetching data from Hospital Info Collection...");
db.collection('HospitalInfo',function(err,collection){
    collection.find().toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.redirect('/hospitaldetails');
res.end();
});
});});

//VENTILATOR INFO
app.get('/ventilatordetails',function(req,res){
console.log("Fetching data from ventilator Info Collection...");
db.collection('VentilatorInfo',function(err,collection){
collection.find().toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
    });
    });});

//FIND Hospital by name 
app.get('/hospitaldetails/gethosbyname',function(req,res){
console.log("Finding hospital by name...");
db.collection('HospitalInfo',function(err,collection){
console.log(req.query.name);
var q={name:req.query.name};
collection.find(q).toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
    });
    });});
//FIND ventilator by status 
app.get('/ventilatordetails/getventbystatus',function(req,res){
console.log("Finding ventilator by status...");
db.collection('VentilatorInfo',function(err,collection){
var q={status:req.query.status};
collection.find(q).toArray(function(err,items){
if (err) throw err;
console.log(items);
res.send(items);
res.end();
        });
        });});
//getventilatorbyhospitalname
app.get('/ventilatordetails/getventbyname',function(req,res){
    console.log("Finding ventilator by name...");
    db.collection('VentilatorInfo',function(err,collection){
    var q={name:req.query.name};
    collection.find(q).toArray(function(err,items){
    if (err) throw err;
    console.log(items);
    res.send(items);
    res.end();
            });
            });});
//update ventilator details
app.put('/updatevent',function(req,res){
console.log("Updating ventilator details...");
var v=req.query.vid;
var s=req.query.status;
var myquery = { vid: v};
var newvalues = { $set: {status: req.body.status} };
db.collection('VentilatorInfo',function(err,collection){
collection.updateOne(myquery, newvalues,function(err,items){
if (err) throw err;
console.log("1 ventilator updated...");
res.end("1 ventilator updated..") ;
res.end();
});
});});
//add ventilator details
app.put('/addvent',function(req,res){
console.log("Adding ventilator details...");
var vid=req.query.vid;
var hid=req.query.hid;
var status=req.query.status;
var name=req.query.name;
var query={"vid":vid,"hid":hid,"status":status,"name":name};
db.collection('VentilatorInfo',function(err,collection){
collection.insertOne(query,function(err,items){
if (err) throw err;
console.log("1 ventilator added...");
res.end("1 ventilator added.."+items) ;
res.end();
    });
    });});
//delete ventilator by ventilator id
app.delete('/deletevent',function(req,res){
console.log("Deleting ventilator details...");
var d=req.query.vid;
db.collection('VentilatorInfo',function(err,collection){
    var q={vid:d};
collection.deleteMany(q,function(err,items){
if (err) throw err;
console.log("1 ventilator deleted..");   
res.end("1 ventilator deleted.."+items) ;
res.end();
    });
});});
app.listen(8004);


