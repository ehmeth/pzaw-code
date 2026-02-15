import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import flashcards from "./models/flashcards.js";
import settings from "./models/settings.js";
import session from "./models/session.js";
import auth from "./controllers/auth.js";
import user from "./models/user.js";

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
  var last_viewed_cardsets = null;
  if (res.locals.app.cookie_consent && req.signedCookies[LAST_VIEWED_COOKIE]) {
    let last_viewed = req.signedCookies[LAST_VIEWED_COOKIE] || [];
    last_viewed_cardsets = last_viewed
      .map((x) => parseInt(x, 10))
      .filter((x) => !isNaN(x))
      .map((id) => flashcards.getCardsetSummary(id));
  }
  res.render("cardsets", {
    title: "Zestawy fiszek",
    cardsets: flashcards.getCardsetSummaries(),
    last_viewed_cardsets,
  });
});

app.get("/view/:cardset_slug", (req, res) => {
  const cardset = flashcards.getCardset(req.params.cardset_slug);
  cardset.author = user.getUser(cardset.author_id);
  if (cardset != null) {
    if (res.locals.app.cookie_consent) {
      let last_viewed_dirty = req.signedCookies[LAST_VIEWED_COOKIE] || [];
      let last_viewed = [
        cardset.cardset_slug,
        ...last_viewed_dirty
          .map((x) => parseInt(x, 10))
          .filter((x) => !isNaN(x) && x !== cardset.cardset_slug)
          .slice(0, 2),
      ];
      res.cookie(LAST_VIEWED_COOKIE, last_viewed, {
        httpOnly: true,
        secure: true,
        maxAge: ONE_MONTH,
        signed: true,
      });
    }
    res.render("cardset", {
      title: cardset.name,
      cardset,
    });
  } else {
    res.sendStatus(404);
  }
});

app.post("/add_card/:cardset_slug", auth.login_required, (req, res) => {
  const cardset_slug = req.params.cardset_slug;
  if (!flashcards.hasCardset(cardset_slug)) {
    res.sendStatus(404);
  } else {
    if (!flashcards.canEdit(cardset_slug, res.locals.user)) {
      res.status(401);
      res.redirect("/");
    } else {
      let card_data = {
        front: req.body.front,
        back: req.body.back,
      };
      var errors = flashcards.validateCardData(card_data);
      if (errors.length == 0) {
        flashcards.addCard(cardset_slug, card_data);
        res.redirect(`/view/${cardset_slug}`);
      } else {
        res.status(400);
        res.render("new_card", {
          errors,
          title: "Nowa fiszka",
          front: req.body.front,
          back: req.body.back,
          cardset: {
            id: cardset_slug,
          },
        });
      }
    }
  }
});

app.get("/add_card/:cardset_slug", auth.login_required, (req, res) => {
  res.redirect(`/view/${req.params.cardset_slug}`);
});

app.get("/new_cardset", auth.login_required, (req, res) => {
  res.render("cardset_new", {
    title: "Nowy zestaw",
  });
});

app.post("/new_cardset", auth.login_required, (req, res) => {
  const cardset_name = req.body.name;
  var cardset_slug = null;
  var errors = flashcards.validateCardsetName(cardset_name);
  if (errors.length == 0) {
    cardset_slug = flashcards.generateCardsetSlug(cardset_name);
    if (flashcards.hasCardset(cardset_slug)) {
      errors.push("Cardset id is already taken");
    }
  }

  if (errors.length == 0) {
    flashcards.addCardset(cardset_slug, cardset_name, res.locals.user);
    res.redirect(`/view/${cardset_slug}`);
  } else {
    res.status(400);
    res.render("cardset_new", {
      errors,
      title: "Nowy zestaw",
      name: cardset_name,
    });
  }
});

app.get("/edit/:cardset_slug", auth.login_required, (req, res) => {
  const cardset_slug = req.params.cardset_slug;
  const errors = [];
  var cardset = flashcards.getCardset(cardset_slug);
  if (cardset != null) {
    if (!cardset.editableBy(res.locals.user)) {
      res.status(401);
      res.redirect("/");
    } else {
      res.render("cardset_edit", {
        errors,
        title: "Edycja zestawu",
        cardset,
      });
    }
  } else {
    res.sendStatus(404);
  }
});

app.post("/edit/:cardset_slug", auth.login_required, (req, res) => {
  const cardset_slug = req.params.cardset_slug;
  if (flashcards.hasCardset(cardset_slug)) {
    if (!flashcards.canEdit(cardset_slug, res.locals.user)) {
      res.status(401);
      res.redirect("/");
    } else {
      const cardset_name = req.body.name;
      var new_cardset_slug = null;
      const errors = flashcards.validateCardsetName(cardset_name);
      if (errors.length == 0) {
        new_cardset_slug = flashcards.generateCardsetSlug(cardset_name);
        if (
          new_cardset_slug !== cardset_slug &&
          flashcards.hasCardset(new_cardset_slug)
        ) {
          errors.push("Cardset id is already taken");
        }
      }
      if (errors.length == 0) {
        const cardset = flashcards.updateCardset(
          cardset_slug,
          new_cardset_slug,
          cardset_name,
        );
        if (cardset != null) {
          // cardset id may have changed due to name change
          res.redirect("/view/" + cardset.slug);
        } else {
          // This should never happen
          res.write("Unexpected error while updating cardset");
          res.sendStatus(500);
        }
      } else {
        const cardset = flashcards.getCardset(cardset_slug);
        res.render("cardset_edit", {
          errors,
          title: "Edycja zestawu",
          cardset,
        });
      }
    }
  } else {
    res.sendStatus(404);
  }
});

app.post("/edit/:cardset_slug/:card_id", auth.login_required, (req, res) => {
  const cardset_slug = req.params.cardset_slug;
  const card_id = req.params.card_id;
  if (!flashcards.hasCardset(cardset_slug) || !flashcards.hasCard(card_id)) {
    res.sendStatus(404);
  } else {
    if (!flashcards.canEdit(cardset_slug, res.locals.user)) {
      res.status(401);
      res.redirect("/");
    } else {
      const card = {
        front: req.body.front,
        back: req.body.back,
        id: card_id,
      };
      const errors = flashcards.validateCardData(card);
      if (errors.length == 0) {
        flashcards.updateCard(card);
        res.redirect(`/edit/${cardset_slug}`);
      } else {
        let cardset = flashcards.getCardset(cardset_slug);
        res.render("cardset_edit", {
          errors,
          title: "Edycja zestawu",
          cardset,
        });
      }
    }
  }
});

app.get("/edit/:cardset_slug/:card_id", auth.login_required, (req, res) => {
  res.redirect(`/edit/${req.params.cardset_slug}`);
});

app.post("/delete/:cardset_slug/:card_id", auth.login_required, (req, res) => {
  const cardset_slug = req.params.cardset_slug;
  const card_id = req.params.card_id;
  if (!flashcards.hasCardset(cardset_slug) || !flashcards.hasCard(card_id)) {
    res.sendStatus(404);
  } else {
    if (!flashcards.canEdit(cardset_slug, res.locals.user)) {
      res.status(401);
      res.redirect("/");
    } else {
      flashcards.deleteCardById(card_id);
      res.redirect(`/edit/${cardset_slug}`);
    }
  }
});

app.get("/delete/:cardset_slug/:card_id", auth.login_required, (req, res) => {
  res.redirect(`/edit/${req.params.cardset_slug}`);
});

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
});
