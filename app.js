const express = require("express");
const pool = require("./database");

const PORT = 3000;

const app = express();
// Automatically parses incoming json from HTTP requests to javascript object
app.use(express.json());

pool.connect();

app.get("/notes", async (req, res) => {
  const { rows } = await pool.query(`SELECT * FROM notes`).catch((error) => {
    res.status(400).send(`Error ${error}`);
  });
  res.status(200).send(rows);
});

app.get("/notes/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { rows } = await pool
    .query(`SELECT * from notes where userid = $1 order by title ASC`, [
      user_id,
    ])
    .catch((error) => {
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(rows);
});

app.delete("/notes/:user_id", async (req, res) => {
  const { user_id } = req.params;

  const { rows } = await pool
    .query("delete from notes where userid = $1 returning notes.*", [user_id])
    .catch((error) => {
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(rows);
});

app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool
    .query(`delete from notes where id = ` + id)
    .catch((error) => {
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(rows);
});

app.put("/notes/:note_id", async (req, res) => {
  const { note_id } = req.params;
  const { title, is_checked } = req.body;

  const result = await pool
    .query(
      'update notes set title = $1, is_checked = $2, updated_at = $3 where id = $4 returning notes.*',
      [title, is_checked, new Date(), note_id]
    )
    .catch((error) => {
      console.log(error)
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(result);
});

app.get("/users", async (req, res) => {
  const { rows } = await pool.query("select * from users").catch((error) => {
    res.status(400).send(`Error ${error}`);
  });

  res.status(200).send(rows);
});

app.delete("/users/:id", async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool
    .query("delete from users where id = $1 returning users.*", [id])
    .catch((error) => {
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(rows);
});

app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

  const { rows } = await pool
    .query(
      "update users set name = $1, email = $2, password = $3 where id = $4 returning users.*",
      [name, email, password, id],
    )
    .catch((error) => {
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(rows);
});

app.post("/users", async (req, res) => {
  const { name, email, password } = req.body;
  if (!email.match("@")) {
    res.status(400).send("Invalid email");
  }

  if (!password) {
    res.status(400).send("invalid password");
  }

  const { rows } = await pool
    .query(
      "insert into users(name, email, password) values($1, $2, $3) returning users.*",
      [name, email, password],
    )
    .catch((error) => {
      res.status(400).send(`Error ${error}`);
    });

  res.status(200).send(rows);
});



app.listen(PORT);
