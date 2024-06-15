const {startScraping} = require("./scraper")
const express = require("express");
const dotenv = require("dotenv");
const {getConnect} = require("./dbConnection")
const {client , connectToMongo} = require("./dbConnection")
dotenv.config();
// const serverless = require("serverless-http");
const cors = require("cors");
var bodyParser = require('body-parser')


app = express()
const port = process.env.port || 5000
// const router = express.Router();
app.use(cors())
app.use(bodyParser.json())
app.use(express.json())


const connectToMongoCluster = async ()=> {

    try {
    await connectToMongo();
    } catch(e) {
        console.log(e.message);
    }
    
}

connectToMongoCluster()
console.log("after connection");



app.get("/" , (req , res)=> {
    res.send({msg : "hello from vercel , render and mongodb" , calcValue : 10000});
})

app.get("/user/" , async (req , res)=> {

    try {
    const transportDb = await client.db('transport');
    const usersCollection = await transportDb.collection('users');
    const user1 = await usersCollection.findOne({name : 'bharath'});

    res.send({ok : true , data : user1});

    }
    catch(e) {
        console.log(e.message);
        res.send({ok : false , error_msg : "error occured in db"});
    }
})

app.get("/:id/" , (req , res)=> {
    const {id} = req.params;
    console.log(id)

    res.status(200).json({givenId : id})
})


/*
app.get("/user/:userId/" , async (req , res)=> {
    const {userId} = req.params;
    const userQuery = `select * from customersall where customer_id = ?`;
    connection.query(userQuery , [userId] , (err , results)=> {
        if(err) {
            res.status(401).send({ok : false , error_msg : "db error"});
        }
        console.log(results);
        if(results.length === 0) {
            res.status(400).send({ok : false , error_msg : "no user found"});
        }
        else {
            res.status(200).json({ok : true , data : results[0]});
        }
    })
})  */

app.get("/users/:userId/" ,async (req , res)=> {
    const {userId} = req.params;
    try {
        const result  = await pool.query(`select * from customersall where customer_id = ?` , [userId]);
        console.log(result);
        console.log(result[0]);
        res.send({ok : true , data : result[0]});
    }
    catch(e) {
        console.log(e.message);
        res.send({ok : false , errorMsg : "server error"});
    }
    
})


app.post("/scrape/" , async (req , res)=> {
    // console.log(req.body);
    const {prompt} = req.body;
    // console.log(prompt)
    try {
        const resultsList = await startScraping(prompt);
        if(resultsList.ok) {
            console.log("retrieved successfully");
        console.log(resultsList.scrapedDataList)
        console.log("in server");
        res.status(200).json({ok : true , searchResults : resultsList.scrapedDataList})
        }
        else {
            res.status(400).json({ok : false , errorMsg : "server side , document not loaded , Please try again"})
        }
    }
    catch(e) {
        console.log("document not loaded");
        res.status(400).json({ok : false , errorMsg : "server side , document not loaded , Please try again"});
    }
})




app.listen(port , ()=> {
    console.log(`server started at http://localhost:${port}`);
})