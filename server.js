const express = require('express');
const connectDB = require('./config/db');
const app = express();
const path = require('path');
//connnect database
connectDB();

//init middleware
app.use(express.json({ extended: false }));

const PORT = process.env.PORT || 5001;

//Define routes 
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

// serve status access in production 
if (process.env.NODE_ENV === 'production') {
    //adding static folder
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendfile(path.resolve(__dirname, 'client', 'build', 'index.html' ))
    })
}


app.listen(PORT, () => console.log(`Server Stated on port ${PORT}`));