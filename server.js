const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;

// Load Data
let data = JSON.parse(fs.readFileSync("data.json"));

// Register
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (data.users.find(u => u.email === email)) {
    return res.json("User exists");
  }

  data.users.push({
    email,
    password,
    progress: 0
  });

  save();
  res.json("Registered");
});

// Login
app.post("/login", (req, res) => {

  const { email, password } = req.body;

  const user = data.users.find(
    u => u.email === email && u.password === password
  );

  if (!user) return res.json(null);

  res.json(user);
});

// Update Progress
app.post("/progress", (req, res) => {

  const { email, progress } = req.body;

  const user = data.users.find(u => u.email === email);

  if (user) {
    user.progress = progress;
    save();
  }

  res.json("Updated");
});

function save() {
  fs.writeFileSync("data.json", JSON.stringify(data, null, 2));
}

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
