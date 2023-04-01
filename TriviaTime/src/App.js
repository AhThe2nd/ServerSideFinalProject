import './App.css';
import {Link} from "react-router-dom";
import React, { useEffect, useRef, useState } from 'react';
import {Routes, Route} from "react-router";
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import FormSelect from 'react-bootstrap/FormSelect'
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

// Question Container
function QuestionsContainer(props){
  return(
    <Container>
      <h2>Question Number goes here</h2>
      <h3>Question text goes here</h3>
    </Container>
  )
}

// Answers Container
function AnswersContainer(){
  return(
    <Container>
      <Button>Answer 1</Button><br></br>
      <Button>Answer 2</Button><br></br>
      <Button>Answer 3</Button><br></br>
      <Button>Answer 4</Button><br></br>
    </Container>
  )
}

// Next Question Button Container
function NextQuestion(){
  return(
    <Container>
      <Button>Next Question</Button><br></br>
    </Container>
  )
}

// Show Stats Button Container
function ShowStatsButton(){
  return(
    <Container>
      <a href="/stats">
        <Button>Show stats</Button>
      </a>
    </Container>
  )
}

// Stats Container
function Stats(){
  return(
    <>
      <h2>All-Time Statistics</h2>
      <h3>Games Played: </h3>
      <h3>Average Score: </h3>
      <h3>Perfect Scores: </h3>
      <h3>Lowest Score: </h3>
    </>
  )
}

function BackToGameButton(){
  return(
    <a href="/">
      <Button>Back to game</Button>
    </a>
  )
}

// PAGES////////////////////////////////////////////////////
// Show Question Page
function ShowQuestionsPage(props){
  const questionText = props.todays_questions.questions[0].question;
  const correctAnswer = props.todays_questions.questions[0].answer;
  var answers = props.todays_questions.questions[0].incorrect;

  // Combine all answers and assign them to a random button
  answers.push(correctAnswer);
  

  // Shuffle the array
  var allAnswersShuffled = shuffleArray(answers);
  console.log(allAnswersShuffled);

  // Handle question number by creating a question number localstorage variable.
  // If it doesn't exist it = 1
  // Every time next question is hit it increments
  // Question is based off this number
  // When the results page is shown, set it to 0
  // Set can play to false
  // Set can play to true when it hits questions route
  // If can play == false show countdown page
  // Set it back to 1 when can play = true

  // For Debug



  return(
    <>
      <Container>
        <h1>Trivia Time</h1>
        <h3>{getCurrentDate()}</h3>
      </Container>

      
      <Container>
        <h2>Question #{localStorage.getItem("questionNumber")}</h2>
        <h3>{props.todays_questions.questions[0].question}</h3>
      </Container>

      
      <Container>
        <Button id="A">{answers.pop()}</Button><br></br>
        <Button id="B">{answers.pop()}</Button><br></br>
        <Button id="C">{answers.pop()}</Button><br></br>
        <Button id="D">{answers.pop()}</Button><br></br>
      </Container>

      
      <Container>
        <Button>Next Question</Button><br></br>
      </Container>

      
      <Container>
        <a href="/stats">
          <Button>Show stats</Button>
        </a>
      </Container>
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
    return <h3>Loading questions...</h3>
  }

  if (localStorage.getItem("questionNumber") == null || localStorage.getItem("questionNumber") == 6){
    localStorage.setItem("questionNumber", 1);
  }

  return(
    <>
      <Routes>
        <Route path="/" element={<ShowQuestionsPage todays_questions={questions}/>}/>
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
