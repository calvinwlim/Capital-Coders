import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
	user: "postgres",
	host: "localhost",
	host: "73.71.73.100",
	database: "CapitalCoders",
	password: "password123",
	port: 5432,
});

export { pool };
