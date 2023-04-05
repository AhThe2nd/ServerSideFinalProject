import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import {Router, Routes, Route, Navigate} from "react-router";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

// Test comment
// COMPONENTS///////////////////////////
// Header Container
function HeaderContainer(){
  return(
    <Container>
      <h1>Trivia Time</h1>
      <h3>{getCurrentDate()}</h3>
    </Container>
  )
}

// Stats Container
function Stats(){
  let average = localStorage.getItem("allTimePoints") / localStorage.getItem("gamesPlayed");

  return(
    <>
      <h2>All-Time Statistics</h2>
      <h3>Games Played: {localStorage.getItem("gamesPlayed")}</h3>
      <h3>Average Score: {average}</h3>
      <h3>Perfect Scores: {localStorage.getItem("perfectGames")}</h3>
      <h3>Lowest Score: {localStorage.getItem("lowestScore")}</h3>
    </>
  )
}

function BackToGameButton(){
  return(
    <a href="/">
      <Button>Back</Button>
    </a>
  )
}

// PAGES////////////////////////////////////////////////////
// Show Question Page
// Hook to update questions
function useUpdateQuestions(props){
  const [questions, setQuestions] = useState(props.todays_questions.questions[sessionStorage.getItem("questionNumber")]);

  return () => {
    // Increment question number
    sessionStorage.setItem("questionNumber", parseInt(sessionStorage.getItem("questionNumber")) + 1);

    // Increment number of questions answered
    sessionStorage.setItem("questionsAnswered", parseInt(sessionStorage.getItem("questionsAnswered")) + 1);
    setQuestions(questions => props.todays_questions.questions[parseInt(sessionStorage.getItem("questionNumber"))]);
  }
}

function ShowQuestionsPage(props){
  const updateQuestions = useUpdateQuestions(props);
  var questionText = "";
  var answers = [];

  // Check if we need to go to results page
  if (parseInt(sessionStorage.getItem("questionsAnswered")) == 5){
    // Set flag to show game results
    var showResults = true;
    
    // Increment number of games played
    localStorage.setItem("gamesPlayed", parseInt(localStorage.getItem("gamesPlayed")) + 1);

    // Record the last time the player completed a game
    localStorage.setItem("lastGameDate", getCurrentDate())

    // Disable the player from playing again today
    localStorage.setItem("canPlay", false);

  }
  else{
    // Get current question based on sessionStorage value
    const currentQuestion = parseInt(sessionStorage.getItem("questionNumber"));

    // Extract question text
    questionText = props.todays_questions.questions[currentQuestion].question;

    // Extract all answers into an array and shuffle
    answers = props.todays_questions.questions[currentQuestion].incorrect;
    const answer = props.todays_questions.questions[currentQuestion].answer;
    answers.push(answer);

    // Shuffle the array
    answers = shuffleArray(answers);

    // Set answers
    var answerA = answers.pop()
    var answerB = answers.pop()
    var answerC = answers.pop()
    var answerD = answers.pop()
  }

  // Conditionally return the components we want to render

  // Show results if end of quiz
  if (showResults){
    return(
      <Results/>
    )
  }
  else{

  // Show next question if not end of quiz
  return(
    <>
      <Container>
        <h1>Trivia Time</h1>
        <h3>{getCurrentDate()}</h3>
      </Container>

      <Container>
        <h2>Question #{parseInt(sessionStorage.getItem("questionNumber")) + 1}</h2>
        <h3>{questionText}</h3>
      </Container>
      
      <Container onClick={(e) => console.log(e.target.value) }>
          <Button value={answerA}>{answerA}</Button><br></br>
          <Button value={answerB}>{answerB}</Button><br></br>
          <Button value={answerC}>{answerC}</Button><br></br>
          <Button value={answerD}>{answerD}</Button><br></br>
      </Container>

      <Container>
        <Button onClick={updateQuestions}>Next</Button><br></br>
      </Container>
    </>
  )
  }
}

// Home page
function Home(){
  // Conditionally return components based on canPlay value (which is stored as a string now)
  if (localStorage.getItem("canPlay") === "true"){
    return(
      <>
        <HeaderContainer/>
        <h3>Welcome to trivia time! </h3>
        <a href="/quiz">
          <Button>Play Game!</Button>
        </a>
  
        <Container>
          <a href="/stats">
            <Button>Show stats</Button>
          </a>
        </Container>
      </>
    )
  }
  else{
    return(
      <>
        <HeaderContainer/>
        <h3>Come back tomorrow to play again! </h3>
        <Container>
          <a href="/stats">
            <Button>Show stats</Button>
          </a>
        </Container>
      </>
    )
  }
}

// Results page
function Results(){
  return(
    <>
      <h1>This is where the results will go!</h1>
      <a href="/stats">
          <Button>Show stats</Button>
      </a>
    </>
  )
}

// Stats Page
function ShowStatsPage(){
  return(
    <>
      <HeaderContainer/>
      <Stats/>
      <BackToGameButton/>
    </>
  )
}

// App Routes////////////////////////////////////////////////////
// App
export default function App(){

  let [questions, setQuestions] = useState(null);

  useEffect(() => {
    // Load movie data from database
    fetch('/questions')
    .then(response => response.json())
    .then(setQuestions)
    .catch(e => console.log(e.message))
  }, [])

  if (questions == null){
    return <h3>Loading...</h3>
  }

  // SETTING VARIABLES ON LOAD
  // Create variable to track question number in session storage
  sessionStorage.setItem("questionNumber", 0);
  
  // Create variable to track score of current game
  sessionStorage.setItem("score", 0);

  // Create variable to track number of submitted questions
  sessionStorage.setItem("questionsAnswered", 0);

  // Create variable to track number of games played if it doesn't exist
  if (localStorage.getItem("gamesPlayed") == null){
    localStorage.setItem("gamesPlayed", 0);
  }

  // Create variable to track all time total points
  if (localStorage.getItem("allTimePoints") == null){
    localStorage.setItem("allTimePoints", 0);
  }

  // Create variable to store perfect games
  if (localStorage.getItem("perfectGames") == null){
    localStorage.setItem("perfectGames", 0);
  }

  // Create a variable to store the lowest score
  if (localStorage.getItem("lowestScore") == null){
    localStorage.setItem("lowestScore", 0);
  }

  // Create a variable that store the last day that the user completed a game
  if (localStorage.getItem("lastGameDate") == null){
    localStorage.setItem("lastGameDate", 0);
  }

  // Create a variable in local storage to determine if the game can be played or not
  // Condition 1: First time starting the app (also covers not having completed a game)
  if (localStorage.getItem("canPlay") == null){
    localStorage.setItem("canPlay", true);
  }

  // Condition 2: User has completed a previous game
  else if (localStorage.getItem("canPlay") == "false" && getCurrentDate() != localStorage.getItem("lastGameDate")){
    localStorage.setItem("canPlay", true);
  }

  return(
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/quiz/*" element={<ShowQuestionsPage todays_questions={questions}/>}/>
        <Route path="/results" element={<Results/>}/>
        <Route path="/stats" element={<ShowStatsPage/>}/>
      </Routes>
    </>
      
  );
}


// Standalone functions
function getCurrentDate(){
  let currentDate = new Date();
  let year = currentDate.getFullYear();
  let month = currentDate.getMonth() + 1; //  Months are 0 indexed because somebody, for some reason, thought that was a good idea.
  let day = currentDate.getDate();
  let dateString = `${year}-${month}-${day}`;
  return dateString;
}


function shuffleArray(array) {
  let index = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (index != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * index);
    index--;

    // And swap it with the current element.
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}
