/** @format */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "./Database/Database.js";
import routes from "./Routes/Routes.js";

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFile);

const app = express();
//app.use(express.static(path.join(currentDirectory, "../FrontEnd/dist")));
app.use(express.json());
app.use(routes);

const PORT = 3000;

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
