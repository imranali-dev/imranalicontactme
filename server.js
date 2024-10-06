require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToMongoDB } = require('./db');
const formRoutes = require('./routes/userRoutes');
const errorHandler = require('./errorHandling');
const logUserVisit = require('./middleware/logUserVisit');
const ContectMe = require("./routes")
const app = express();
const port = process.env.PORT || 8088;

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use(cors({
  origin: ['http://localhost:3000', 'https://imranali.vercel.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

connectToMongoDB().catch(err => {
  console.error('MongoDB connection error during startup:', err);
  process.exit(1);
});

// Middleware to log user visits
app.use(logUserVisit); // This now works as expected

app.use('/notes', formRoutes);
app.use('/', ContectMe);

app.get("/", (req, res) => {
  res.status(200).send('Hello World');
});

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
