import { createPool } from "mysql2/promise";

export const pool = createPool({
  host: "localhost",
  user: "cymm",
  password: "&4hUgrW4LnkcJ5sfV5ogBsTPuYkENA",
  database: "megak_santaApp",
  namedPlaceholders: true,
  decimalNumbers: true,
});
