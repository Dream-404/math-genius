import React, { useState, useEffect } from "react";
import "./app.css";
export default function App() {
  // declare the state that going to use in this react app
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState(null);
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(6);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [answer, setAnswer] = useState(null);
  const [highestScore, setHighestScore] = useState(0);

  // initialize math problem by calling generateProblem() function with no dependency
  useEffect(() => {
    generateProblem();
  }, []);

  // call generateProblem() function when answer is change by checking condition
  useEffect(() => {
    if (answer === correctAnswer || answer === wrongAnswer) {
      generateProblem();
    } else {
      setCounter((pervCounter) => pervCounter - 3);
    }
  }, [answer]);

  // useEffect to check for the higheset score for the user
  // and compare the score and hightest score by using local storage section
  useEffect(() => {
    const storedHighestScore = parseInt(localStorage.getItem("score"));
    // localStorage.setItem("score", highestScore.toString());
    if (!isNaN(storedHighestScore)) {
      setHighestScore(storedHighestScore);
    }
    if (score > storedHighestScore) {
      setHighestScore(score);
      localStorage.setItem("score", score.toString());
    }
  }, [score]);

  // reduce the time from 6s to 0s
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);
    if (counter < 0) {
      clearInterval(timeInterval);
      // setCounter(6);
    }
    return () => {
      clearInterval(timeInterval);
    };
  }, [counter]);

  // function that generate states for the math problem
  function generateProblem() {
    const newNum1 = Math.ceil(Math.random() * 30);
    const newNum2 = Math.ceil(Math.random() * 30);
    const newOperator = Math.random() < 0.5 && newNum1 > newNum2 ? "-" : "+";
    const newCorrectAnswer = calculateAnswer(newNum1, newNum2, newOperator);
    const newWrongAnswer = newCorrectAnswer + Math.ceil(Math.random() * 6);
    const newAnswer = Math.random() < 0.5 ? newCorrectAnswer : newWrongAnswer;

    setNum1(newNum1);
    setNum2(newNum2);
    setOperator(newOperator);
    setCorrectAnswer(newCorrectAnswer);
    setWrongAnswer(newWrongAnswer);
    setAnswer(newAnswer);
  }

  // function that choose operator
  function calculateAnswer(num1, num2, operator) {
    switch (operator) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      default:
        return NaN;
    }
  }

  // callback function to check the answer and increase or decrease the score depend on the condition
  function checkAnswer(isCorrect) {
    if (isCorrect) {
      setCounter((prevCounter) => prevCounter + 3);
      generateProblem();
      setScore((prevScore) => prevScore + 1);
    } else {
      setCounter((prevCounter) => prevCounter - 3);
    }
  }

  // restart function
  function restartGame() {
    setScore(0);
    generateProblem();
    setCounter(6);
  }

  // if counter equal to 0 the game is over
  if (counter < 0) {
    return (
      <div className="mainRestartApp">
        <h1>Your loose the game</h1>
        <h2>Let try the challanges again!</h2>
        <button className="btn" onClick={restartGame}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="mainApp">
      <h1 className="mainHeading">Let's explore your Mind</h1>
      <h1>Your highest score : {highestScore}</h1>
      <h2 className="counter" id="counter">
        Time : {counter}s
      </h2>
      <p className="problem" id="problem">
        {num1} {operator} {num2} = {answer}
      </p>
      <h3 className="score" id="scores">
        Current Score : {score}
      </h3>
      <button
        className="correctBtn btn"
        onClick={() => checkAnswer(answer === correctAnswer)}
        id="correct"
      >
        Correct
      </button>
      <button
        className="wrongBtn btn"
        onClick={() => checkAnswer(answer !== correctAnswer)}
        id="wrong"
      >
        Wrong
      </button>
    </div>
  );
}
