import flashcards from "../models/flashcards.js";

const card_categories = {
  "j-angielski-food": {
    name: "j. angielski - food",
    cards: [
      { front: "truskawka", back: "strawberry" },
      { front: "gałka muszkatołowa", back: "nutmeg" },
      { front: "jabłko", back: "apple" },
      { front: "karczoch", back: "artichoke" },
      { front: "cielęcina", back: "veal" },
    ],
  },
  "stolice-europejskie": {
    name: "stolice europejskie",
    cards: [
      { front: "Holandia", back: "Amsterdam" },
      { front: "Włochy", back: "Rzym" },
      { front: "Niemcy", back: "Berlin" },
      { front: "Węgry", back: "Budapeszt" },
      { front: "Rumunia", back: "Bukareszt" },
    ],
  },
};

console.log("Populating db...");

Object.entries(card_categories).map(([id, data]) => {
  let category = flashcards.addCategory(id, data.name);
  console.log("Created category:", category);
  for (let card of data.cards) {
    let c = flashcards.addCard(category.id, card);
    console.log("Created card:", c);
  }
});
