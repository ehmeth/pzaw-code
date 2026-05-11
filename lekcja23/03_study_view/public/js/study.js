import { Flashcard } from "./views/card.js";

const quizContainer = document.getElementById("study");

let [_, main, slug] = location.pathname.split("/");

if (_ === "" && main === "study") {
    let result = await fetch(`/api/cardset/${slug}`);
    if (result.ok) {
        let cardset = await result.json();
        for (let card of cardset.cards) {
            let flashcard = new Flashcard(card.front, card.back);
            let flashcard_view = flashcard.render();
            quizContainer.appendChild(flashcard_view);
        }
    }
}



