const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const bodyParser=require('body-parser')
const cors =require('cors')

require('dotenv').config()
console.log(process.env.DB_Name)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gyrtj.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

const app = express();
// app.use(express())
app.use(express.json())
app.use(cors());





const port = 5000



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection= client.db("FlyingRabit").collection("products");
  console.log("Conected")
  app.post('/addProduct',(req,res)=>{
      const product=req.body;
      console.log(product)
      productsCollection.insertOne(product)
      .then(result=>{
          console.log(result.insertedCount)
      })
  })

    app.get('/products',(req,res)=>{
        productsCollection.find({})
        .toArray((err,documents)=> {
            res.send(documents)
        })
    })
    app.delete('delete/:id', (req, res) => {
        const id = ObjectID(req.params.id);
        console.log('delete this', id);
        eventCollection.findOneAndDelete({_id: id})
        .then(documents => res.send(!!documents.value))
    })

    app.get('/products/:id', (req, res) => {
        id=req.params.id
        productsCollection.find({key: req.params.key})
        .toArray( (err, documents) => {
         
            res.send(documents[id-1]);
        })
    })
});
client.connect(err => {
    const collection = client.db("FlyingRabit").collection("Orders");
    console.log("Conected")


    app.post('/orders', (req, res) => {
        const newOrders = req.body;
        console.log(newOrders)
        collection.insertOne(newOrders)
            .then(result => {
                res.send(result.insertedCount > 0);
            })
        
    })

    app.get('/orders',(req,res)=>{
        console.log(req.query.email)
        collection.find({email:req.query.email})
        .toArray((err,documents)=>{
            res.send(documents)
        })

    })
  });

app.listen(process.env.PORT || port)