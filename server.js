const { decodeBase64 } = require('bcryptjs');
const express = require('express');
const cors = require('cors');
const app = express();
const db = require('./config/db');
const user = require('./routes/user');
const article = require('./routes/article');
const { urlencoded } = require('body-parser');
const fileUpload = require('express-fileupload')
var path = require('path');
app.use(express.static(path.join(__dirname, './routes/client/public/uploads')));


app.use(cors());
app.use(fileUpload());
app.use(express.json());
app.use(urlencoded({
    extended: true
}));

db.authenticate()
.then(()=>console.log("Database Connected"))
.catch((err)=>console.log("Error: "+err));

app.use("/Users", user);
app.use("/Articles", article);

const PORT = process.env.PORT || 5000;


app.listen(PORT, ()=> console.log(`Server running on ${PORT}`));