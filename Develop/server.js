//Global Variables
const express = require("express");
const fs = require("fs");
const path = require("path");
const { clog } = require("./middleware/clog");

const { v4: uuidv4 } = require("uuid");

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "cLog"
app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

// GET Route for homepage
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/index.html"))
);

// GET Route for the Notes page
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "/public/notes.html"))
);

// GET Route to read the db.json file and display the notes
app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    res.json(notes);
  });
});

// POST Route to be able to add to the db.json and diplay the newly added note
app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    notes.push({
      title: req.body.title,
      text: req.body.text,
      id: uuidv4(),
    });
    fs.writeFile("./db/db.json", JSON.stringify(notes), (err) => {
      res.json(notes);
    });
  });
});

//Delete Route to be able to remove a note by its unique ID
app.delete("/api/notes/:id", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    const notes = JSON.parse(data);
    const updatedNotes = notes.filter((note) => {
      return note.id != req.params.id;
    });
    fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err) => {
      res.json(updatedNotes);
    });
  });
});

//Listen to the User PORT
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);
