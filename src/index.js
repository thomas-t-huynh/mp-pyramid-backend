const express = require('express');
require('./db/mongoose');


const app = express();
const port = process.env.PORT

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods','GET, POST, PUT, PATCH, DELETE' );
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
app.use(express.json())



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
