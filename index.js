const express = require ("express");
const app = express();
const port = process.env.PORT || 5000 ;

app.get('/', (req,res) => {
    res.send('Virtual meet Server running ')
})

app.listen(port, ()=> {
    console.log(`Virtual meet server on port ${port}`)
})
