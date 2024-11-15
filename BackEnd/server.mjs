import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./Database/Database.js";
import routes from "./Routes/Routes.js";
import cors from "cors";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);
const app = express();

app.use(cors({
    origin: 'http://127.0.0.1:5173' // Allow requests from this origin
}));

// Middleware to handle JSON requests
app.use(express.json());
// Define routes after applying middleware
app.use(routes);

const PORT = 3000;

// Test database connection
pool.query("SELECT NOW()", (error, response) => {
    if (error) {
        console.error("Error connecting to the database", error);
    } else {
        console.log("Connected to the Database");
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});