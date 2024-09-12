import {
  inputArea,
  paragraphBox,
  startBttn,
  wpmContainer,
  timeContainer,
  accuracyContainer,
} from "./doms.js";
import { scrolling } from "./functions.js";
import { displayResults } from "./displayResults.js";
import { initialize } from "./init.js";

let mainArray = []; // An array used to store the characters of the main text for the typing test
let spanArray = []; // Each <span> element corresponds to a character in the main text
let typedChar; // Represents the character that the user has currently typed
let currInput = ""; // Holds the current input text that the user has typed so far
let currInputArray = []; // An array that holds each character of the current user input, converted into an array format
let charTypedWrong = 0; // Variable that keeps track of the count of typed wrong characters
let timer; // Timer
let count = 0; // A countdown variable used to display the time left for the typing test
let typedCharArr = []; // An array that stores information about whether the typed characters were correct or not
let charCheckWrong = false; // A boolean variable that indicates whether the currently typed character is wrong
let typingStarted = false; // A boolean variable that indicates whether typing has started or not
let charTypedCorrectWithScroll = 0; // Declare the variable at the top level

function listeners() {
  document.addEventListener("DOMContentLoaded", () => {
    const startButton = document.getElementById("start-button");
    const typingField = document.getElementById("typing-field");
    const inputFieldHidden = document.getElementById("input-field-hidden");

    startButton.addEventListener("click", again);
    typingField.addEventListener("click", focus);
    inputFieldHidden.addEventListener("input", check);
    // Calls the function to display results when the page loads
    window.addEventListener("load", displayResults);

    // Call the start function here
    scrolling();
    start();

    // Handles Escape and Enter key press to reset and restart the test
    inputArea.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        resetTest();
        paragraphBox.scrollLeft = 0;
        e.preventDefault();
      } else if (e.key === "Enter") {
        again();
      }
    });
  });
}

listeners();

function changeSpace(s) {
  if (s == " ") {
    s = "&nbsp;";
  }
  return s;
}

function createArray() {
  currInput = inputArea.value;
  currInputArray = currInput.split("").map(changeSpace);

  spanArray = paragraphBox.querySelectorAll("span");
  spanArray.forEach((e) => {
    if (e.innerHTML == " ") {
      e.innerHTML = "&nbsp;";
    }
  });
}

function resetMetrics() {
  paragraphBox.scrollLeft = 0;
  clearInterval(timer);
  inputArea.value = "";
  timeContainer.innerText = "60";
  wpmContainer.innerText = "";
  accuracyContainer.innerText = "";
  charTypedWrong = 0;
  count = 0;
  charCheckWrong = false;
  typedCharArr = [];
}

function start() {
  startBttn.innerHTML = "Start";
  inputArea.value = "";
  resetMetrics();
  paragraphBox.innerHTML = "Click Start to begin";
  startBttn.focus();

  // Removes the 'keydown' event listener to ensure no previous listeners are active
  inputArea.removeEventListener("keydown", startTimerOnKeyPress);

  // Adds the 'keydown' event listener to start the timer
  inputArea.addEventListener("keydown", startTimerOnKeyPress);
}

function startTimerOnKeyPress(e) {
  if (!typingStarted && e.key !== "!") {
    typingStarted = true;
    timeCounter(); // Start the timer
    inputArea.removeEventListener("keydown", startTimerOnKeyPress); // Removes the event listener
  }
}

function resetTest() {
  // Clears the input area
  inputArea.value = "";

  // Removes highlighting from characters
  spanArray.forEach((char) => {
    char.classList.remove(
      "correct",
      "wrong",
      "cursor-highlight",
      "space-wrong"
    );
  });

  // Resets statistics
  charTypedWrong = 0;
  charTypedCorrectWithScroll = 0;

  // Scrolls back to the beginning of the paragraph
  paragraphBox.scrollLeft = 0;

  // Restarts the timer
  clearInterval(timer);
  timeContainer.innerText = "60";

  // Resets accuracy and WPM containers
  wpmContainer.innerText = "";
  accuracyContainer.innerText = "";

  // Removed the 'keydown' event listener to ensure no previous listeners are active
  inputArea.removeEventListener("keydown", startTimerOnKeyPress);

  // Added the 'keydown' event listener to start the timer
  inputArea.addEventListener("keydown", startTimerOnKeyPress);

  typingStarted = false; // Resets the typingStarted variable
  inputArea.focus();
  // Resets typedCharArr array
  typedCharArr = [];
}

