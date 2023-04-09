import express from 'express';
import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();
const port = 8000;
const URL = process.env.MONGO_CONNECT;

app.use(express.json());

app.get('/questions', async (req, res) => {
    
    // Create client object and wait for connection
    const client = new MongoClient(URL);
    await client.connect();

    // Set database
    const db = client.db('trivia');

    // Test with current date
    const date = getCurrentDate();

    // For testing dates other than today
    // const date = '2023-4-1';


    // Pull data from db and store
    const triviaData = await db.collection('questions').findOne({date: date});
    res.json( triviaData );
});

// Empty the database
app.delete('/empty', async (req, res) => {

    // Create client object and wait for connection
    const client = new MongoClient(URL);
    await client.connect();

    // Set database
    const db = client.db('trivia');

    // Remove all data from the database
    db.collection('questions').deleteMany();
})

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});

// Standalone functions
function getCurrentDate(){
    let currentDate = new Date();
    let year = currentDate.getFullYear();
    let month = currentDate.getMonth() + 1; //  Months are 0 indexed because somebody, for some reason, thought that was a good idea.
    let day = currentDate.getDate();
    let dateString = `${year}-${month}-${day}`;
    return dateString;
  }