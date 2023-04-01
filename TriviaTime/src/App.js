import './App.css';
import React, { useEffect, useRef, useState } from 'react';
import {Routes, Route} from "react-router";
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
    <a href="/quiz">
      <Button>Back to game</Button>
    </a>
  )
}

// PAGES////////////////////////////////////////////////////
// Show Question Page
// hook to update questions
function useUpdateQuestions(props){
  const [questions, setQuestions] = useState(props.todays_questions.questions[sessionStorage.getItem("questionNumber")]);
  console.log(questions);

  return () => {

    if (parseInt(sessionStorage.getItem("questionNumber")) == 4){
      console.log("Max questions reached, redirect to results page");
    }
    else{
      sessionStorage.setItem("questionNumber", parseInt(sessionStorage.getItem("questionNumber")) + 1);
      setQuestions(questions => props.todays_questions.questions[parseInt(sessionStorage.getItem("questionNumber"))]);
    }
  }
}

function ShowQuestionsPage(props){

  // Get current question based on sessionStorage value
  const currentQuestion = parseInt(sessionStorage.getItem("questionNumber"));
  const updateQuestions = useUpdateQuestions(props);

  // Extract question text
  let questionText = props.todays_questions.questions[currentQuestion].question;

  // Extract all answers into an array and shuffle
  let answers = props.todays_questions.questions[currentQuestion].incorrect;
  const answer = props.todays_questions.questions[currentQuestion].answer;
  answers.push(answer);

  // Shuffle the array
  answers = shuffleArray(answers);
  
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


      
      <Container>
          <Button id="A">{answers.pop()}</Button><br></br>
          <Button id="B">{answers.pop()}</Button><br></br>
          <Button id="C">{answers.pop()}</Button><br></br>
          <Button id="D">{answers.pop()}</Button><br></br>
      </Container>

      <Container>
        <Button onClick={updateQuestions}>Next</Button><br></br>
      </Container>
            
      <Container>
        <a href="/stats">
          <Button>Show stats</Button>
        </a>
      </Container>
    </>
  )
}

// Home page
function Home(){
  return(
    <>
      <HeaderContainer/>
      <h3>Time left until next round OR Welcome to trivia time! </h3>
      <a href="/quiz">
        <Button>Play Game!</Button>
      </a>
    </>
  )
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

  if (sessionStorage.getItem("questionNumber") == null){
    sessionStorage.setItem("questionNumber", 0);
  }

  return(
    <>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/quiz" element={<ShowQuestionsPage todays_questions={questions}/>}/>
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
