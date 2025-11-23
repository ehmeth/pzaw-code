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

app.get("/cards/new_category", (req, res) => {
  res.render("category_new", {
    title: "Nowa kategoria",
  });
});

app.post("/cards/new_category", (req, res) => {
  const category_name = req.body.name;
  var category_id = null;
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

app.get("/cards/edit/:category_id", (req, res) => {
  const category_id = req.params.category_id;
  const errors = [];
  var category = flashcards.getCategory(category_id);
  if (category != null) {
    res.render("category_edit", {
      errors,
      title: "Edycja kategorii",
      category,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/cards/edit/:category_id", (req, res) => {
  const category_id = req.params.category_id;
  if (flashcards.hasCategory(category_id)) {
    const category_name = req.body.name;
    var new_category_id = null;
    const errors = flashcards.validateCategoryName(category_name);
    if (errors.length == 0) {
      new_category_id = flashcards.generateCategoryId(category_name);
      if (
        new_category_id !== category_id &&
        flashcards.hasCategory(new_category_id)
      ) {
        errors.push("Category id is already taken");
      }
    }
    if (errors.length == 0) {
      const category = flashcards.updateCategory(
        category_id,
        new_category_id,
        category_name
      );
      if (category != null) {
        // category id may have changed due to name change
        res.redirect("/cards/view/" + category.id);
      } else {
        // This should never happen
        res.write("Unexpected error while updating category");
        res.sendStatus(500);
      }
    } else {
      const category = flashcards.getCategory(category_id);
      res.render("category_edit", {
        errors,
        title: "Edycja kategorii",
        category,
      });
    }
  } else {
    res.sendStatus(404);
  }
});

app.post("/cards/edit/:category_id/:card_id", (req, res) => {
  const category_id = req.params.category_id;
  const card_id = req.params.card_id;
  if (!flashcards.hasCategory(category_id) || !flashcards.hasCard(card_id)) {
    res.sendStatus(404);
  } else {
    const card = {
      front: req.body.front,
      back: req.body.back,
      id: card_id,
    };
    const errors = flashcards.validateCardData(card);
    if (errors.length == 0) {
      flashcards.updateCard(card);
      res.redirect(`/cards/edit/${category_id}`);
    } else {
      let category = flashcards.getCategory(category_id);
      res.render("category_edit", {
        errors,
        title: "Edycja kategorii",
        category,
      });
    }
  }
});

app.post("/cards/delete/:category_id/:card_id", (req, res) => {
  const category_id = req.params.category_id;
  const card_id = req.params.card_id;
  if (!flashcards.hasCategory(category_id) || !flashcards.hasCard(card_id)) {
    res.sendStatus(404);
  } else {
    flashcards.deleteCardById(card_id);
    res.redirect(`/cards/edit/${category_id}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
