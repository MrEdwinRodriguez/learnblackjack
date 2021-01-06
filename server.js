const express = require('express');
const connectDB = require('./config/db');
const app = express();
//connnect database
connectDB();

const PORT = process.env.PORT || 5001;

app.get('/', (req, res) => res.send('API is running'));

//Define routes
app.use('/api/users', require('./routes/api/users'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/auth', require('./routes/api/auth'));

app.listen(PORT, () => console.log(`Server Stated on port ${PORT}`));