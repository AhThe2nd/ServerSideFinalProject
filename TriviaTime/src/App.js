import './App.css';
import React, { useEffect, useState } from 'react';
import { Routes, Route } from "react-router";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import 'bootstrap/dist/css/bootstrap.min.css';

// Login imports
import { UserProvider } from "./contexts/user.context";
import Admin from "./pages/Admin.page";
import Login from "./pages/Login.page";
import PrivateRoute from "./pages/PrivateRoute.page";


// COMPONENTS///////////////////////////
// Header Container
function HeaderContainer(){
  return(
    <>
      <Container>
        <h1 style={{fontSize: 80}}>Trivia Time</h1><br/><br/>
        <h3 style={{fontSize: 40}}>{getCurrentDate()}</h3>
      </Container>
    </>
    
  )
}

// Stats Container
function Stats(){
  let average = (localStorage.getItem("allTimePoints") / localStorage.getItem("gamesPlayed")).toFixed(1);

  return(
    <>
      <h2>All-Time Statistics</h2><br/><br/>
      <h3>Games Played: {localStorage.getItem("gamesPlayed")}</h3>
      <h3>Average Score: {average}</h3>
      <h3>Perfect Scores: {localStorage.getItem("perfectGames")}</h3>
    </>
  )
}

// Back to home button
function BackToGameButton(){
  return(
    <>
      <br/><br/>
      <a href="/">
        <Button size="lg">Back</Button>
      </a>
    </>
    
  )
}

// PAGES////////////////////////////////////////////////////

// This function updates several values every time the page is re-rendered.
function useUpdateQuestions(props){
  const [questions, setQuestions] = useState(props.todays_questions.questions[sessionStorage.getItem("questionNumber")]);

  return () => {
    // Increment question number
    sessionStorage.setItem("questionNumber", parseInt(sessionStorage.getItem("questionNumber")) + 1);

    // Increment number of questions answered
    sessionStorage.setItem("questionsAnswered", parseInt(sessionStorage.getItem("questionsAnswered")) + 1);
    setQuestions(questions => props.todays_questions.questions[parseInt(sessionStorage.getItem("questionNumber"))]);

    // Empty out response message
    document.querySelector("#answer").innerHTML="";
  }
}

// Show Question Page
function ShowQuestionsPage(props){
  document.body.style = 'background: #C6D7FF;';

  const updateQuestions = useUpdateQuestions(props);
  
  // Reset some variables
  var questionText = "";
  var answers = [];
  var answerText;
  var successMessage = "";

  // Check if we need to go to results page
  if (parseInt(sessionStorage.getItem("questionsAnswered")) === 5){
    
    // Set flag to show game results
    var showResults = true;
    
    // Increment number of games played
    localStorage.setItem("gamesPlayed", parseInt(localStorage.getItem("gamesPlayed")) + 1);

    // Record the last time the player completed a game
    localStorage.setItem("lastGameDate", getCurrentDate())

    // Add score to all time points
    localStorage.setItem("allTimePoints", parseInt(localStorage.getItem("allTimePoints")) + parseInt(sessionStorage.getItem("score")));

    // Record a perfect game
    if (sessionStorage.getItem("score") === "5"){
      localStorage.setItem("perfectGames", parseInt(localStorage.getItem("perfectGames")) + 1);
    }

    // Disable the player from playing again today
    localStorage.setItem("canPlay", false);

  }
  else{
    
    // Set boolean for being allowed to select an answer
    var canPickAnswer = true;

    // Get current question based on sessionStorage value
    const currentQuestion = parseInt(sessionStorage.getItem("questionNumber"));

    // Extract question text
    questionText = props.todays_questions.questions[currentQuestion].question;

    // Extract answer text
    answerText = props.todays_questions.questions[currentQuestion].answer;

    // Extract all answers into an array
    answers = props.todays_questions.questions[currentQuestion].incorrect;
    answers.push(answerText);

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

    // Set text depending on score
    const score = sessionStorage.getItem("score");
    const resultText = setResultText(score);

    return(
      <>
        <Results/><br/><br/>
        <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
          <Row>
            <Col>
            <h2>{resultText}</h2>
            <a href="/stats"><br/><br/><br/><br/>
              <Button size="lg">Show All-time Stats</Button>
            </a>
            </Col>
          </Row>
        </Container>
        
      </>
    )
  }
  else{

  // Show next question if not end of quiz
  return(
    <>
      <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
        <Row>
          <Col>
            <h1 style={{fontSize: 80}}>Trivia Time</h1>
            <h3 style={{fontSize: 40}}>{getCurrentDate()}</h3><br/><br/>
            <Container style={
                        {
                        borderRadius: 25,
                        border: '5px solid rgba(0, 0, 0)',
                        padding: 20,
                        }}>
              <h2 >Question #{parseInt(sessionStorage.getItem("questionNumber")) + 1}</h2>
              <h3>{questionText}</h3>
            </Container><br/><br/>
            
          </Col>
        </Row>
        
      </Container>
      
      <Container className="d-flex align-items-center justify-content-center text-center not-found-container" onClick={(e) => 

        // This function contains all the logic for clicking or selecting an answer
        {
          var yourAnswer = e.target.value;

          if (yourAnswer === answerText & canPickAnswer === true){
          
          // Increment score
          sessionStorage.setItem("score", parseInt(sessionStorage.getItem("score")) + 1);

          successMessage = "CORRECT!"
          
        }
        else{
          successMessage = "WRONG!" + "\n\n" + "Correct answer: " + answerText;
        }
      
        // Change boolean so a new answer can't be submitted
        canPickAnswer = false;
        document.querySelector("#answer").innerHTML = successMessage;

        }}>
          <Row>
            <Col className="d-grid gap-2">
              <Button size="lg" value={answerA}>{answerA}</Button>
              <Button size="lg" value={answerB}>{answerB}</Button>
              <Button size="lg" value={answerC}>{answerC}</Button>
              <Button size="lg" value={answerD}>{answerD}</Button><br></br>
            </Col>
          </Row>
          
      </Container>

      <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
        <Row>
          <Col>
            <h2 id="answer"></h2><br></br>
          </Col>
        </Row>
      </Container>

      <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
        <Row>
          <Col>
            <Button size="lg" onClick={updateQuestions}>Next</Button><br></br>
          </Col>
        </Row>
      </Container>
    </>
  )
  }
}

