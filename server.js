const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const client = require('prom-client'); // Senior DevOps: Monitoring library

const app = express();
const port = 3000;

// --- PROMETHEUS METRICS SETUP ---
const register = new client.Registry();
client.collectDefaultMetrics({ register });

// Custom metric to track user submissions
const userCounter = new client.Counter({
  name: 'app_user_submissions_total',
  help: 'Total number of users submitted through the form'
});
register.registerMetric(userCounter);

// Endpoint for Prometheus to scrape
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});
// --------------------------------

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection using environment variable
// DevOps Note: Hostname 'database' must match the service name in docker-compose.yaml
const mongoUri = process.env.MONGO_URI || 'mongodb://database:27017/my_db';

// FIX: Removed 'useNewUrlParser' and 'useUnifiedTopology' as they are no longer supported 
// in newer Mongoose versions and were causing your crash
mongoose.connect(mongoUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  name: String,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit', async (req, res) => {
  try {
    const newUser = new User({ name: req.body.username });
    await newUser.save();
    
    // Increment the Prometheus counter on every successful save
    userCounter.inc(); 
    
    res.send('User saved successfully!');
  } catch (error) {
    // This block triggers the "Error saving data" message you see in the browser
    console.error("Submission Error:", error);
    res.status(500).send('Error saving data');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});