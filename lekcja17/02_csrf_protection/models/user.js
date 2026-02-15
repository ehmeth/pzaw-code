import { DatabaseSync } from "node:sqlite";
import argon2 from "argon2";

const PEPPER = process.env.PEPPER;
if (PEPPER == null) {
  console.error(
    "PEPPER environment variable missing. Please create an env file or provide SECRET via environment variables.",
  );
  process.exit(1);
}

const HASH_PARAMS = {
  secret: Buffer.from(PEPPER, "hex"),
};

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

db.exec(`
  CREATE TABLE IF NOT EXISTS fc_users (
    user_id         INTEGER PRIMARY KEY,
    username        TEXT UNIQUE,
    passhash        TEXT,
    attributes      TEXT DEFAULT NULL,
    created_at      INTEGER
  ) STRICT;
  `);

const db_ops = {
  create_user: db.prepare(
    "INSERT INTO fc_users (username, passhash, created_at) VALUES (?, ?, ?) RETURNING user_id AS id;",
  ),
  get_user: db.prepare(
    "SELECT user_id AS id, username, attributes, created_at FROM fc_users WHERE id = ?;",
  ),
  find_by_username: db.prepare(
    "SELECT user_id AS id, username, attributes, created_at FROM fc_users WHERE username = ?;",
  ),
  get_auth_data: db.prepare(
    "SELECT user_id AS id, passhash FROM fc_users WHERE username = ?;",
  ),
  get_attributes: db.prepare(
    `SELECT attributes FROM fc_users WHERE user_id = ?;`,
  ),
  update_attributes: db.prepare(
    `UPDATE fc_users SET attributes = ? WHERE user_id = ?;`,
  ),
};

export async function createUser(username, password) {
  let existing_user = db_ops.find_by_username.get(username);

  if (existing_user != null) {
    return null;
  }
  let createdAt = Date.now();
  let passhash = await argon2.hash(password, HASH_PARAMS);

  return db_ops.create_user.get(username, passhash, createdAt);
}

export async function validatePassword(username, password) {
  let auth_data = db_ops.get_auth_data.get(username);
  if (auth_data != null) {
    if (await argon2.verify(auth_data.passhash, password, HASH_PARAMS)) {
      return auth_data.id;
    }
  }
  return null;
}

export function getUser(userId) {
  let { id, username, attributes, created_at } = db_ops.get_user.get(userId);
  return {
    id,
    username,
    created_at,
    ...JSON.parse(attributes),
  };
}

const forbiddenAttributeNames = new Set([
  "username",
  "id",
  "user_id",
  "passhash",
  "attributes",
  "created_at",
]);
const allowedAttributeValueTypes = new Set(["string", "boolean", "number"]);
const attributeNameRegex = /^[a-z_]+$/;

export function addAttribute(userId, name, value) {
  if (typeof name != "string") {
    return "attribute name must be a string";
  }
  if (forbiddenAttributeNames.has(name)) {
    return "forbidden attribute name";
  }
  if (!name.match(attributeNameRegex)) {
    return "attribute name should consist of lowercase letters and underscores";
  }
  if (!allowedAttributeValueTypes.has(typeof value)) {
    return "only simple value types are allowed";
  }

  let queryResult = db_ops.get_attributes.get(userId);
  let attributes =
    queryResult.attributes != null ? JSON.parse(queryResult.attributes) : {};
  attributes[name] = value;
  db_ops.update_attributes.run(JSON.stringify(attributes), userId);

  return null;
}

export default {
  createUser,
  validatePassword,
  getUser,
  addAttribute,
};
