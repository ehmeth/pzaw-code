import express from "express";
import flashcards from "./models/flashcards.js";

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));

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

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
