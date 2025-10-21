import express from "express";
import flashcards from "./models/flashcards.js";

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

app.get("/cards", (req, res) => {
  res.render("categories", {
    title: "Kategorie",
    categories: flashcards.getCategorySummaries(),
  });
});

app.get("/cards/:category_id", (req, res) => {
  const category = flashcards.getCategory(req.params.category_id);
  if (category != null) {
    res.render("category", {
      title: category.name,
      category,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/cards/:category_id/new", (req, res) => {
  const category_id = req.params.category_id;
  if (!flashcards.hasCategory(category_id)) {
    res.sendStatus(404);
  } else {
    flashcards.addCard(category_id, {
      front: req.body.front,
      back: req.body.back,
    });
    res.redirect(`/cards/${category_id}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
