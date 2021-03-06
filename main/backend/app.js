const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const dnname = 'testa'
// const uri = "mmongodb+srv://root:rootroot@lurien.3ls4u.mongodb.net/lurien?retryWrites=true&w=majority";

app.use(express.static(path.join(__dirname, 'client/build')))

app.use(cookieParser());
app.use(express.json());
app.use(cors());
const uri = 'mongodb://localhost:27017/mernauth'

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true }, () => {
    console.log('successfully connected to database');
});
const userRouter = require('./routes/User');
const routerUpload = require('./routes/Photos');
app.use('/api/user', userRouter);
app.use('/api/upload',routerUpload);


app.listen(5000, () => {
    console.log('express server started');
}); 