const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.urlencoded({ extended: true }));

// Uses the environment variable from docker-compose, or defaults to userDB
const mongoURI = process.env.MONGO_URI || 'mongodb://database:27017/userDB';

mongoose.connect(mongoURI)
    .then(() => console.log('Connected to MongoDB successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const userSchema = new mongoose.Schema({
    username: String,
    date: { type: Date, default: Date.now }
});
const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));

// Route to handle form submissions
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