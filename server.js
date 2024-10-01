const express = require("express");
const cors = require("cors");
const path = require("path");
const { generateSudoku } = require("./utils/sudokuGenerator");

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// In-memory storage for puzzles
const puzzles = new Map();
let puzzleIdCounter = 1;

app.post("/generate", (req, res) => {
  try {
    const { puzzle, solution } = generateSudoku();
    const id = puzzleIdCounter++;

    puzzles.set(id, { puzzle, solution });

    res.json({ id, puzzle, solution });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/verify", (req, res) => {
  try {
    const { id, solution } = req.body;

    if (!puzzles.has(id)) {
      return res.status(404).json({ error: "Puzzle not found" });
    }

    const { solution: correctSolution } = puzzles.get(id);
    const isCorrect =
      JSON.stringify(solution) === JSON.stringify(correctSolution);

    res.json({ success: isCorrect });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
