let express = require("express");

// rest objects
let app = express();//calling express function
let Mongo = require('mongodb');//calling mongodb

const bodyParser =require('body-parser');//calling bodyparser
const cors =require('cors')
// port
let port = process.env.PORT||5001;

let { dbConnect, getData,postData } = require('./controller/dbController');
// middle ware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));


// rest/route api
app.get('/', (req, res) => {
    res.send('welocme to flipkart app')
});

// category
app.get('/category', async (req, res) => {
    let query = {};
    let collection = "category";
    let output = await getData(collection, query);
    res.send(output)
})

// quick search
app.get('/quicksearch', async (req, res) => {
    let query = {};
    let collection = "quicksearch";
    let output = await getData(collection, query);
    res.send(output)

})
// get all product data
/*app.get('/productdata',async(req,res)=>{
         let query ={};
         let collection = "productdata";
         let output = await getData(collection,query);
         res.send(output)
})*/

//  get by catrgory id conditon base 
app.get('/productdata', async (req, res) => {
    let query = {}
    if (req.query.categoryId) {
        query = { category_id: Number(req.query.categoryId) }
    } else {
        query = {}
    }
    let collection = "productdata";
    let output = await getData(collection, query);
    res.send(output)
})


// get data of wrt to  fashionid  and category
/*app.get('/productdata', async(req,res) => {
    let query = {}
        if(req.query.categoryId){
            query = {category_id: Number(req.query.categoryId)}
        }else if(req.query.fashionId){
            query = {"subcategory.fashion_id": Number (req.query.fashionId)}
        }else{
            query = {}
        }
    
    let collection = "productdata";
    let output = await getData(collection,query);
    res.send(output)

})*/

// get cost filter
app.get('/filter/cost', async (req, res) => {

    let lcost = Number(req.query.lcost);
    let hcost = Number(req.query.hcost);
    if (lcost && hcost) {
        query = {
            $and: [{ Orginal_price: { $gt: lcost, $lt: hcost } }]
        }
    } else {
        query = {}
    }
    let collection = "productdata";
    let output = await getData(collection, query);
    res.send(output);

})
 
// get data by rating
app.get('/rating',async(req,res) => {
     let lrat =Number(req.query.lrat);
     let hrat =Number(req.query.hrat);
     if (lrat && hrat) {
        query = { $and: [{ Rating: { $gt: lrat, $lt: hrat } }]
        }
    } else {
        query = {}
    }
    let collection = "productdata";
    let output = await getData(collection, query);
    res.send(output);

})
// details of  selected products{"id":1,6,18,20,25}
app.post('/productDetails',async (req,res) => {
    if(Array.isArray(req.body.id)){
        let query = {product_id:{$in:req.body.id}};
        let collection = "productdata";
        let output = await getData(collection,query);
        res.send(output)
    }else{
        res.send('please pass data in form of array')
    }
    
})


// palcing the order
app.post('/placeOrder',async(req,res) => {
    let data = req.body;
    let collection = "orders";
    let response= await postData(collection,data);
    res.send(response);
})

// orders
app.get('/oredrs', async (req, res) => {
    let query = {};
    if(req.query.email){
        query={emqil:req.query.email}
    }else{
        query = {};
    }
    
    let collection = "orders";
    let output = await getData(collection, query);
    res.send(output)
})





// run listen
app.listen(port, (err) => {
    dbConnect();
    if (err) throw err;
    console.log(`server is runing on port ${port}`);
});