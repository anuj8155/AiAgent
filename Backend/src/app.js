const express = require('express');
const app = express();
const cors = require('cors');
const airoutes = require('./routes/ai.routes');

app.use(cors()); // Enable CORS for all routes

app.get('/',(req, res) => {
    res.send('Hello World!')
})
app.use(express.json());
app.use('/api', airoutes);

module.exports = app; 