const mysql = require("mysql2");
const dotenv = require("dotenv");
dotenv.config();

// console.log(process.env.DB_HOST);
// console.log(process.env.DB_USER)
// console.log(process.env.DB_PASS)
// console.log(process.env.DB_NAME);

const connectToDb = ()=> {
    pool = mysql.createPool({
        host : process.env.DB_HOST,
        user : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME,
        waitForConnections : true,
        connectionLimit : 10,
        queueLimit : 0
    })
    
    pool.getConnection((err)=> {
    if(err) {
        console.log("an error occured in pool connection");
    }
    else {
        console.log("successfully connected to pool connection");
    }
    })

    // console.log("&&&&&&&&&&&&");
    // console.log(pool);
    // console.log("%%%%%%%%%%%%%%%%");
    // console.log(pool.promise);
    // console.log("!!!!!!!!!!!!!!!!!!!!!!!!!");

    return pool.promise();
}
 




/*

const buildConnectionWithDb = ()=> {
    let connection;
    //const db_host = process.env.DB_HOST;
    //const db_user = process.env.DB_USER;
    //const db_password = process.env.DB_PASS;
    //const db_name = process.env.DB_NAME;
    // console.log(db_host);
    // console.log(db_user);
    // console.log(db_password);
    // console.log(db_name);
    connection = mysql.createConnection({
        host : "localhost",
        user : "root",
        password : "2002@gansaiesh",
        database : "ecommerce"
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


*/


// module.exports = {buildConnectionWithDb};

module.exports = {connectToDb}