function check() {
  createArray();

  let s = [];
  spanArray.forEach((e) => {
    s.push(e.innerHTML);
  });

  spanArray.forEach((char, index) => {
    typedChar = currInputArray[index];

    // Checking if latest char is the same with the text
    if (typedChar == null) {
      // If the test has not yet started
      char.classList.remove("wrong");
      char.classList.remove("correct");
    } else if (typedChar == char.innerHTML) {
      // If the char typed matches
      char.classList.remove("wrong");
      char.classList.add("correct");
      charCheckWrong = false;
    } else if (typedChar != char.innerHTML) {
      // If the char does not match
      char.classList.remove("correct");
      char.classList.add("wrong");
      charCheckWrong = true;
    }

    // Highlighting the wrong and cursor-highlight
    if (index == currInputArray.length) {
      if (char === " ") char.classList.add("space-wrong");
      char.classList.add("cursor-highlight");
    } else char.classList.remove("cursor-highlight");

    if (currInputArray.length == spanArray.length) {
      clearInterval(timer);
      charTypedWrong = determineWrongCounts();

      console.log(charTypedWrong, "= wrong counts");
      calculateWpm();
      calculateAcc();
      startBttn.focus();
    }
  });

  typedCharArr.push(charCheckWrong);
}

function again() {
  resetMetrics();
  inputArea.focus();
  startBttn.innerHTML = "Again";
  typingStarted = false; // Resets the typingStarted variable

  // Removes the 'keydown' event listener to ensure no previous listeners are active
  inputArea.removeEventListener("keydown", startTimerOnKeyPress);

  // Adds the 'keydown' event listener to start the timer
  inputArea.addEventListener("keydown", startTimerOnKeyPress);

  initialize();
  check();
}

function calculateAcc() {
  let acc = Math.round(
    (charTypedCorrectWithScroll /
      (charTypedCorrectWithScroll + charTypedWrong)) * 100
  );

  if (isNaN(acc)) {
    accuracyContainer.innerText = "100%"; // Handles division by zero case
  } else {
    accuracyContainer.innerText = acc + "%";
  }
}

function calculateWpm() {
  let wpmScore = Math.round(
    charTypedCorrectWithScroll / 5 / ((60 - count) / 60)
  );
  wpmContainer.innerText = wpmScore;
}

function determineWrongCounts() {
  let typedWrong = 0;
  charTypedCorrectWithScroll = 0; // Resets correct count
  for (let i = 0; i < typedCharArr.length; i++) {
    if (typedCharArr[i] == true) {
      typedWrong += 1;
    } else if (typedCharArr[i] == false) {
      charTypedCorrectWithScroll += 1; // Counts correct characters
    }
  }
  return typedWrong;
}

function timeCounter() {
  count = 60; // Starts the timer at 60 seconds
  timer = setInterval(() => {
    count--;
    timeContainer.innerText = count;
    if (count === 0) {
      clearInterval(timer);
      endTest(); // Calls the function to end the test and display statistics
    }
  }, 1000); // Counts down every 1000 milliseconds (1 second)
}

function endTest() {
  if (currInputArray.length > 0) {
    // Checks if any input has been typed
    charTypedWrong = determineWrongCounts();

    console.log(charTypedWrong, "= wrong counts");
    calculateWpm();
    calculateAcc();
  } else {
    // Sets accuracy and WPM to 0 when no input is typed
    wpmContainer.innerText = "0";
    accuracyContainer.innerText = "0%";
  }
  // Stores accuracy and WPM in local storage
  const testResult = {
    accuracy: accuracyContainer.innerText,
    wpm: wpmContainer.innerText,
  };
  const results = JSON.parse(localStorage.getItem("typingTestResults")) || [];
  results.push(testResult);
  localStorage.setItem("typingTestResults", JSON.stringify(results));

  // Disables the input area after the test is done
  inputArea.disabled = true;
}
