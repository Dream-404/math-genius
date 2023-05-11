import React, { useState, useEffect } from "react";
import "./app.css";
export default function App() {
  // declare the state that going to use in this react app
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState(null);
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(5);
  const [correctAnswer, setCorrectAnswer] = useState(0);
  const [wrongAnswer, setWrongAnswer] = useState(0);
  const [answer, setAnswer] = useState(null);

  // initialize math problem by calling generateProblem() function with no dependency
  useEffect(() => {
    generateProblem();
  }, []);

  // call generateProblem() function when answer is change by checking condition
  useEffect(() => {
    if (answer === correctAnswer || answer === wrongAnswer) {
      generateProblem();
    } else {
      setScore((prevScore) => prevScore - 1);
    }
  }, [answer]);

  // reduce the time from 5s to 0s
  useEffect(() => {
    const timeInterval = setInterval(() => {
      setCounter((prevCounter) => prevCounter - 1);
    }, 1000);
    if (counter === 0) {
      setScore((prevScore) => prevScore - 1);
      clearInterval(timeInterval);
      setCounter(5);
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
      setScore((prevScore) => prevScore + 1);
      generateProblem();
      setCounter(5);
    } else {
      setScore((prevScore) => prevScore - 1);
      setCounter(5);
    }
  }

  function restartGame() {
    setScore(0);
    generateProblem();
    setCounter(5);
  }

  if (score < 0) {
    return (
      <div>
        <div>Your loose the game</div>
        <button onClick={restartGame}>Retry</button>
      </div>
    );
  }

  return (
    <div className="mainApp">
      <h1 className="mainHeading">Let's explore your Mind</h1>
      <h2 className="counter" id="counter">
        Time : {counter}s
      </h2>
      <p className="problem" id="problem">
        {num1} {operator} {num2} = {answer}
      </p>
      <h3 className="score" id="scores">
        Your score : {score}
      </h3>
      <button
        className="correctBtn"
        onClick={() => checkAnswer(answer === correctAnswer)}
        id="correct"
      >
        Correct
      </button>
      <button
        className="wrongBtn"
        onClick={() => checkAnswer(answer !== correctAnswer)}
        id="wrong"
      >
        Wrong
      </button>
    </div>
  );
}
