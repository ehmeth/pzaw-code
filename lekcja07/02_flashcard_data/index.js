import express from "express";
import ejs from "ejs";

const port = 8000;
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

const app = express();

app.set("view engine", "ejs");

app.use(express.static("public"));

app.get("/cards/categories/", (req, res) => {
  res.render("categories", {
    title: "Kategorie",
    categories: Object.entries(card_categories).map(
      ([id, category]) => category.name
    ),
  });
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
