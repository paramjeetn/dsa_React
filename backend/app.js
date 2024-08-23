// app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// Routes
const levelsRouter = require('./routes/levels');
// Uncomment the next line if you decide to use a separate questions route
// const questionsRouter = require('./routes/questions');

app.use('/api/levels', levelsRouter);
// Uncomment the next line if you decide to use a separate questions route
// app.use('/api/questions', questionsRouter);

app.listen(5000, () => console.log('Server Started on port 5000'));
