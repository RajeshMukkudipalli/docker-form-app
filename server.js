const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

// 1. Connection Logic - Using the service name 'database' from docker-compose
// Change this line in server.js
const mongoURI = process.env.MONGO_URI || 'mongodb://database:27017/my_db';

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

// 2. Define a Schema (How the data looks)
const userSchema = new mongoose.Schema({
    username: String,
    date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

// 3. Routes
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

app.post('/submit', async (req, res) => {
    try {
        const newUser = new User({ username: req.body.username });
        await newUser.save();
        res.send('Data Saved to MongoDB! <a href="/">Go Back</a>');
    } catch (err) {
        res.status(500).send('Error saving data');
    }
});

app.listen(3000, '0.0.0.0', () => console.log('Server running on port 3000'));