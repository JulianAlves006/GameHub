import express from "express";
import { routes } from "./routes.js";
import cors from "cors";
import { AppDataSource } from "./src/data-source.js";

const app = express();
const PORT = 3333;

AppDataSource.initialize().then(() => {
    console.log("Database connected");
    app.emit("ready");
}).catch((error) => {
    console.log("Error connecting to database", error);
});

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/", routes);

// Start server
app.on("ready", () => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});