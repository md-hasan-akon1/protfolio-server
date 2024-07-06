const express = require('express')
const {
        MongoClient,
        ServerApiVersion,
        ObjectId
} = require('mongodb');
const cors = require('cors');

const app = express()
const port = 3000
app.use(express.json());
const corsOptions = {
        origin: ['http://localhost:5000', 'http://example.com', "http://localhost:5174"],
};

app.use(cors(corsOptions));




const uri = "mongodb+srv://protfolio:protfolio@cluster0.ytnqryr.mongodb.net/?appName=Cluster0";

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
                await client.connect();

                console.log("mongodb connect ");
                // Send a ping to confirm a successful connection
                const projects = client.db("protfolio").collection("projects");
                const blogs = client.db("protfolio").collection("blogs");

                app.post("/create-blog", async (req, res) => {
                        const data = req.body
                        console.log(data);
                        const result = await blogs.insertOne(data)
                        res.send({
                                success: true,
                                message: "create Blog successfully ",
                                data: result,
                        })
                })
                app.get("/get-blogs", async (req, res) => {
                        const result = await blogs.find().toArray()
                        res.send({
                                success: true,
                                message: "get Blog successfully ",
                                data: result
                        })
                })
                app.get("/blog/:id", async (req, res) => {
                        console.log(req.params.id)
                        const id = req.params.id
                        const query = {
                                _id: new ObjectId(id)
                        }
                        const result = await blogs.findOne(query)
                        res.send({
                                success: true,
                                message: "get single Blog successfully ",
                                data: result
                        })
                })
                app.patch("/updateBlogs/:id", async (req, res) => {
                        console.log(req.params.id)
                        const data = req.body
                        const id = req.params.id
                        const query = {
                                _id: new ObjectId(id)
                        }
                        const updateDoc = {
                                $set: data.info
                        };
                        const result = await blogs.findOneAndUpdate(query, updateDoc)
                        res.send({
                                success: true,
                                message: "update Blog successfully ",
                                data: result
                        })
                })
                app.delete("/delete-Blog/:id", async (req, res) => {
        
                
                        const id = req.params.id
                        const query = {
                                _id: new ObjectId(id)
                        }
                       
                        const result = await blogs.deleteOne(query)
                        res.send({
                                success: true,
                                message: "delete Blog successfully ",
                                data: result
                        })
                })


                await client.db("admin").command({
                        ping: 1
                });
                console.log("Pinged your deployment. You successfully connected to MongoDB!");
        } finally {
                // Ensures that the client will close when you finish/error
                // await client.close();
        }
}
run().catch(console.dir);




app.get('/', (req, res) => {
        res.send('Hello World!')
})

app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
})