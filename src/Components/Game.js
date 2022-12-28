import React from 'react'
import useSound from 'use-sound';
import fSound from '../music/food.mp3'
import oSound from '../music/gameover.mp3'
import mSound from '../music/move.mp3'
import { useState, useEffect } from 'react';
import './Game.css'

export default function Game() {

  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(150)
  const [direction, setDirection] = useState("right");
  const [snakeDots, setSnakeDots] = useState([[0, 0], [4, 0]]);
  const [foodIndex, setFoodIndex] = useState(getRandomNumber());
  const [snakeHead, setSnakeHead] = useState(snakeDots[snakeDots.length - 1])
  const [gameOver, setGameOver] = useState(false);
  const [foodSound] = useSound(fSound);
  const [overSound] = useSound(oSound);
  const [moveSound] = useSound(mSound);


  useEffect(() => {
    const timer = setInterval(() => {
      if (!gameOver) {
        moveSnake()
      }
    }, speed);
    return () => clearInterval(timer);
  });


  const foodStyle = {
    left: `${foodIndex[0]}%`,
    top: `${foodIndex[1]}%`
  }


  function getRandomNumber() {

    var range = 100;
    var x = Math.floor(Math.random() * range / 4) * 4;
    let y = Math.floor(Math.random() * range / 4) * 4;

    return [x, y];

  }

  document.onkeydown = () => onKeydown();
  const onKeydown = e => {
    e = e || window.event;

    moveDirection(e.keyCode);


    // moveSnake();

  }

  function moveDirection(value) {
    switch (value) {
      case 38:
        if (direction !== "down") {
          setDirection("up");
          moveSnake("up");
        }
        break;
      case 40:
        if (direction !== "up") {
          setDirection("down")
          moveSnake("down")


        }
        break;
      case 37:
        if (direction !== "right") {
          setDirection("left")
          moveSnake("left")

        }
        break;
      case 39:
        if (direction !== "left") {
          setDirection("right")
          moveSnake("right")

        }
        break;

      default:
        break;

    }
    moveSound();
  }


  const moveSnake = () => {
    // snakeIndex.shift();
    // setSnakeD(oldArray => [...oldArray, [snakeIndex[snakeIndex.length-1][0] , snakeIndex[snakeIndex.length-1][1]+2 ]]);
    let dots = [...snakeDots];
    let head = dots[dots.length - 1];

    switch (direction) {
      case "right":
        head = [head[0] + 4, head[1]];
        break;

      case "left":
        head = [head[0] - 4, head[1]];
        break;

      case "down":
        head = [head[0], head[1] + 4]
        break;

      case "up":
        head = [head[0], head[1] - 4]
        // checkFoodEaten(foodIndex);
        break;

      default:
        break;

    }



    dots.push(head);
    if (!checkFoodEaten(head)) {
      dots.shift();
    }
    if (!checkGameOver(head)) {
      setSnakeDots(dots);
    }
    setSnakeHead(snakeDots[snakeDots.length - 1]);
  }


  const checkFoodEaten = (head) => {
    // if (foodIndex[0] === snakeDots[snakeDots.length - 1][0] && foodIndex[1] === snakeDots[snakeDots.length - 1][1]) {
    if (JSON.stringify(foodIndex) === JSON.stringify(head)) {
      setFoodIndex(getRandomNumber());
      setSpeed(speed - 5);
      setScore(score + 1);
      foodSound()
      return true;
    }
  }

  const checkGameOver = (snakeHead) => {
    if (snakeHead[1] > 98 || snakeHead[1] < 0 || snakeHead[0] > 98 || snakeHead[0] < 0) {
      setGameOver(true);
      overSound();
      // setScore(0);
      // setFoodIndex(getRandomNumber());
      // setSnakeDots([[0,0],[4,0]]);
      setDirection("right");
      setSpeed(150);
      return true;
    }
  }

  const startGame = () => {
    setScore(0);
    // setFoodIndex(getRandomNumber());
    setSnakeDots([[0, 0], [4, 0]]);
    setDirection("right");
    setSpeed(150);
    setGameOver(false);
    // bgMusic()
  }
  const headStyle = {
    left: `${snakeHead[0]}%`,
    top: `${snakeHead[1]}%`,
  }

  const gameOverStyle = {
    display: gameOver ? "block" : "none"

  }


  return (
    <>
      <div className='pl-[50px]'>

        <div className="score" >Score : {score}</div>
        <div className='board'>
          {


            snakeDots.map((index) => {
              const style = {
                left: `${index[0]}%`,
                top: `${index[1]}%`
              }
              return (
                <div className='snake' style={style}></div>
              )
            })}
          <div className="head" style={headStyle}></div>
          <div className={`food ${score > 0 && score % 5 === 0 ? "big-food" : ""}`} style={foodStyle}></div>
          <div className='gameOver' style={gameOverStyle}>
            <div className='overText'><span className=' w3-animate-top'>GAME</span><br /><span className='w3-animate-bottom' >OVER</span> </div>

            <div className='overScore'>Score : {score}</div>
            <button className='playButton' onClick={() => { startGame() }}>Play Again</button>
          </div>
        </div>
        <div className='formobile'>
          <button className='up' onClick={() => moveDirection(38)}>UP</button><br />
          <button className='left' onClick={() => moveDirection(37)}>LEFT</button>
          <button className='right' onClick={() => moveDirection(39)}>RIGHT</button><br />
          <button className='down' onClick={() => moveDirection(40)}>DOWN</button>

        </div>
      </div>
    </>
  )
}
