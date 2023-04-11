import express from 'express';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config()

const app = express();
const port = 8000;
const URL = process.env.MONGO_CONNECT;

app.use(express.urlencoded({ extended: false }));
app.use(express.json({ strict: false }))

// Route to pull questions from the database
app.get('/questions', async (req, res) => {
    
    // Create client object and wait for connection
    const client = new MongoClient(URL);
    await client.connect();

    // Set database
    const db = client.db('trivia');

    // Use current date as a parameter to look for the right questions
    const date = getCurrentDate();

    // Pull data from db and store
    const triviaData = await db.collection('questions').findOne({date: date});
    res.json( triviaData );
});

// Empty the database and reupload new questions from a JSON file
app.post('/upload', async (req, res) => {

    // Create client object and wait for connection
    const client = new MongoClient(URL);
    await client.connect();

    // Set database
    const db = client.db('trivia');

    // Remove all data from the database
    db.collection('questions').deleteMany();

    // Repopulate the database
    let data = req.body;

    try{
        await db.collection('questions').insertMany(data);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error");
        console.log(e);
    }
});

// Add extra questions to the database without overwriting the old ones
app.post('/append', async (req, res) => {

    // Create client object and wait for connection
    const client = new MongoClient(URL);
    await client.connect();

    // Set database
    const db = client.db('trivia');

    // Repopulate the database
    let data = req.body;

    try{
        await db.collection('questions').insertMany(data);
        res.sendStatus(200);
    } catch (e) {
        console.log("Error");
        console.log(e);
    }
});

// Set port to listen on
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Get date
function getCurrentDate(){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; //  Months are 0 indexed because somebody, for some reason, thought that was a good idea.
    let day = currentDate.getDate();
    let dateString = `${year}-${month}-${day}`;
    return dateString;
  }