// Home page
function Home(){
  document.body.style = 'background: #C6D7FF;';

  // Conditionally return components based on canPlay value
  if (localStorage.getItem("canPlay") === "true"){
    return(
      <>
        <Container 
        className="d-flex align-items-center justify-content-center text-center not-found-container">
          <Row>
            <Col>
            <HeaderContainer/><br/><br/><br/>
            <h3>Welcome to Trivia Time! </h3><br/><br/><br/>
            <a href="/quiz">
              <Button size="lg">Play Game!</Button>
            </a><br/><br/>
            <a href="/stats">
              <Button size="lg">Show stats</Button>
            </a><br></br>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
  else{
    return(
      <>
        <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
          <Row>
            <Col>
              <HeaderContainer/><br/><br/><br/>
              <h3>Come back tomorrow to play again! </h3><br/><br/><br/>
              <a href="/stats">
              <Button size="lg">Show Stats</Button>
              </a>
            </Col>
          </Row>
        </Container>
      </>
    )
  }
}

// Results page
function Results(){
  return(
    <>
      <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
        <Row>
          <Col>
            <h1 style={{fontSize: 80}}>Results</h1>
            <h2>Today's Score: {sessionStorage.getItem("score")}/5</h2>
          </Col>
        </Row>
      </Container>
      
    </>
  )
}

// Stats Page
function ShowStatsPage(){
  document.body.style = 'background: #C6D7FF;';
  return(
    <>
      <Container className="d-flex align-items-center justify-content-center text-center not-found-container">
        <Row>
          <Col>
            <HeaderContainer/><br/><br/><br/><br/>
              <Container style={
                        {
                        borderRadius: 25,
                        border: '5px solid rgba(0, 0, 0)',
                        padding: 20,
                        }}>
                <Stats/><br/><br/>
              </Container>
            <BackToGameButton/>
          </Col>
        </Row>
      </Container>
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
  else if (localStorage.getItem("canPlay") === "false" && getCurrentDate() !== localStorage.getItem("lastGameDate")){
    localStorage.setItem("canPlay", true);
  }

  return(
    
      <UserProvider>
          <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/quiz/*" element={<ShowQuestionsPage todays_questions={questions}/>}/>
            <Route path="/results" element={<Results/>}/>
            <Route path="/stats" element={<ShowStatsPage/>}/>
            <Route exact path="/login" element={<Login />} />

            <Route element={<PrivateRoute />}>
              <Route exact path="/admin" element={<Admin />} />
            </Route>
          </Routes>
        </UserProvider>
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

// This function simply shuffles an array
function shuffleArray(array) {
  let index = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (index !== 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * index);
    index--;

    // And swap it with the current element.
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
  }
  return array;
}

// This function displays different text on the results screen depending on how the player did.
function setResultText(score){
  let text;
  switch(parseInt(score)) {
    case 0:
      text = "Oof! Zero points...";
      break;
    case 1:
      text = "Well, 1 point is better than nothing!";
      break;
    case 2:
      text = "2 points, you knew something!";
      break;
    case 3:
      text = "Alright, alright, 3 points, not bad!";
      break;
    case 4:
      text = "Well done with 4 points! I gotta make these questions harder.";
      break;
    case 5:
      text = "A perfect score! Big, wrinkly brain over here!";
      break;
    default:
      text = "Something has either gone horribly wrong or you're messing about with the session storage values."
  }
  return text;
}
