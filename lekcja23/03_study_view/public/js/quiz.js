import { Flashcard } from "./views/card.js";

const quizContainer = document.getElementById("study");
let flashcard = new Flashcard("awers", "rewers");
let flashcard_view = flashcard.render();
quizContainer.appendChild(flashcard_view);
