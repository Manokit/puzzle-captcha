// server.js
const express = require("express");
const { Pool } = require("pg");
const { generateSudoku } = require("./utils/sudokuGenerator");

const app = express();
const port = 3000;

app.use(express.json());

// Database connection
const pool = new Pool({
  user: "your_username",
  host: "localhost",
  database: "sudoku_captcha",
  password: "your_password",
  port: 5432,
});

// Generate Sudoku puzzle
app.post("/generate", async (req, res) => {
  try {
    const { puzzle, solution } = generateSudoku();

    const query =
      "INSERT INTO puzzles(puzzle, solution) VALUES($1, $2) RETURNING id";
    const values = [JSON.stringify(puzzle), JSON.stringify(solution)];

    const result = await pool.query(query, values);

    res.json({ id: result.rows[0].id, puzzle });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Verify Sudoku solution
app.post("/verify", async (req, res) => {
  try {
    const { id, solution } = req.body;

    const query = "SELECT solution FROM puzzles WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Puzzle not found" });
    }

    const correctSolution = result.rows[0].solution;
    const isCorrect =
      JSON.stringify(solution) === JSON.stringify(correctSolution);

    res.json({ success: isCorrect });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
