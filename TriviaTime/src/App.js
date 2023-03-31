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
function QuestionsContainer(){
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
    <a href="/stats">
      <Button>Show stats</Button>
    </a>
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
function ShowQuestionsPage(){
  return(
    <>
      <HeaderContainer/>
      <QuestionsContainer/>
      <AnswersContainer/>
      <NextQuestion/>
      <ShowStatsButton/>
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

  return(
    <>
      <Routes>
        <Route path="/" element={<ShowQuestionsPage/>}/>
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

