const mysql = require("mysql2");
require("dotenv").config();

console.log(process.env.DB_HOST);
console.log(process.env.DB_USER)
console.log(process.env.DB_PASS)
console.log(process.env.DB_PASS);


const buildConnectionWithDb = ()=> {
    let connection;
    connection = mysql.createConnection({
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    })


    connection.connect((err)=> {
        if(err) {
            console.log("error in connecting to database");
        }
        else {
            console.log("successfully connection to database");
        }
        
    })


    return connection;

}


module.exports = {buildConnectionWithDb};
