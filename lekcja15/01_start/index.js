import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import flashcards from "./models/flashcards.js";
import settings from "./models/settings.js";
import session from "./models/session.js";
import auth from "./controllers/auth.js";

const port = process.env.PORT || 8000;
const LAST_VIEWED_COOKIE = "__Host-fisz-last-viewed";
const ONE_DAY = 24 * 60 * 60 * 1000;
const ONE_MONTH = 30 * ONE_DAY;
const SECRET = process.env.SECRET;

if (SECRET == null) {
  console.error(
    "SECRET environment variable missing. Please create an env file or provide SECRET via environment variables.",
  );
  process.exit(1);
}

const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(morgan("dev"));
app.use(cookieParser(SECRET));

app.use(settings.settingsHandler);
app.use(session.sessionHandler);

const settingsRouter = express.Router();
settingsRouter.use("/toggle-theme", settings.themeToggle);
settingsRouter.use("/accept-cookies", settings.acceptCookies);
settingsRouter.use("/decline-cookies", settings.declineCookies);
settingsRouter.use("/manage-cookies", settings.manageCookies);
app.use("/settings", settingsRouter);

const authRouter = express.Router();
authRouter.get("/signup", auth.signup_get);
authRouter.post("/signup", auth.signup_post);
authRouter.get("/login", auth.login_get);
authRouter.post("/login", auth.login_post);
authRouter.get("/logout", auth.logout);
app.use("/auth", authRouter);

app.get("/", (req, res) => {
  var last_viewed_categories = null;
  if (res.locals.app.cookie_consent && req.signedCookies[LAST_VIEWED_COOKIE]) {
    let last_viewed = req.signedCookies[LAST_VIEWED_COOKIE] || [];
    last_viewed_categories = last_viewed
      .map((x) => parseInt(x, 10))
      .filter((x) => !isNaN(x))
      .map((id) => flashcards.getCategorySummary(id));
  }
  res.render("categories", {
    title: "Kategorie",
    categories: flashcards.getCategorySummaries(),
    last_viewed_categories,
  });
});

app.get("/view/:category_id", (req, res) => {
  const category = flashcards.getCategory(req.params.category_id);
  if (category != null) {
    if (res.locals.app.cookie_consent) {
      let last_viewed_dirty = req.signedCookies[LAST_VIEWED_COOKIE] || [];
      let last_viewed = [
        category.category_id,
        ...last_viewed_dirty
          .map((x) => parseInt(x, 10))
          .filter((x) => !isNaN(x) && x !== category.category_id)
          .slice(0, 2),
      ];
      res.cookie(LAST_VIEWED_COOKIE, last_viewed, {
        httpOnly: true,
        secure: true,
        maxAge: ONE_MONTH,
        signed: true,
      });
    }
    res.render("category", {
      title: category.name,
      category,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/add_card/:category_id", (req, res) => {
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
      res.redirect(`/view/${category_id}`);
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

app.get("/new_category", (req, res) => {
  res.render("category_new", {
    title: "Nowa kategoria",
  });
});

app.post("/new_category", (req, res) => {
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
    res.redirect(`/view/${category_id}`);
  } else {
    res.status(400);
    res.render("category_new", {
      errors,
      title: "Nowa kategoria",
      name: category_name,
    });
  }
});

app.get("/edit/:category_id", (req, res) => {
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

app.post("/edit/:category_id", (req, res) => {
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
        category_name,
      );
      if (category != null) {
        // category id may have changed due to name change
        res.redirect("/view/" + category.id);
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

app.post("/edit/:category_id/:card_id", (req, res) => {
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
      res.redirect(`/edit/${category_id}`);
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

app.post("/delete/:category_id/:card_id", (req, res) => {
  const category_id = req.params.category_id;
  const card_id = req.params.card_id;
  if (!flashcards.hasCategory(category_id) || !flashcards.hasCard(card_id)) {
    res.sendStatus(404);
  } else {
    flashcards.deleteCardById(card_id);
    res.redirect(`/edit/${category_id}`);
  }
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
