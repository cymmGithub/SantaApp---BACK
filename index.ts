import * as express from "express";
import * as cors from "cors";
import "express-async-errors";
import { engine } from "express-handlebars";
import * as methodOverride from "method-override";
import { childRouter } from "./routers/child";
import { giftRouter } from "./routers/gift";
import { handlebarshHelpers } from "./utils/handlebar-helpers";
import "./utils/db";

import { handleError } from "./utils/error";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use("/child", childRouter);
app.use("/gift", giftRouter);

app.use(handleError);

app.listen(3001, "localhost", () => {
  console.log("Listening on 3001...");
});
