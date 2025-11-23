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

app.get("/cards/view/:category_id", (req, res) => {
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

app.post("/cards/add_card/:category_id", (req, res) => {
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
      res.redirect(`/cards/view/${category_id}`);
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

app.get("/cards/category/new", (req, res) => {
  res.render("category_new", {
    title: "Nowa kategoria",
  });
});

app.post("/cards/category/new", (req, res) => {
  const category_name = req.body.name;
  var category_id = null;
  console.log(category_name);
  var errors = flashcards.validateCategoryName(category_name);
  if (errors.length == 0) {
    category_id = flashcards.generateCategoryId(category_name);
    if (flashcards.hasCategory(category_id)) {
      errors.push("Category id is already taken");
    }
  }

  if (errors.length == 0) {
    flashcards.addCategory(category_id, category_name);
    res.redirect(`/cards/view/${category_id}`);
  } else {
    res.status(400);
    res.render("category_new", {
      errors,
      title: "Nowa kategoria",
      name: category_name,
    });
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
