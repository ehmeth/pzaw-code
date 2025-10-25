import express from "express";
import morgan from "morgan";
import flashcards from "./models/flashcards.js";

const port = 8000;

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());

app.use(morgan("dev"));

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
    let card_data = {
      front: req.body.front,
      back: req.body.back,
    };
    var errors = flashcards.validateCardData(card_data);
    if (errors.length == 0) {
      flashcards.addCard(category_id, card_data);
      res.redirect(`/cards/${category_id}`);
    } else {
      res.status(400);
      res.render("new_card", {
        errors,
        title: "Nowa fiszka",
        front: req.body.front,
        back: req.body.back,
        category: {
          id: category_id,
        },
      });
    }
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
