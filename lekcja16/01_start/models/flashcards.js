import { DatabaseSync } from "node:sqlite";

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

db.exec(
  `CREATE TABLE IF NOT EXISTS fc_cardsets (
    cardset_id    INTEGER PRIMARY KEY,
    slug          TEXT UNIQUE NOT NULL,
    name          TEXT NOT NULL
  ) STRICT;
  CREATE TABLE IF NOT EXISTS fc_cards (
    card_id       INTEGER PRIMARY KEY,
    cardset_id    INTEGER NOT NULL REFERENCES fc_cardsets(cardset_id) ON DELETE NO ACTION,
    front         TEXT NOT NULL,
    back          TEXT NOT NULL
  ) STRICT;`,
);

const db_ops = {
  insert_cardset: db.prepare(
    "INSERT INTO fc_cardsets (slug, name) VALUES (?, ?) RETURNING cardset_id as id, slug, name;",
  ),
  update_cardset_by_slug: db.prepare(
    "UPDATE fc_cardsets SET slug = $new_slug, name = $new_name WHERE slug = $slug RETURNING cardset_id AS id, slug, name;",
  ),
  insert_card_by_cardset_slug: db.prepare(
    `INSERT INTO fc_cards (cardset_id, front, back) VALUES (
      (SELECT cardset_id FROM fc_cardsets WHERE slug = ?),
      ?, 
      ?
    ) 
    RETURNING card_id AS id, front, back;`,
  ),
  get_cardset_summaries: db.prepare("SELECT slug, name FROM fc_cardsets;"),
  get_cardset_summary_by_cardset_id: db.prepare(
    "SELECT slug, name FROM fc_cardsets WHERE cardset_id = ?;",
  ),
  get_cardset_by_slug: db.prepare(
    "SELECT cardset_id AS id, slug, name FROM fc_cardsets WHERE slug = ?;",
  ),
  get_card_by_id: db.prepare(
    "SELECT card_id AS id, front, back FROM fc_cards WHERE card_id = ?;",
  ),
  update_card_by_id: db.prepare(
    "UPDATE fc_cards SET front = ?, back = ? WHERE card_id = ? RETURNING card_id, front, back;",
  ),
  delete_card_by_id: db.prepare("DELETE FROM fc_cards WHERE card_id = ?;"),
  get_cards_by_cardset_id: db.prepare(
    "SELECT card_id AS id, front, back FROM fc_cards WHERE cardset_id = ?;",
  ),
};

export function getCardsetSummaries() {
  var cardsets = db_ops.get_cardset_summaries.all();
  return cardsets;
}

export function getCardsetSummary(cardsetId) {
  var cardsets = db_ops.get_cardset_summary_by_cardset_id.get(cardsetId);
  return cardsets;
}

export function hasCardset(slug) {
  let cardset = db_ops.get_cardset_by_slug.get(slug);
  return cardset != null;
}

export function hasCard(cardId) {
  let cardset = db_ops.get_card_by_id.get(cardId);
  return cardset != null;
}

export function getCardset(slug) {
  let cardset = db_ops.get_cardset_by_slug.get(slug);
  if (cardset != null) {
    cardset.cards = db_ops.get_cards_by_cardset_id.all(cardset.id);
    return cardset;
  }
  return null;
}

export function addCard(cardsetSlug, card) {
  return db_ops.insert_card_by_cardset_slug.get(
    cardsetSlug,
    card.front,
    card.back,
  );
}

export function updateCard(card) {
  return db_ops.update_card_by_id.get(card.front, card.back, card.id);
}

export function deleteCardById(cardId) {
  return db_ops.delete_card_by_id.run(cardId);
}

export function addCardset(slug, name) {
  return db_ops.insert_cardset.get(slug, name);
}

export function updateCardset(slug, newSlug, newName) {
  return db_ops.update_cardset_by_slug.get({
    $slug: slug,
    $new_slug: newSlug,
    $new_name: newName,
  });
}

export function validateCardData(card) {
  var errors = [];
  var fields = ["front", "back"];
  for (let field of fields) {
    if (!card.hasOwnProperty(field)) errors.push(`Missing field '${field}'`);
    else {
      if (typeof card[field] != "string")
        errors.push(`'${field}' expected to be string`);
      else {
        if (card[field].length < 1 || card[field].length > 500)
          errors.push(`'${field}' expected length: 1-500`);
      }
    }
  }
  return errors;
}
export function validateCardsetName(name) {
  var errors = [];
  if (typeof name != "string") {
    errors.push("Cardset name should be a string");
  } else {
    if (name.length < 3 || name.length > 100) {
      errors.push("Cardset name should have 3-100 characters");
    }
  }

  return errors;
}

export function generateCardsetSlug(name) {
  const cardsetId = name
    .toLowerCase()
    .replace(/(\s|[.-])+/g, "-")
    .replace(/[^a-z0-9.-]/g, "");

  return cardsetId;
}

export default {
  getCardsetSummaries,
  getCardsetSummary,
  hasCard,
  hasCardset,
  getCardset,
  addCard,
  updateCard,
  deleteCardById,
  addCardset,
  updateCardset,
  validateCardData,
  validateCardsetName,
  generateCardsetSlug,
};
