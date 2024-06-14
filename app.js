const express = require("express");

const app = express();

const port = process.env.port || 5000;

app.use(express.json());

app.get("/" , (req , res)=> {
    res.send("Hello from server");
})

app.post("/register/" , (req , res)=> {
    const {email} = req.body;
    res.status(200).send({sentEmail : email})
})


app.listen(port , ()=> {
    console.log(`Server started at http://localhost:${port}`);
})

