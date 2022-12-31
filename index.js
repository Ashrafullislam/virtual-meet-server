

const express = require ("express");
const app = express();
const cors = require('cors')
const port = process.env.PORT || 5000 ;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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




// ************************* Mongodb part start here************************** \\

const uri = `mongodb+srv://vartualMeet:p0KvICONhWjeIve9@cluster0.rhjlmgh.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// console.log(uri)

async function run() {
  try {
    // all collection of database 
    const users = client.db('vartualMeet').collection('users');
    const postData = client.db('vartualMeet').collection('postData');      
    const comment = client.db('vartualMeet').collection('comment');      
    
    // ===============users collection and DBMS ==================//
    // get all users
    app.get('/user', async (req,res)=> {
        const query = {} ;
        const data = await users.find(query).toArray();
        res.send(data)
    })

    // get user  info from db by email 
    app.get('/aboutme/:email', async(req,res)=> {
        const email = req.params.email;
        const query = {email:email};
        const aboutMeInfo  = await users.findOne(query);
        res.send(aboutMeInfo);
    })
    

    //  save user  info in  database 
    app.post('/usersData', async(req,res)=> {
        const reqBody = req.body;
        const saveUserData = await users.insertOne(reqBody);
        res.send(saveUserData);
    })

    // update user profile picture ;
    app.post('/updateUser/:email', async(req,res) => {
        const reqBody = req.body ;
        const email = req.params.email;
        //  find image url from client side req.
        const updateImg  =  reqBody.userImg ;
        const updateBanner = reqBody.userBanner;
        const filter = {email:email}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              userImg: updateImg ,
              
            },
          };
        const result = await users.updateOne(filter,updateDoc,options)
        // console.log(result,'result') 
        // console.log(reqBody)
        // console.log(updateImg,'update')
        res.send(result);


    })


    //------------ update user cover photo by post method 
       app.post('/updateUser/coverphoto/:email', async(req,res) => {
        const reqBody = req.body ;
        const email = req.params.email;
        //  find image url from client side req.
        const updateBanner = reqBody.userBanner;
        console.log(updateBanner)
        const filter = {email:email}
        const options = { upsert: true };
        const updateDoc = {
            $set: {
              userBanner: updateBanner ,
            },
          };
        const result = await users.updateOne(filter,updateDoc,options)
        res.send(result);
        console.log(result)


    })

    // =============== Post  collection and DBMS ==================//

    app.post('/postdata', async(req,res)=> {
      const reqBody = req.body ;
      const id = req.params.id ;
      console.log(reqBody,'req body')
      const post = await postData.insertOne(reqBody);
      res.send(post);
      console.log(post,'post ')
    })

   // ----------- get all post -------------//
   app.get('/postdata', async(req, res ) => {
    const query = {} ;
    const allPost = await postData.find(query).toArray();
    res.send(allPost); 
   })
   app.post('/comment', async(req,res)  => {
    const findComment = req.body ;
    const saveComment = await comment.insertOne(findComment);
    console.log(findComment);
    res.send(saveComment)

   })

  app.post('/reactions/:id', async(req,res) => {
    const reqBody = req.body ;
    const react = reqBody.total;
    console.log(react,'reeact')
    const id = req.params.id;
    const filter = {_id:ObjectId(id)}
    const options = {upsert:true}
    const updateDoc = {
      $set: {
        reactions: react ,
      },
    };
    const result = await postData.updateOne(filter,updateDoc,options)
    res.send(result)
  }) 

  //-------- get all reaction by posted id and show client site ---------//
 
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);




app.listen(port, ()=> {
    console.log(`Virtual meet server on port ${port}`)
})
