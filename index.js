const express = require('express');
require('dotenv').config()
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;


app.use(cors())
app.use(express.json())


//robayatfarsit
//GzxR2zqCjaFrWbWw


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}.iap8jv9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();
        const itemCollection = client.db("ItemsDB").collection("items")
        const SubCategoryCollection = client.db("ItemsDB").collection("category")

        app.get('/items', async (req, res) => {
            const cursor = itemCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/mycraft/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const result = await itemCollection.find(query).toArray();
            res.send(result)
        })

        app.get('/singlecraft/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id : new ObjectId(id)}
            const result = await itemCollection.findOne(query);
            console.log(result);
            res.send(result)
        })
        app.put('/singlecraft/:id',async(req,res)=>{
            const id = req.params.id;
            const item = req.body;
            const query = {_id : new ObjectId(id)}
            const updateItem = {
                $set : {
                    item_name : item.item_name,
                    image : item.image,
                    category : item.category,
                    processing_time : item.processing_time,
                    price : item.price,
                    rating : item.rating,
                    customization : item.customization,
                    stock_status : item.stock_status,
                    description : item.description
                }
            }
            const result = await itemCollection.updateOne(query,updateItem);
            res.send(result)
        })

        app.get('/items/:id',async(req,res)=>{
            const id = req.params.id;
            console.log(id);
            const query = {_id : new ObjectId(id)}
            const result = await itemCollection.findOne(query);
            console.log(result);
            res.send(result)
        })

        app.post('/items', async (req, res) => {
            const item = req.body;
            console.log(item);
            const result = await itemCollection.insertOne(item)
            res.send(result)
        })

        app.delete('/delete/:id',async(req,res)=>{
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await itemCollection.deleteOne(query)
            res.send(result);
        })

        app.get('/category', async (req, res) => {
            const cursor = SubCategoryCollection.find();
            const result = await cursor.toArray();
            res.send(result)
        })
        app.get('/category/:category', async (req, res) => {
            const category = req.params.category;
            const query = { category : category }
            const result = await itemCollection.find(query).toArray();
            res.send(result)
            console.log(result);
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log(`Project is Running ${port}`);
})