const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)
// console.log(process.env.DB_NAME);



const buildConnectionWithDb = ()=> {
    let connection;
    const db_host = process.env.DB_HOST;
    const db_user = process.env.DB_USER;
    const db_password = process.env.DB_PASS;
    const db_name = process.env.DB_NAME;
    console.log(db_host);
    console.log(db_user);
    console.log(db_password);
    console.log(db_name);
    connection = mysql.createConnection({
        host : db_host,
        user : db_user,
        password : db_password,
        database : db_name
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
