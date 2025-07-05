import dotenv from "dotenv";
dotenv.config();

import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import { router } from "./api/router";
import path from "path";


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api", router);
app.use(express.static(path.join(__dirname, "../public")));

app.listen(port, function() {
    const port = process.env.PORT || 3000;
    console.log(`Server is running on http://localhost:${port}`);
})
