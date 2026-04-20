import user from "../models/user.js";
import flashcards from "../models/flashcards.js";

const cardsets = {
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

// TODO(kleindan) prompt for admin password in the future
let admin = await user.createUser("admin", "changeme");
let errMsg = user.addAttribute(admin.id, "is_admin", true);
if (errMsg) {
  console.error(errMsg);
}

let student = await user.createUser("student", "changeme");

Object.entries(cardsets).map(([slug, data]) => {
  let category = flashcards.addCardset(slug, data.name, student);
  for (let card of data.cards) {
    let c = flashcards.addCard(category.slug, card);
  }
});

console.log("Done!");
