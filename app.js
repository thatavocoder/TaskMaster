const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const { MONGO_URI } = require('./config/dev');

const PORT = process.env.PORT || 5000;

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on('connected', () => {
    console.log('connected to mongo instance');
})
mongoose.connection.on('error', (error) => {
    console.log(`error connecting to mongo ${error}`);
})



require('./models/user');
require('./models/task');

app.use(express.json());
app.use(cors());

app.use(require('./routes/auth'));
app.use(require('./routes/task'));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    const path = require("path");
    app.get("*", (request, response) => {
        response.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})