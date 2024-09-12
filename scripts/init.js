import { fetchRandomText } from "./randomText.js";
import { paragraphBox } from "./doms.js";

let mainArray = []; // An array used to store the characters of the main text for the typing test

async function initialize() {
  try {
    paragraphBox.innerHTML = "Loading..."; // Displays loading message
    const randomText = await fetchRandomText();
    mainArray = randomText.split("");
    paragraphBox.innerHTML = ""; // Clears the loading message

    mainArray.forEach((ch) => {
      const spanChar = document.createElement("span");
      spanChar.innerText = ch;
      paragraphBox.appendChild(spanChar);
    });

    spanArray = Array.from(paragraphBox.querySelectorAll("span")); // Converts NodeList to Array
  } catch (error) {
    console.error(error);
  }
}

export { initialize };
