import express from "express";
import phrasesRouter from "./routes/phrasesRouter";
import saintsRouter from "./routes/saintsRouter";
import connect from "./db/db";

const app = express();
app.use(express.json());
app.set("json spaces", 2);

const PORT = 3000;

app.get("/", (req, res) => {
  res.send("OK");
});

// Initialize database connection and ensure it's populated
try {
  const db = connect();
  app.locals.db = db;

  // Verify database is properly populated
  const saintsCount = db
    .prepare("SELECT COUNT(*) as count FROM saints")
    .get() as { count: number };
  const phrasesCount = db
    .prepare("SELECT COUNT(*) as count FROM phrases")
    .get() as { count: number };

  if (saintsCount.count === 0 || phrasesCount.count === 0) {
    console.error(
      "ERROR: Database is not properly populated. Cannot start server."
    );
    process.exit(1);
  }

  console.log(
    `Database verified: ${saintsCount.count} saints, ${phrasesCount.count} phrases`
  );

  // Add routes
  app.use("/api/phrases/", phrasesRouter);
  app.use("/api/saints/", saintsRouter);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("Database: SQLite");
  });
} catch (error) {
  console.error("ERROR: Failed to initialize database:", error);
  process.exit(1);
}
