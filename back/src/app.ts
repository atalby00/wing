import path from "path";
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
// import routing from "./routes";

export const app: Application = express();

const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ["sessionId", "Content-Type"],
  exposedHeaders: ["sessionId"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  prefLightContinue: false,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(cors(corsOptions));

// app.use(routing);

app.listen(3200);
