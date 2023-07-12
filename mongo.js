const mongo=require('mongodb')
const mongoclient=mongo.MongoClient;
const bodyparser = require('body-parser')
const express = require("express")
const path = require('path')
const app = express()
const dotenv=require('dotenv')
dotenv.config()
var PORT = process.env.port || 3000
app.use(bodyparser.urlencoded({extended:true}))
app.use(bodyparser.json())

async function getdata(){
    const client=await mongoclient.connect('mongodb://127.0.0.1:27017')
    database=client.db('college')
    if(!database){
        console.log('db not connected');
    }
    return database;
}
async function finddata(){
    const collection=database.collection('users')
    const cursor=collection.find({})
    let emp=await cursor.toArray();
    console.log(process.env.nnme);
    console.log(emp.pss);
    if(emp.pss===process.env.npss){
        console.log("congrats ")
        return 1
    }
    else{
        console.log("no pass")
        return 0
    }
}

module.exports={
    getdata,
    finddata
}
