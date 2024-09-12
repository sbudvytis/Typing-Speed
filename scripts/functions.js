import { inputArea, paragraphBox } from "./doms.js";

let currInputArray = []; // An array that holds each character of the current user input, converted into an array format
let charTypedCorrectWithScroll = 0; // Declare the variable at the top level

function ignoredKey(eKey) {
  const ignoredKeys = {
    Shift: 0,
    Alt: 0,
    Control: 0,
  };
  return ignoredKeys[eKey] ?? -1;
}

function scrolling() {
  inputArea.addEventListener(
    "keydown",
    (e) => {
      let name = e.key;
      let spanArray = Array.from(paragraphBox.querySelectorAll("span"));

      if (name === "Backspace") {
        if (currInputArray.length > spanArray.length * 1) {
          paragraphBox.scrollLeft -= 0;
        } else {
          paragraphBox.scrollLeft -= spanArray[0].offsetWidth; // Scrolls by character width
        }
        // Handles Escape key (reset test and scroll to beginning)
        // Checks if the Enter key is pressed to restart the test
      } else if (ignoredKey(name) === 0) {
        paragraphBox.scrollLeft += 0;
      } else {
        paragraphBox.scrollLeft += spanArray[0].offsetWidth / 1.1; // Scrolls by character width

        charTypedCorrectWithScroll += 1; // Increments correct count
      }
    },
    false
  );
}

export { scrolling };