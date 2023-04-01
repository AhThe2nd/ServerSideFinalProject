import express from 'express';
import { MongoClient } from 'mongodb';

const app = express();
const port = 8000;
const URL = "mongodb+srv://andrewthowell:6v839A1VWbQTQN76@andrewscluster.0inpxj7.mongodb.net/test";

app.use(express.json());

app.get('/message', (req, res) => {
    console.log("Hello from back end!")
    res.send({ express: 'Hello From Express' });
});

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