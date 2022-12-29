const express = require ("express");
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config();
const { query } = require('express');

// require for json web token
// const jwt = require('jsonwebtoken');

// middleware  
app.use(cors())
app.use(express.json())


app.get('/', (req,res) => {
    res.send('Virtual meet Server running ')
})




// Mongodb part start here 
// Vartual_Meet:Vartual_meet
//pas:DQGilKbuqEYowz7g

const uri = `mongodb+srv://vartualMeet:p0KvICONhWjeIve9@cluster0.rhjlmgh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri)

async function run() {
  try {
    // all collection of database 
    const users = client.db('vartualMeet').collection('users');
    // const users = client.db('vartualMeet').collection('users')
     
 
    app.get('/user', async (req,res)=> {
        const query = {} ;
        const data = await users.find(query).toArray();
        res.send(data)
    })
   
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.listen(port, ()=> {
    console.log(`Virtual meet server on port ${port}`)
})
