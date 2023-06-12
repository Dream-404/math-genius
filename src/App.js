import React, { useState, useEffect } from "react";
import "./app.css";
export default function App() {
  // declare the state that going to use in this react app
  const [state, setState] = useState({
    num1: 0,
    num2: 0,
    operator: null,
    score: 0,
    counter: 6,
    correctAnswer: 0,
    wrongAnswer: 0,
    answer: null,
    highestScore: 0,
    showStartApp: true,
    showMainApp: false,
  });

  useEffect(() => {
    generateProblem();
  }, []);

  useEffect(() => {
    if (
      state.answer === state.correctAnswer ||
      state.answer === state.wrongAnswer
    ) {
      generateProblem();
    } else {
      setState((prevState) => ({
        ...prevState,
        counter: prevState.counter - 3,
      }));
    }
  }, [state.answer]);

  useEffect(() => {
    const storedHighestScore = parseInt(localStorage.getItem("score"));
    if (!isNaN(storedHighestScore)) {
      setState((prevState) => ({
        ...prevState,
        highestScore: storedHighestScore,
      }));
    }
    if (state.score > storedHighestScore) {
      setState((prevState) => ({ ...prevState, highestScore: state.score }));
      localStorage.setItem("score", state.score.toString());
    }
  }, [state.score]);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (state.showMainApp === true) {
        setState((prevState) => ({
          ...prevState,
          counter: prevState.counter - 1,
        }));
      }
    }, 1000);

    if (state.counter < 0) {
      clearInterval(timeInterval);
    }

    return () => {
      clearInterval(timeInterval);
    };
  }, [state.counter]);

  // function that generate states for the math problem
  function generateProblem() {
    const newNum1 = Math.ceil(Math.random() * 30);
    const newNum2 = Math.ceil(Math.random() * 30);
    const newOperator = Math.random() < 0.5 && newNum1 > newNum2 ? "-" : "+";
    const newCorrectAnswer = calculateAnswer(newNum1, newNum2, newOperator);
    const newWrongAnswer = newCorrectAnswer + Math.ceil(Math.random() * 6);
    const newAnswer = Math.random() < 0.5 ? newCorrectAnswer : newWrongAnswer;

    setState((prevState) => ({
      ...prevState,
      num1: newNum1,
      num2: newNum2,
      operator: newOperator,
      correctAnswer: newCorrectAnswer,
      wrongAnswer: newWrongAnswer,
      answer: newAnswer,
    }));
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
      setState((prevState) => ({
        ...prevState,
        counter: prevState.counter + 3,
        score: prevState.score + 1,
      }));
      generateProblem();
    } else {
      setState((prevState) => ({
        ...prevState,
        counter: prevState.counter - 3,
      }));
    }
  }

  // restart function
  function restartGame() {
    setState((prevState) => ({
      ...prevState,
      score: 0,
      counter: 6,
      showStartApp: false,
      showMainApp: true,
    }));
    generateProblem();
  }

  // if counter equal to 0 the game is over
  if (state.counter < 0) {
    return (
      <div className="mainRestartApp">
        <h1>You lose the game</h1>
        <h2>Let's try the challenges again!</h2>
        <button className="btn" onClick={restartGame}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <>
      {state.showStartApp && (
        <div className="startApp">
          <h1>Let's play</h1>
          <button className="btn" onClick={restartGame}>
            Play
          </button>
        </div>
      )}

      {state.showMainApp && (
        <div className="mainApp">
          <h1 className="mainHeading">Let's explore your mind</h1>
          <h1>Your highest score: {state.highestScore}</h1>
          <h2 className="counter" id="counter">
            Time: {state.counter}s
          </h2>
          <p className="problem" id="problem">
            {state.num1} {state.operator} {state.num2} = {state.answer}
          </p>
          <h3 className="score" id="scores">
            Current Score: {state.score}
          </h3>
          <button
            className="correctBtn btn"
            onClick={() => checkAnswer(state.answer === state.correctAnswer)}
            id="correct"
          >
            Correct
          </button>
          <button
            className="wrongBtn btn"
            onClick={() => checkAnswer(state.answer !== state.correctAnswer)}
            id="wrong"
          >
            Wrong
          </button>
        </div>
      )}
    </>
  );
}
