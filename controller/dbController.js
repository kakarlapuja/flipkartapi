let mongo = require('mongodb');
// import the client
let {MongoClient} = require('mongodb');
let mongoUrl ="mongodb+srv://kpuja:puja123@cluster0.gw5pieu.mongodb.net/?retryWrites=true&w=majority";
// connect with the client
let client = new MongoClient(mongoUrl)


async function dbConnect(){
    await client.connect()
}

let db = client.db('flipkart');

// generic funtion
async function getData(colName,query){
 let output = [];
 try {
    const cursor = db.collection(colName).find(query);
    for await(const data of cursor){
        output.push(data)
    }
    cursor.closed
   
 }
 catch (err){
    output.push({"Error":"Error in getData"})
 }
 return output;
}

async function postData(colName,data){
    let output ;
    try{
       output = await db.collection(colName).insertOne(data)
        output ={"response":"Order Placed"}`np,`
    }
    catch(err){
        output = {"response":"Error in postData"};
    }
    return output;

}

module.exports = { 
       dbConnect,
       getData,
       postData
}