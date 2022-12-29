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
     

    // ===============users collection and DBMS ==================//
    // get all users
    app.get('/user', async (req,res)=> {
        const query = {} ;
        const data = await users.find(query).toArray();
        res.send(data)
    })

    //  save user  info in  database 
    app.post('/usersData', async(req,res)=> {
        const reqBody = req.body;
        const saveUserData = await users.insertOne(reqBody);
        res.send(saveUserData);
    })

    // update user information 
    app.post('/updateUser/:email', async(req,res) => {
        const reqBody = req.body ;
        const email = req.params.email;
        //  find image url from client side req.
        const updateImg  =  reqBody.userImg ;
        const filter = {email:email}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              userImg: updateImg 
            },
          };
        const result = await users.updateOne(filter,updateDoc,options)
        console.log(result,'result') 
        console.log(reqBody)
        console.log(updateImg,'update')
    })
   
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.listen(port, ()=> {
    console.log(`Virtual meet server on port ${port}`)
})
